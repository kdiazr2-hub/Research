import type { Role } from "@/lib/types";
import {
  canAccessPhiTable,
  canEditNonPhiRows,
  canEditPhiRows,
} from "@/lib/permissions";

export type FieldLite = {
  id: string;
  key: string;
  name: string;
  fieldType: string;
  isPhi: boolean;
  deidMode: string;
  position: number;
};

/** Fields visible to the current member (PHI columns hidden without grant). */
export function visibleFields(
  fields: FieldLite[],
  role: Role,
  canViewPhi: boolean
): FieldLite[] {
  if (canAccessPhiTable(role, canViewPhi)) return fields;
  return fields.filter((f) => !f.isPhi);
}

export function parseRowValues(valuesJson: string): Record<string, string> {
  try {
    const obj = JSON.parse(valuesJson) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = v == null ? "" : String(v);
    }
    return out;
  } catch {
    return {};
  }
}

/** Redact PHI keys from a row for non-PHI viewers. */
export function redactRowValues(
  values: Record<string, string>,
  fields: FieldLite[],
  role: Role,
  canViewPhi: boolean
): Record<string, string> {
  if (canAccessPhiTable(role, canViewPhi)) return values;
  const phiKeys = new Set(fields.filter((f) => f.isPhi).map((f) => f.key));
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    if (!phiKeys.has(k)) out[k] = v;
  }
  return out;
}

/**
 * Merge incoming values with existing, enforcing PHI write rules.
 * Returns null if the caller tried to write PHI without permission.
 */
export function mergeRowValues(params: {
  existing: Record<string, string>;
  incoming: Record<string, string>;
  fields: FieldLite[];
  role: Role;
  canViewPhi: boolean;
}): { values: Record<string, string>; deniedPhiWrite: boolean } {
  const { existing, incoming, fields, role, canViewPhi } = params;
  const byKey = new Map(fields.map((f) => [f.key, f]));
  const canPhi = canEditPhiRows(role, canViewPhi);
  const canNonPhi = canEditNonPhiRows(role) || canPhi;

  if (!canNonPhi && !canPhi) {
    return { values: existing, deniedPhiWrite: true };
  }

  let deniedPhiWrite = false;
  const next = { ...existing };

  for (const [key, raw] of Object.entries(incoming)) {
    const field = byKey.get(key);
    if (!field) continue;
    if (field.isPhi) {
      if (!canPhi) {
        deniedPhiWrite = true;
        continue;
      }
      next[key] = String(raw);
    } else if (canNonPhi) {
      next[key] = String(raw);
    }
  }

  return { values: next, deniedPhiWrite };
}

export function jupyterDeepLink(filePath: string): string {
  // vscode://file/... opens locally when the VS Code URL handler is registered.
  const normalized = filePath.replace(/\\/g, "/");
  if (
    normalized.startsWith("vscode://") ||
    normalized.startsWith("file://") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("https://")
  ) {
    return normalized;
  }
  return `vscode://file${normalized.startsWith("/") ? "" : "/"}${normalized}`;
}
