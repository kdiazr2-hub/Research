export type ParsedReference = {
  citeKey: string;
  entryType: string;
  title: string;
  authors: string;
  year: string;
  journal: string;
  doi: string;
  url: string;
  abstract: string;
  tags: string;
  bibtexRaw: string;
};

function unescapeBib(value: string): string {
  return value
    .replace(/^\s*\{([\s\S]*)\}\s*$/, "$1")
    .replace(/^\s*"([\s\S]*)"\s*$/, "$1")
    .replace(/\\&/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function field(fields: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    const v = fields[k.toLowerCase()];
    if (v) return unescapeBib(v);
  }
  return "";
}

/** Minimal BibTeX entry parser (MVP — not a full TeX engine). */
export function parseBibTeX(input: string): ParsedReference[] {
  const results: ParsedReference[] = [];
  const re =
    /@(\w+)\s*\{\s*([^,\s]+)\s*,([\s\S]*?)\n\s*\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(input)) !== null) {
    const entryType = match[1].toLowerCase();
    if (entryType === "string" || entryType === "comment" || entryType === "preamble") {
      continue;
    }
    const citeKey = match[2].trim();
    const body = match[3];
    const fields: Record<string, string> = {};
    const fieldRe = /(\w+)\s*=\s*(\{(?:[^{}]|\{[^{}]*\})*\}|"[^"]*"|[^,\n]+)/g;
    let fm: RegExpExecArray | null;
    while ((fm = fieldRe.exec(body)) !== null) {
      fields[fm[1].toLowerCase()] = fm[2].trim().replace(/,\s*$/, "");
    }
    const authors = field(fields, "author", "editor");
    const title = field(fields, "title");
    const year = field(fields, "year", "date").slice(0, 4);
    const journal = field(fields, "journal", "booktitle", "publisher");
    const doi = field(fields, "doi");
    const url = field(fields, "url");
    const abstract = field(fields, "abstract");
    const tags = field(fields, "keywords", "tags");
    results.push({
      citeKey,
      entryType,
      title,
      authors,
      year,
      journal,
      doi,
      url,
      abstract,
      tags,
      bibtexRaw: match[0].trim(),
    });
  }
  return results;
}

/** Minimal RIS parser (TY/ER blocks). */
export function parseRIS(input: string): ParsedReference[] {
  const blocks = input
    .replace(/\r\n/g, "\n")
    .split(/\n(?=TY {2}- )/)
    .map((b) => b.trim())
    .filter(Boolean);

  const results: ParsedReference[] = [];
  for (const block of blocks) {
    if (!block.startsWith("TY  - ")) continue;
    const lines = block.split("\n");
    const map: Record<string, string[]> = {};
    for (const line of lines) {
      const m = line.match(/^([A-Z0-9]{2}) {2}- (.*)$/);
      if (!m) continue;
      (map[m[1]] ??= []).push(m[2].trim());
    }
    const entryType = (map.TY?.[0] || "JOUR").toLowerCase();
    const title = map.TI?.[0] || map.T1?.[0] || "";
    const authors = (map.AU || map.A1 || []).join(" and ");
    const year = (map.PY?.[0] || map.Y1?.[0] || "").slice(0, 4);
    const journal = map.JO?.[0] || map.T2?.[0] || map.JF?.[0] || "";
    const doi = (map.DO?.[0] || "").replace(/^https?:\/\/doi\.org\//i, "");
    const url = map.UR?.[0] || "";
    const abstract = map.AB?.[0] || map.N2?.[0] || "";
    const tags = (map.KW || []).join(", ");
    const citeBase =
      (authors.split(/ and |,/i)[0] || "ref")
        .replace(/[^a-zA-Z0-9]+/g, "")
        .slice(0, 24) || "ref";
    const citeKey = `${citeBase}${year || ""}`.toLowerCase() || `ref${results.length + 1}`;
    const bibtexRaw = buildBibtexRaw({
      citeKey,
      entryType: entryType === "jour" || entryType === "article" ? "article" : "misc",
      title,
      authors,
      year,
      journal,
      doi,
      url,
      abstract,
    });
    results.push({
      citeKey,
      entryType: entryType === "jour" ? "article" : entryType,
      title,
      authors,
      year,
      journal,
      doi,
      url,
      abstract,
      tags,
      bibtexRaw,
    });
  }
  return results;
}

export function detectAndParseBibliography(input: string): ParsedReference[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  if (/^TY {2}- /m.test(trimmed) || trimmed.includes("\nER  -")) {
    return parseRIS(trimmed);
  }
  return parseBibTeX(trimmed);
}

export function buildBibtexRaw(r: {
  citeKey: string;
  entryType: string;
  title: string;
  authors: string;
  year: string;
  journal: string;
  doi: string;
  url: string;
  abstract?: string;
}): string {
  const lines = [
    `@${r.entryType || "article"}{${r.citeKey},`,
    r.title ? `  title = {${r.title}},` : "",
    r.authors ? `  author = {${r.authors}},` : "",
    r.year ? `  year = {${r.year}},` : "",
    r.journal ? `  journal = {${r.journal}},` : "",
    r.doi ? `  doi = {${r.doi}},` : "",
    r.url ? `  url = {${r.url}},` : "",
    r.abstract ? `  abstract = {${r.abstract}},` : "",
    "}",
  ].filter(Boolean);
  return lines.join("\n");
}

export function uniqueCiteKey(desired: string, existing: Set<string>): string {
  let key = desired.replace(/[^a-zA-Z0-9_:-]+/g, "") || "ref";
  if (!existing.has(key)) {
    existing.add(key);
    return key;
  }
  let i = 2;
  while (existing.has(`${key}${i}`)) i += 1;
  const next = `${key}${i}`;
  existing.add(next);
  return next;
}
