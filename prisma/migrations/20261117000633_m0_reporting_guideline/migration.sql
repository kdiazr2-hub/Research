-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'LITERATURE',
    "reportingGuideline" TEXT NOT NULL DEFAULT 'OTHER',
    "reportingGuidelineVersion" TEXT NOT NULL DEFAULT 'n/a',
    "phiType" TEXT NOT NULL DEFAULT 'NONE',
    "consentDocumented" BOOLEAN NOT NULL DEFAULT false,
    "consentDocUrl" TEXT,
    "legalBasis" TEXT,
    "retentionDestroyAt" DATETIME,
    "analysisDeidDefault" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("analysisDeidDefault", "consentDocUrl", "consentDocumented", "createdAt", "description", "id", "legalBasis", "name", "phiType", "retentionDestroyAt", "status", "updatedAt") SELECT "analysisDeidDefault", "consentDocUrl", "consentDocumented", "createdAt", "description", "id", "legalBasis", "name", "phiType", "retentionDestroyAt", "status", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
