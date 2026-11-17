import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

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
          ],
        },
      },
    });
    projectId = project.id;

    await prisma.auditLog.create({
      data: {
        userId: owner.id,
        projectId: project.id,
        action: "PROJECT_CREATE",
        metadata: JSON.stringify({ seed: true, name: project.name }),
      },
    });
  }

  console.log("Seed OK");
  console.log("  Owner:  kevin@example.com / password123");
  console.log("  Collab: ana@example.com / password123");
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
