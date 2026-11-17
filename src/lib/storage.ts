import { mkdir } from "fs/promises";
import path from "path";

export function storageRoot(): string {
  return path.resolve(process.env.STORAGE_ROOT || "./storage");
}

export function exportRoot(): string {
  return path.resolve(process.env.EXPORT_ROOT || "./exports");
}

export function projectPdfDir(projectId: string): string {
  return path.join(storageRoot(), "projects", projectId, "pdfs");
}

export function projectAnalysisDir(projectId: string): string {
  return path.join(storageRoot(), "projects", projectId, "analysis");
}

export function projectNotebooksDir(projectId: string): string {
  return path.join(storageRoot(), "projects", projectId, "notebooks");
}

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

/** Safe single path segment (no traversal). */
export function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 180) || "file.pdf";
}
