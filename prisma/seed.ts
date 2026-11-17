import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { getGuideline } from "../src/lib/equator";
import { seedManuscriptMarkdown } from "../src/lib/manuscript";
import {
  encryptVaultBytes,
  makeAccessionStub,
  stripImagingIdentifiers,
} from "../src/lib/imaging";
import {
  ensureDir,
  projectImagingVaultDir,
  projectImagingWorkingDir,
  storageRoot,
} from "../src/lib/storage";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const owner = await prisma.user.upsert({
    where: { email: "kevin@example.com" },
    update: {},
    create: {
      email: "kevin@example.com",
      name: "Kevin",
      passwordHash,
      locale: "es",
    },
  });

  const collab = await prisma.user.upsert({
    where: { email: "ana@example.com" },
    update: {},
    create: {
      email: "ana@example.com",
      name: "Ana Collaborator",
      passwordHash,
      locale: "en",
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: "luis@example.com" },
    update: {},
    create: {
      email: "luis@example.com",
      name: "Luis Analyst",
      passwordHash,
      locale: "es",
    },
  });

  const existing = await prisma.project.findFirst({
    where: { name: "Synthetic CT observational pilot" },
  });

  let projectId = existing?.id;
  if (existing) {
    await prisma.project.update({
      where: { id: existing.id },
      data: {
        reportingGuideline: "CARE",
        reportingGuidelineVersion: "2013",
      },
    });
    const count = await prisma.checklistItem.count({ where: { projectId: existing.id } });
    if (count === 0) {
      await prisma.checklistItem.createMany({
        data: getGuideline("CARE").checklist.map((item) => ({
          projectId: existing.id,
          itemKey: item.key,
          checked: false,
          notes: "",
        })),
      });
    }
  }
  if (!existing) {
    const project = await prisma.project.create({
      data: {
        name: "Synthetic CT observational pilot",
        description:
          "Fixture medical project with synthetic (non-real) PHI flags for M0 demo.",
        status: "LITERATURE",
        reportingGuideline: "CARE",
        reportingGuidelineVersion: "2013",
        phiType: "PHI_IMAGING",
        consentDocumented: true,
        consentDocUrl: "https://example.org/consent-protocol.pdf",
        legalBasis: "IRB waiver demo — synthetic data only",
        analysisDeidDefault: true,
        retentionDestroyAt: new Date("2028-12-31T00:00:00.000Z"),
        memberships: {
          create: [
            {
              userId: owner.id,
              role: "OWNER",
              canViewPhi: true,
              canViewImaging: true,
            },
            {
              userId: collab.id,
              role: "COLLABORATOR",
              canViewPhi: false,
              canViewImaging: false,
            },
            {
              userId: analyst.id,
              role: "ANALYST",
              canViewPhi: false,
              canViewImaging: false,
            },
          ],
        },
      },
    });
    projectId = project.id;

    await prisma.checklistItem.createMany({
      data: getGuideline("CARE").checklist.map((item) => ({
        projectId: project.id,
        itemKey: item.key,
        checked: false,
        notes: "",
      })),
    });

    await prisma.auditLog.create({
      data: {
        userId: owner.id,
        projectId: project.id,
        action: "PROJECT_CREATE",
        metadata: JSON.stringify({ seed: true, name: project.name }),
      },
    });
  } else {
    await prisma.membership.upsert({
      where: {
        projectId_userId: { projectId: existing.id, userId: analyst.id },
      },
      update: {},
      create: {
        projectId: existing.id,
        userId: analyst.id,
        role: "ANALYST",
        canViewPhi: false,
        canViewImaging: false,
      },
    });
  }

  if (projectId) {
    const refCount = await prisma.reference.count({ where: { projectId } });
    if (refCount === 0) {
      const smith = await prisma.reference.create({
        data: {
          projectId,
          citeKey: "smith2020",
          entryType: "article",
          title: "Synthetic cohort imaging outcomes in rare presentation",
          authors: "Smith, J. and Doe, A.",
          year: "2020",
          journal: "Demo Medical Journal",
          doi: "10.1000/demo.2020.001",
          abstract: "Synthetic literature fixture — no real patient data.",
          bibtexRaw: `@article{smith2020,
  title = {Synthetic cohort imaging outcomes in rare presentation},
  author = {Smith, J. and Doe, A.},
  year = {2020},
  journal = {Demo Medical Journal},
  doi = {10.1000/demo.2020.001}
}`,
        },
      });
      await prisma.reference.create({
        data: {
          projectId,
          citeKey: "gagnier2013",
          entryType: "article",
          title: "The CARE guidelines: consensus-based clinical case reporting guideline development",
          authors: "Gagnier, J. J. and Kienle, G. and Altman, D. G. and Moher, D. and Sox, H. and Riley, D.",
          year: "2013",
          journal: "BMJ Case Reports",
          doi: "10.1136/bcr-2013-201554",
          bibtexRaw: `@article{gagnier2013,
  title = {The CARE guidelines: consensus-based clinical case reporting guideline development},
  author = {Gagnier, J. J. and Kienle, G. and Altman, D. G. and Moher, D. and Sox, H. and Riley, D.},
  year = {2013},
  journal = {BMJ Case Reports},
  doi = {10.1136/bcr-2013-201554}
}`,
        },
      });
      await prisma.note.create({
        data: {
          projectId,
          referenceId: smith.id,
          authorId: owner.id,
          title: "Key finding for intro",
          body: "Use this synthetic citation to support the uniqueness claim in the CARE abstract.",
          pageStub: "4",
          highlightStub: "rare presentation with imaging follow-up",
        },
      });
    }

    const ms = await prisma.manuscript.findUnique({ where: { projectId } });
    if (!ms) {
      const project = await prisma.project.findUniqueOrThrow({
        where: { id: projectId },
      });
      await prisma.manuscript.create({
        data: {
          projectId,
          title: project.name,
          markdown:
            seedManuscriptMarkdown(project.name, project.reportingGuideline, "es") +
            "\nEvidence from the synthetic cohort supports the presentation [@smith2020].\n",
        },
      });
    }

    // M2 fixture: synthetic tabular fields + rows + notebook registration
    const fieldCount = await prisma.dataField.count({ where: { projectId } });
    if (fieldCount === 0) {
      await prisma.dataField.createMany({
        data: [
          {
            projectId,
            name: "Subject ID",
            key: "subject_id",
            fieldType: "string",
            isPhi: true,
            deidMode: "hash",
            position: 0,
          },
          {
            projectId,
            name: "Age (years)",
            key: "age_years",
            fieldType: "number",
            isPhi: false,
            deidMode: "strip",
            position: 1,
          },
          {
            projectId,
            name: "Modality",
            key: "modality",
            fieldType: "string",
            isPhi: false,
            deidMode: "strip",
            position: 2,
          },
          {
            projectId,
            name: "MRN",
            key: "mrn",
            fieldType: "string",
            isPhi: true,
            deidMode: "strip",
            position: 3,
          },
        ],
      });
      await prisma.dataRow.createMany({
        data: [
          {
            projectId,
            createdById: owner.id,
            valuesJson: JSON.stringify({
              subject_id: "SYN-001",
              age_years: "54",
              modality: "CT",
              mrn: "MRN-DEMO-111",
            }),
          },
          {
            projectId,
            createdById: owner.id,
            valuesJson: JSON.stringify({
              subject_id: "SYN-002",
              age_years: "61",
              modality: "CT",
              mrn: "MRN-DEMO-222",
            }),
          },
        ],
      });
      await prisma.auditLog.create({
        data: {
          userId: owner.id,
          projectId,
          action: "DATA_FIELD_PHI_MARK",
          metadata: JSON.stringify({
            seed: true,
            keys: ["subject_id", "mrn"],
          }),
        },
      });
    }

    const nbCount = await prisma.notebook.count({ where: { projectId } });
    if (nbCount === 0) {
      const nb = await prisma.notebook.create({
        data: {
          projectId,
          title: "Synthetic CT outcomes (stub)",
          kind: "ipynb",
          externalPath: "/workspace/research/analysis/ct_outcomes.ipynb",
          description:
            "Stub notebook registration — open externally; use analysis/ de-ID CSV only.",
          createdById: analyst.id,
        },
      });
      await prisma.analysisArtifact.create({
        data: {
          projectId,
          notebookId: nb.id,
          title: "Figure 1 — age distribution (synthetic)",
          kind: "figure",
          pathOrUrl: "figures/fig1_age_hist.png",
          provenanceJson: JSON.stringify({
            notes: "Seed stub — derived from de-ID analysis CSV, not raw PHI",
            datasetPath: "projects/<id>/analysis/deid-*.csv",
          }),
          createdById: analyst.id,
        },
      });
      await prisma.auditLog.create({
        data: {
          userId: analyst.id,
          projectId,
          action: "NOTEBOOK_REGISTER",
          metadata: JSON.stringify({ seed: true, notebookId: nb.id }),
        },
      });
    }

    // M3 fixture: imaging vault metadata + encrypted synthetic PNG stub
    const imgCount = await prisma.imagingStudy.count({ where: { projectId } });
    if (imgCount === 0) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          retentionDestroyAt: new Date("2028-12-31T00:00:00.000Z"),
        },
      });

      const studyDate = new Date("2024-06-15T00:00:00.000Z");
      const accessionStub = makeAccessionStub(projectId, "SYN-001");
      const study = await prisma.imagingStudy.create({
        data: {
          projectId,
          subjectKey: "SYN-001",
          modality: "CT",
          studyDate,
          accessionStub,
          description: "Synthetic chest CT fixture — no real patient",
          identifiersJson: JSON.stringify({
            patientName: "DOE^SYNTHETIC",
            mrn: "MRN-DEMO-111",
          }),
          fileKind: "png",
          contentType: "image/png",
          createdById: owner.id,
        },
      });

      // Minimal valid 1x1 PNG
      const png = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "base64"
      );
      await ensureDir(projectImagingVaultDir(projectId));
      const vaultRel = path
        .join(
          "projects",
          projectId,
          "imaging",
          "vault",
          `${study.id}-seed-ct.png.enc`
        )
        .replace(/\\/g, "/");
      await writeFile(
        path.join(storageRoot(), vaultRel),
        encryptVaultBytes(png)
      );

      const working = stripImagingIdentifiers({
        studyId: study.id,
        projectId,
        subjectKey: "SYN-001",
        modality: "CT",
        studyDate,
        accessionStub,
        description: "Synthetic chest CT fixture — no real patient",
        fileKind: "png",
      });
      await ensureDir(projectImagingWorkingDir(projectId));
      const workingRel = path
        .join("projects", projectId, "imaging", "working", `${study.id}.json`)
        .replace(/\\/g, "/");
      await writeFile(
        path.join(storageRoot(), workingRel),
        JSON.stringify(working, null, 2),
        "utf8"
      );

      await prisma.imagingStudy.update({
        where: { id: study.id },
        data: {
          fileName: "seed-ct.png",
          vaultPath: vaultRel,
          workingCopyPath: workingRel,
          fileSize: png.length,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: owner.id,
          projectId,
          action: "IMAGING_STUDY_CREATE",
          metadata: JSON.stringify({ seed: true, studyId: study.id }),
        },
      });
      await prisma.auditLog.create({
        data: {
          userId: owner.id,
          projectId,
          action: "RETENTION_SET",
          metadata: JSON.stringify({
            seed: true,
            after: "2028-12-31T00:00:00.000Z",
          }),
        },
      });
    }
  }

  console.log("Seed OK");
  console.log("  Owner:   kevin@example.com / password123");
  console.log("  Collab:  ana@example.com / password123");
  console.log("  Analyst: luis@example.com / password123");
  console.log("  Project:", projectId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
