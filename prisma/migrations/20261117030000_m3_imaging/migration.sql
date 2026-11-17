-- M3: imaging vault studies + retention status on study objects
CREATE TABLE "ImagingStudy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "subjectKey" TEXT NOT NULL,
    "modality" TEXT NOT NULL DEFAULT 'OT',
    "studyDate" DATETIME,
    "accessionStub" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "fileName" TEXT,
    "vaultPath" TEXT,
    "fileKind" TEXT NOT NULL DEFAULT 'other',
    "contentType" TEXT NOT NULL DEFAULT 'application/octet-stream',
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "identifiersJson" TEXT NOT NULL DEFAULT '{}',
    "workingCopyPath" TEXT,
    "retentionStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "markedDeleteAt" DATETIME,
    "purgedAt" DATETIME,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ImagingStudy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ImagingStudy_projectId_studyDate_idx" ON "ImagingStudy"("projectId", "studyDate");
CREATE INDEX "ImagingStudy_projectId_retentionStatus_idx" ON "ImagingStudy"("projectId", "retentionStatus");
CREATE INDEX "ImagingStudy_projectId_subjectKey_idx" ON "ImagingStudy"("projectId", "subjectKey");
