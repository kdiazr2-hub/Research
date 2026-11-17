import { getGuideline, pickLocale } from "@/lib/equator";

/** Seed Markdown draft from EQUATOR section outline. */
export function seedManuscriptMarkdown(
  projectName: string,
  guidelineId: string,
  locale: string
): string {
  const g = getGuideline(guidelineId);
  const lines: string[] = [
    `---`,
    `title: "${projectName.replace(/"/g, '\\"')}"`,
    `bibliography: references.bib`,
    `---` ,
    ``,
    `# ${projectName}`,
    ``,
    `> Draft seeded from **${g.id} ${g.version}** outline. Insert citations as \`[@citeKey]\`.`,
    ``,
  ];
  for (const section of g.sections) {
    const title = pickLocale(section.title, locale);
    lines.push(`## ${title}`);
    lines.push(``);
    lines.push(`<!-- TODO: ${section.id} -->`);
    lines.push(``);
  }
  lines.push(`## References`);
  lines.push(``);
  lines.push(`::: {#refs}`);
  lines.push(`:::`);
  lines.push(``);
  return lines.join("\n");
}
