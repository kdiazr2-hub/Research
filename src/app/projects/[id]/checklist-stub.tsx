import type { ChecklistItem } from "@/lib/reporting-guidelines";

export function ChecklistStub({
  title,
  guideline,
  version,
  items,
  stubNote,
}: {
  title: string;
  guideline: string;
  version: string;
  items: ChecklistItem[];
  stubNote: string;
}) {
  return (
    <div>
      <p className="meta" style={{ marginTop: 0 }}>
        {guideline} · v{version}
      </p>
      <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.1rem" }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.35rem" }}>
            <label style={{ display: "flex", gap: "0.45rem", alignItems: "flex-start" }}>
              <input type="checkbox" disabled aria-disabled="true" />
              <span>
                {item.section ? (
                  <strong style={{ fontWeight: 550 }}>{item.section}: </strong>
                ) : null}
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="hint">{stubNote}</p>
      <p className="hint" style={{ marginTop: 0 }}>
        {title}
      </p>
    </div>
  );
}
