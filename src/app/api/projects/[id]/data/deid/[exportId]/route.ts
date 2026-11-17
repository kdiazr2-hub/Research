import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { canReadDeid, requireMembership } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { storageRoot } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string; exportId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, exportId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canReadDeid(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const record = await prisma.analysisExport.findFirst({
    where: { id: exportId, projectId: id },
  });
  if (!record) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const abs = path.join(storageRoot(), record.relativePath);
  // Prevent path traversal outside storage root
  if (!abs.startsWith(storageRoot())) {
    return NextResponse.json({ error: "invalid_path" }, { status: 400 });
  }

  try {
    const buf = await readFile(abs);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${record.fileName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "file_missing" }, { status: 404 });
  }
}
