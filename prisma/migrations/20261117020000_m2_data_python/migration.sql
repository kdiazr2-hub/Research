-- M2: tabular data fields/rows, de-ID analysis exports, notebooks, artifacts

CREATE TABLE "DataField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL DEFAULT 'string',
    "isPhi" BOOLEAN NOT NULL DEFAULT false,
    "deidMode" TEXT NOT NULL DEFAULT 'strip',
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DataField_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "DataField_projectId_key_key" ON "DataField"("projectId", "key");
CREATE INDEX "DataField_projectId_position_idx" ON "DataField"("projectId", "position");

CREATE TABLE "DataRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "valuesJson" TEXT NOT NULL DEFAULT '{}',
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DataRow_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "DataRow_projectId_createdAt_idx" ON "DataRow"("projectId", "createdAt");

CREATE TABLE "AnalysisExport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "relativePath" TEXT NOT NULL,
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "fieldCount" INTEGER NOT NULL DEFAULT 0,
    "phiFieldsStripped" TEXT NOT NULL DEFAULT '',
    "phiFieldsHashed" TEXT NOT NULL DEFAULT '',
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalysisExport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "AnalysisExport_projectId_createdAt_idx" ON "AnalysisExport"("projectId", "createdAt");

CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'ipynb',
    "externalPath" TEXT NOT NULL DEFAULT '',
    "storagePath" TEXT,
    "fileName" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notebook_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Notebook_projectId_idx" ON "Notebook"("projectId");

CREATE TABLE "AnalysisArtifact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "notebookId" TEXT,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'figure',
    "pathOrUrl" TEXT NOT NULL DEFAULT '',
    "provenanceJson" TEXT NOT NULL DEFAULT '{}',
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AnalysisArtifact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AnalysisArtifact_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "AnalysisArtifact_projectId_idx" ON "AnalysisArtifact"("projectId");
CREATE INDEX "AnalysisArtifact_notebookId_idx" ON "AnalysisArtifact"("notebookId");
