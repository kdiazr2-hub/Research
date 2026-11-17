import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canRegisterAnalysis,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { isNotebookKind } from "@/lib/types";
import { jupyterDeepLink } from "@/lib/data-access";
import {
  ensureDir,
  projectNotebooksDir,
  safeFileName,
  storageRoot,
} from "@/lib/storage";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const notebooks = await prisma.notebook.findMany({
    where: { projectId: id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { artifacts: true } } },
  });

  const withLinks = notebooks.map((n) => ({
    ...n,
    openHint: n.externalPath
      ? jupyterDeepLink(n.externalPath)
      : n.storagePath
        ? `Open local copy: ${path.join(storageRoot(), n.storagePath)}`
        : null,
  }));

  return NextResponse.json({
    notebooks: withLinks,
    canRegister: canRegisterAnalysis(membership.role as Role),
    kernelNote:
      "No in-app Jupyter kernel. Open notebooks in VS Code / JupyterLab / Positron. Analysis must use de-ID datasets under analysis/.",
  });
}

const jsonSchema = z.object({
  title: z.string().min(1).max(200),
  kind: z.string().default("ipynb"),
  externalPath: z.string().max(2000).optional(),
  description: z.string().max(2000).optional(),
});

export async function POST(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  if (!canRegisterAnalysis(role)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_register_notebook", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const title = String(form.get("title") || "").trim();
    const kindRaw = String(form.get("kind") || "ipynb");
    const externalPath = String(form.get("externalPath") || "").trim();
    const description = String(form.get("description") || "").trim();
    const file = form.get("file");

    if (!title) {
      return NextResponse.json({ error: "title_required" }, { status: 400 });
    }
    if (!isNotebookKind(kindRaw)) {
      return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
    }

    let storagePath: string | null = null;
    let fileName: string | null = null;
    if (file instanceof File && file.size > 0) {
      const dir = projectNotebooksDir(id);
      await ensureDir(dir);
      fileName = safeFileName(file.name || `notebook.${kindRaw}`);
      const abs = path.join(dir, `${Date.now()}-${fileName}`);
      const buf = Buffer.from(await file.arrayBuffer());
      await writeFile(abs, buf);
      storagePath = path.relative(storageRoot(), abs);
    }

    if (!externalPath && !storagePath) {
      return NextResponse.json(
        { error: "path_or_file_required" },
        { status: 400 }
      );
    }

    const notebook = await prisma.notebook.create({
      data: {
        projectId: id,
        title,
        kind: kindRaw,
        externalPath,
        storagePath,
        fileName,
        description,
        createdById: session.user.id,
      },
    });

    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "NOTEBOOK_REGISTER",
      metadata: {
        notebookId: notebook.id,
        kind: notebook.kind,
        title: notebook.title,
        hasUpload: Boolean(storagePath),
      },
    });

    return NextResponse.json(
      {
        notebook: {
          ...notebook,
          openHint: externalPath
            ? jupyterDeepLink(externalPath)
            : storagePath
              ? `Open local copy: ${path.join(storageRoot(), storagePath)}`
              : null,
        },
      },
      { status: 201 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = jsonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  if (!isNotebookKind(parsed.data.kind)) {
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
  }
  if (!parsed.data.externalPath?.trim()) {
    return NextResponse.json({ error: "path_required" }, { status: 400 });
  }

  const notebook = await prisma.notebook.create({
    data: {
      projectId: id,
      title: parsed.data.title.trim(),
      kind: parsed.data.kind,
      externalPath: parsed.data.externalPath.trim(),
      description: parsed.data.description?.trim() ?? "",
      createdById: session.user.id,
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "NOTEBOOK_REGISTER",
    metadata: {
      notebookId: notebook.id,
      kind: notebook.kind,
      title: notebook.title,
      hasUpload: false,
    },
  });

  return NextResponse.json(
    {
      notebook: {
        ...notebook,
        openHint: jupyterDeepLink(notebook.externalPath),
      },
    },
    { status: 201 }
  );
}
