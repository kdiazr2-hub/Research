"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Section = { id: string; title: string };
type Item = {
  key: string;
  code: string;
  section: string;
  title: string;
  checked: boolean;
  notes: string;
};

export function EquatorPanel({
  projectId,
  canEdit,
  locale,
  sourceUrl,
  citation,
  sections,
  items: initialItems,
  labels,
}: {
  projectId: string;
  canEdit: boolean;
  locale: string;
  sourceUrl: string;
  citation: string;
  sections: Section[];
  items: Item[];
  labels: {
    sectionsOutline: string;
    checklist: string;
    notes: string;
    progress: string;
    source: string;
    saved: string;
    error: string;
  };
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const done = items.filter((i) => i.checked).length;
  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const item of items) {
      const list = map.get(item.section) ?? [];
      list.push(item);
      map.set(item.section, list);
    }
    return [...map.entries()];
  }, [items]);

  async function patchItem(
    itemKey: string,
    patch: { checked?: boolean; notes?: string }
  ) {
    setPendingKey(itemKey);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/projects/${projectId}/checklist`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemKey, ...patch }),
    });
    setPendingKey(null);
    if (!res.ok) {
      setError(labels.error);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === itemKey ? { ...i, ...patch } : i))
    );
    setMessage(labels.saved);
    router.refresh();
  }

  return (
    <div className="panel-grid two">
      <section className="panel">
        <h2>{labels.sectionsOutline}</h2>
        <ol className="section-outline">
          {sections.map((s) => (
            <li key={s.id}>{s.title}</li>
          ))}
        </ol>
        <p className="hint">
          <a href={sourceUrl} target="_blank" rel="noreferrer">
            {labels.source}
          </a>
          {" · "}
          {citation}
        </p>
      </section>

      <section className="panel">
        <h2>
          {labels.checklist}{" "}
          <span className="badge accent">
            {labels.progress}: {done}/{items.length}
          </span>
        </h2>
        <div className="checklist-scroll">
          {grouped.map(([section, sectionItems]) => (
            <div key={section} className="checklist-group">
              <h3>{section}</h3>
              <ul className="checklist-list">
                {sectionItems.map((item) => (
                  <li key={item.key}>
                    <label className="checklist-row">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        disabled={!canEdit || pendingKey === item.key}
                        onChange={(e) =>
                          patchItem(item.key, { checked: e.target.checked })
                        }
                      />
                      <span>
                        <span className="badge">{item.code}</span> {item.title}
                      </span>
                    </label>
                    {canEdit ? (
                      <input
                        className="checklist-notes"
                        placeholder={labels.notes}
                        defaultValue={item.notes}
                        disabled={pendingKey === item.key}
                        onBlur={(e) => {
                          const next = e.target.value;
                          if (next !== item.notes) {
                            patchItem(item.key, { notes: next });
                          }
                        }}
                      />
                    ) : item.notes ? (
                      <p className="hint">{item.notes}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {error ? <p className="error">{error}</p> : null}
        {message ? <p className="hint">{message}</p> : null}
        <p className="hint" lang={locale}>
          EQUATOR · {sourceUrl.replace("https://", "")}
        </p>
      </section>
    </div>
  );
}
