import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canEditLiterature,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import {
  ensureDir,
  projectPdfDir,
  safeFileName,
  storageRoot,
} from "@/lib/storage";

type Ctx = { params: Promise<{ id: string; refId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, refId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const reference = await prisma.reference.findFirst({
    where: { id: refId, projectId: id },
  });
  if (!reference?.pdfPath) {
    return NextResponse.json({ error: "no_pdf" }, { status: 404 });
  }

  const abs = path.join(storageRoot(), reference.pdfPath);
  try {
    const buf = await readFile(abs);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${reference.pdfFileName || "paper.pdf"}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "missing_file" }, { status: 404 });
  }
}

export async function POST(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, refId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canEditLiterature(role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_attach_pdf", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const reference = await prisma.reference.findFirst({
    where: { id: refId, projectId: id },
  });
  if (!reference) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  if (file.type && file.type !== "application/pdf") {
    return NextResponse.json({ error: "pdf_only" }, { status: 400 });
  }
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "too_large" }, { status: 400 });
  }

  const dir = projectPdfDir(id);
  await ensureDir(dir);
  const name = safeFileName(file.name || `${reference.citeKey}.pdf`);
  const diskName = `${refId}-${name}`;
  const abs = path.join(dir, diskName);
  const relative = path.join("projects", id, "pdfs", diskName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(abs, bytes);

  const updated = await prisma.reference.update({
    where: { id: refId },
    data: { pdfPath: relative, pdfFileName: name },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "REFERENCE_PDF_ATTACH",
    metadata: { citeKey: reference.citeKey, fileName: name, bytes: bytes.length },
  });

  return NextResponse.json({ reference: updated });
}
