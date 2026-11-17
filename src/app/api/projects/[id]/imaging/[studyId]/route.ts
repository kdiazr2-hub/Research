import { NextResponse } from "next/server";
import { readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import {
  canAccessImaging,
  canEditImaging,
  canManageRetention,
  requireMembership,
} from "@/lib/permissions";
import type { Role } from "@/lib/types";
import {
  decryptVaultBytes,
  isImagingModality,
  stripImagingIdentifiers,
} from "@/lib/imaging";
import {
  ensureDir,
  projectImagingWorkingDir,
  storageRoot,
} from "@/lib/storage";

type Ctx = { params: Promise<{ id: string; studyId: string }> };

const patchSchema = z.object({
  subjectKey: z.string().min(1).max(120).optional(),
  modality: z.string().min(1).max(16).optional(),
  studyDate: z.string().nullable().optional(),
  accessionStub: z.string().max(80).optional(),
  description: z.string().max(500).optional(),
  /** mark_delete | unmark | purge_stub */
  retentionAction: z.enum(["mark_delete", "unmark", "purge_stub"]).optional(),
});

export async function GET(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, studyId } = await ctx.params;
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
      metadata: { reason: "no_imaging_access", role, studyId },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const study = await prisma.imagingStudy.findFirst({
    where: { id: studyId, projectId: id },
  });
  if (!study) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const want = url.searchParams.get("download");

  if (want === "vault") {
    if (!study.vaultPath || study.retentionStatus === "PURGED") {
      return NextResponse.json({ error: "no_vault_file" }, { status: 404 });
    }
    try {
      const stored = await readFile(path.join(storageRoot(), study.vaultPath));
      const plain = decryptVaultBytes(stored);
      await writeAudit({
        userId: session.user.id,
        projectId: id,
        action: "IMAGING_DOWNLOAD",
        metadata: { studyId, kind: "vault", fileName: study.fileName },
      });
      return new NextResponse(new Uint8Array(plain), {
        headers: {
          "Content-Type": study.contentType || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${study.fileName || "study.bin"}"`,
        },
      });
    } catch {
      return NextResponse.json({ error: "missing_file" }, { status: 404 });
    }
  }

  if (want === "working") {
    if (!study.workingCopyPath) {
      return NextResponse.json({ error: "no_working_copy" }, { status: 404 });
    }
    try {
      const text = await readFile(
        path.join(storageRoot(), study.workingCopyPath),
        "utf8"
      );
      await writeAudit({
        userId: session.user.id,
        projectId: id,
        action: "IMAGING_WORKING_COPY",
        metadata: { studyId, kind: "download" },
      });
      return new NextResponse(text, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${studyId}-working.json"`,
        },
      });
    } catch {
      return NextResponse.json({ error: "missing_file" }, { status: 404 });
    }
  }

  return NextResponse.json({
    id: study.id,
    subjectKey: study.subjectKey,
    modality: study.modality,
    studyDate: study.studyDate,
    accessionStub: study.accessionStub,
    description: study.description,
    fileName: study.fileName,
    fileKind: study.fileKind,
    contentType: study.contentType,
    fileSize: study.fileSize,
    hasVaultFile: Boolean(study.vaultPath),
    hasWorkingCopy: Boolean(study.workingCopyPath),
    retentionStatus: study.retentionStatus,
    markedDeleteAt: study.markedDeleteAt,
    purgedAt: study.purgedAt,
    createdAt: study.createdAt,
    // identifiers stay vault-side; not exposed on GET
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, studyId } = await ctx.params;
  const membership = await requireMembership(session.user.id, id);
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const role = membership.role as Role;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const study = await prisma.imagingStudy.findFirst({
    where: { id: studyId, projectId: id },
  });
  if (!study) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (parsed.data.retentionAction) {
    if (!canManageRetention(role)) {
      await writeAudit({
        userId: session.user.id,
        projectId: id,
        action: "ACCESS_DENIED",
        metadata: { reason: "retention_owner_only", role, studyId },
      });
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    if (parsed.data.retentionAction === "mark_delete") {
      const updated = await prisma.imagingStudy.update({
        where: { id: studyId },
        data: {
          retentionStatus: "MARKED_DELETE",
          markedDeleteAt: new Date(),
        },
      });
      await writeAudit({
        userId: session.user.id,
        projectId: id,
        action: "IMAGING_MARK_DELETE",
        metadata: { studyId, status: "MARKED_DELETE" },
      });
      return NextResponse.json(updated);
    }

    if (parsed.data.retentionAction === "unmark") {
      const updated = await prisma.imagingStudy.update({
        where: { id: studyId },
        data: {
          retentionStatus: "ACTIVE",
          markedDeleteAt: null,
        },
      });
      await writeAudit({
        userId: session.user.id,
        projectId: id,
        action: "IMAGING_MARK_DELETE",
        metadata: { studyId, status: "ACTIVE", unmark: true },
      });
      return NextResponse.json(updated);
    }

    // purge_stub: delete vault bytes if present; keep metadata tombstone
    if (study.vaultPath) {
      try {
        await unlink(path.join(storageRoot(), study.vaultPath));
      } catch {
        // file may already be gone
      }
    }
    const updated = await prisma.imagingStudy.update({
      where: { id: studyId },
      data: {
        retentionStatus: "PURGED",
        purgedAt: new Date(),
        vaultPath: null,
        fileSize: 0,
      },
    });
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "IMAGING_PURGE_STUB",
      metadata: {
        studyId,
        note: "Vault object removed; metadata retained as tombstone. Full scheduled purge job deferred.",
      },
    });
    return NextResponse.json(updated);
  }

  if (!canEditImaging(role, membership.canViewImaging)) {
    await writeAudit({
      userId: session.user.id,
      projectId: id,
      action: "ACCESS_DENIED",
      metadata: { reason: "cannot_edit_imaging", role, studyId },
    });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (parsed.data.modality && !isImagingModality(parsed.data.modality)) {
    return NextResponse.json({ error: "invalid_modality" }, { status: 400 });
  }

  const studyDate =
    parsed.data.studyDate === undefined
      ? undefined
      : parsed.data.studyDate === null
        ? null
        : new Date(
            parsed.data.studyDate.length === 10
              ? `${parsed.data.studyDate}T00:00:00.000Z`
              : parsed.data.studyDate
          );

  const updated = await prisma.imagingStudy.update({
    where: { id: studyId },
    data: {
      subjectKey: parsed.data.subjectKey,
      modality: parsed.data.modality,
      studyDate,
      accessionStub: parsed.data.accessionStub,
      description: parsed.data.description,
    },
  });

  // Refresh working copy after metadata edit
  const working = stripImagingIdentifiers({
    studyId: updated.id,
    projectId: id,
    subjectKey: updated.subjectKey,
    modality: updated.modality,
    studyDate: updated.studyDate,
    accessionStub: updated.accessionStub,
    description: updated.description,
    fileKind: updated.fileKind,
  });
  await ensureDir(projectImagingWorkingDir(id));
  const workingCopyPath =
    updated.workingCopyPath ||
    path
      .join("projects", id, "imaging", "working", `${updated.id}.json`)
      .replace(/\\/g, "/");
  await writeFile(
    path.join(storageRoot(), workingCopyPath),
    JSON.stringify(working, null, 2),
    "utf8"
  );
  if (!updated.workingCopyPath) {
    await prisma.imagingStudy.update({
      where: { id: studyId },
      data: { workingCopyPath },
    });
  }

  await writeAudit({
    userId: session.user.id,
    projectId: id,
    action: "IMAGING_STUDY_UPDATE",
    metadata: { studyId, fields: Object.keys(parsed.data) },
  });

  return NextResponse.json(updated);
}
