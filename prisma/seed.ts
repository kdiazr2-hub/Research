import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { getGuideline } from "../src/lib/equator";
import { seedManuscriptMarkdown } from "../src/lib/manuscript";

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
