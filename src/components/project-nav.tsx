import Link from "next/link";

export type ProjectNavKey =
  | "overview"
  | "library"
  | "notes"
  | "data"
  | "analysis"
  | "manuscript"
  | "export";

export function ProjectNav({
  projectId,
  active,
  labels,
}: {
  projectId: string;
  active: ProjectNavKey;
  labels: {
    overview: string;
    library: string;
    notes: string;
    data: string;
    analysis: string;
    manuscript: string;
    export: string;
  };
}) {
  const items = [
    { key: "overview" as const, href: `/projects/${projectId}`, label: labels.overview },
    { key: "library" as const, href: `/projects/${projectId}/library`, label: labels.library },
    { key: "notes" as const, href: `/projects/${projectId}/notes`, label: labels.notes },
    { key: "data" as const, href: `/projects/${projectId}/data`, label: labels.data },
    {
      key: "analysis" as const,
      href: `/projects/${projectId}/analysis`,
      label: labels.analysis,
    },
    {
      key: "manuscript" as const,
      href: `/projects/${projectId}/manuscript`,
      label: labels.manuscript,
    },
    { key: "export" as const, href: `/projects/${projectId}/export`, label: labels.export },
  ];

  return (
    <nav className="project-nav" aria-label="Project">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={item.key === active ? "active" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
