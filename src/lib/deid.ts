import { createHash } from "crypto";

export type DeidField = {
  key: string;
  name: string;
  isPhi: boolean;
  /** hash | strip */
  deidMode: string;
};

export type DeidResult = {
  headers: string[];
  rows: Record<string, string>[];
  strippedKeys: string[];
  hashedKeys: string[];
};

function hashValue(projectId: string, key: string, value: string): string {
  const salt = process.env.DEID_SALT || "local-deid-salt";
  return createHash("sha256")
    .update(`${salt}|${projectId}|${key}|${value}`)
    .digest("hex")
    .slice(0, 16);
}

/** Build a de-identified table: strip or hash PHI columns; keep non-PHI as-is. */
export function deidentifyRows(
  projectId: string,
  fields: DeidField[],
  rows: Record<string, string>[]
): DeidResult {
  const strippedKeys: string[] = [];
  const hashedKeys: string[] = [];
  const keep: { key: string; mode: "keep" | "hash" }[] = [];

  for (const f of fields) {
    if (!f.isPhi) {
      keep.push({ key: f.key, mode: "keep" });
      continue;
    }
    if (f.deidMode === "hash") {
      hashedKeys.push(f.key);
      keep.push({ key: f.key, mode: "hash" });
    } else {
      strippedKeys.push(f.key);
    }
  }

  const headers = keep.map((k) => k.key);
  const out = rows.map((row) => {
    const next: Record<string, string> = {};
    for (const col of keep) {
      const raw = row[col.key] ?? "";
      next[col.key] =
        col.mode === "hash" ? hashValue(projectId, col.key, String(raw)) : String(raw);
    }
    return next;
  });

  return { headers, rows: out, strippedKeys, hashedKeys };
}

export function rowsToCsv(
  headers: string[],
  rows: Record<string, string>[]
): string {
  const escape = (v: string) => {
    if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
    return v;
  };
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h] ?? "")).join(","));
  }
  return lines.join("\n") + "\n";
}

export function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cur += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur);
    return cells;
  };

  const headers = parseLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

export function slugifyFieldKey(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return base || "field";
}
