import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canAccessImaging,
  canEditImaging,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import {
  detectImagingKind,
  encryptVaultBytes,
  isAllowedImagingUpload,
  isImagingModality,
  makeAccessionStub,
  stripImagingIdentifiers,
} from "@/lib/imaging";
import {
  ensureDir,
  projectImagingVaultDir,
  projectImagingWorkingDir,
  safeFileName,
  storageRoot,
} from "@/lib/storage";

type Ctx = { params: Promise<{ id: string }> };

const metaSchema = z.object({
  subjectKey: z.string().min(1).max(120),
  modality: z.string().min(1).max(16),
  studyDate: z.string().optional().nullable(),
  accessionStub: z.string().max(80).optional(),
  description: z.string().max(500).optional(),
  identifiers: z.record(z.string(), z.string()).optional(),
});

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

  const role = membership.role as Role;
  if (!canAccessImaging(role, membership.canViewImaging)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "no_imaging_access", role },
    });
    return NextResponse.json(
      {
        error: "forbidden",
        hint: "Imaging requires Owner or Investigator with imaging grant. Manuscript access does not include imaging.",
      },
      { status: 403 }
    );
  }

  const studies = await prisma.imagingStudy.findMany({
    where: { projectId: id },
    orderBy: [{ studyDate: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(
    studies.map((s) => ({
      id: s.id,
      subjectKey: s.subjectKey,
      modality: s.modality,
      studyDate: s.studyDate,
      accessionStub: s.accessionStub,
      description: s.description,
      fileName: s.fileName,
      fileKind: s.fileKind,
      contentType: s.contentType,
      fileSize: s.fileSize,
      hasVaultFile: Boolean(s.vaultPath),
      hasWorkingCopy: Boolean(s.workingCopyPath),
      retentionStatus: s.retentionStatus,
      markedDeleteAt: s.markedDeleteAt,
      purgedAt: s.purgedAt,
      createdAt: s.createdAt,
    }))
  );
}

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
  if (!canEditImaging(role, membership.canViewImaging)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_edit_imaging", role },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const contentType = req.headers.get("content-type") || "";
  let meta: z.infer<typeof metaSchema>;
  let fileBuf: Buffer | null = null;
  let uploadName: string | null = null;
  let uploadMime = "application/octet-stream";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const parsed = metaSchema.safeParse({
      subjectKey: String(form.get("subjectKey") || ""),
      modality: String(form.get("modality") || "OT"),
      studyDate: form.get("studyDate") ? String(form.get("studyDate")) : null,
      accessionStub: form.get("accessionStub")
        ? String(form.get("accessionStub"))
        : undefined,
      description: form.get("description")
        ? String(form.get("description"))
        : undefined,
      identifiers: (() => {
        const raw = form.get("identifiers");
        if (!raw) return undefined;
        try {
          return JSON.parse(String(raw));
        } catch {
          return undefined;
        }
      })(),
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }
    meta = parsed.data;
    const file = form.get("file");
    if (file && typeof file !== "string" && "arrayBuffer" in file) {
      uploadName = file.name || "study.bin";
      if (!isAllowedImagingUpload(uploadName)) {
        return NextResponse.json(
          {
            error: "unsupported_format",
            allowed: [
              ".dcm",
              ".dicom",
              ".png",
              ".jpg",
              ".jpeg",
              ".nii",
              ".nii.gz",
              ".zip",
            ],
          },
          { status: 400 }
        );
      }
      uploadMime = file.type || "application/octet-stream";
      fileBuf = Buffer.from(await file.arrayBuffer());
    }
  } else {
    const body = await req.json().catch(() => null);
    const parsed = metaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }
    meta = parsed.data;
  }

  if (!isImagingModality(meta.modality)) {
    return NextResponse.json({ error: "invalid_modality" }, { status: 400 });
  }

  const accessionStub =
    meta.accessionStub?.trim() ||
    makeAccessionStub(id, meta.subjectKey.trim());
  const studyDate = meta.studyDate
    ? new Date(
        meta.studyDate.length === 10
          ? `${meta.studyDate}T00:00:00.000Z`
          : meta.studyDate
      )
    : null;

  const study = await prisma.imagingStudy.create({
    data: {
      projectId: id,
      subjectKey: meta.subjectKey.trim(),
      modality: meta.modality,
      studyDate:
        studyDate && !Number.isNaN(studyDate.getTime()) ? studyDate : null,
      accessionStub,
      description: meta.description?.trim() || "",
      identifiersJson: JSON.stringify(meta.identifiers ?? {}),
      createdById: session.user.id,
    },
  });

  let vaultPath: string | null = null;
  let fileKind = "other";
  let fileSize = 0;
  let fileName: string | null = null;

  if (fileBuf && uploadName) {
    fileName = safeFileName(uploadName);
    fileKind = detectImagingKind(fileName, uploadMime);
    fileSize = fileBuf.length;
    await ensureDir(projectImagingVaultDir(id));
    vaultPath = path
      .join("projects", id, "imaging", "vault", `${study.id}-${fileName}.enc`)
      .replace(/\\/g, "/");
    await writeFile(
      path.join(storageRoot(), vaultPath),
      encryptVaultBytes(fileBuf)
    );

    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "IMAGING_UPLOAD",
      metadata: {
        studyId: study.id,
        fileName,
        fileKind,
        fileSize,
      },
    });
  }

  const working = stripImagingIdentifiers({
    studyId: study.id,
    projectId: id,
    subjectKey: study.subjectKey,
    modality: study.modality,
    studyDate: study.studyDate,
    accessionStub: study.accessionStub,
    description: study.description,
    fileKind,
  });
  await ensureDir(projectImagingWorkingDir(id));
  const workingCopyPath = path
    .join("projects", id, "imaging", "working", `${study.id}.json`)
    .replace(/\\/g, "/");
  await writeFile(
    path.join(storageRoot(), workingCopyPath),
    JSON.stringify(working, null, 2),
    "utf8"
  );

  const updated = await prisma.imagingStudy.update({
    where: { id: study.id },
    data: {
      fileName,
      vaultPath,
      workingCopyPath,
      fileKind,
      contentType: uploadMime,
      fileSize,
    },
  });

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "IMAGING_STUDY_CREATE",
    metadata: {
      studyId: study.id,
      subjectKey: study.subjectKey,
      modality: study.modality,
      hasFile: Boolean(vaultPath),
    },
  });
  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "IMAGING_WORKING_COPY",
    metadata: { studyId: study.id, path: workingCopyPath },
  });

  return NextResponse.json(
    {
      id: updated.id,
      subjectKey: updated.subjectKey,
      modality: updated.modality,
      studyDate: updated.studyDate,
      accessionStub: updated.accessionStub,
      description: updated.description,
      fileName: updated.fileName,
      fileKind: updated.fileKind,
      fileSize: updated.fileSize,
      hasVaultFile: Boolean(updated.vaultPath),
      hasWorkingCopy: Boolean(updated.workingCopyPath),
      retentionStatus: updated.retentionStatus,
      workingCopy: working,
    },
    { status: 201 }
  );
}
