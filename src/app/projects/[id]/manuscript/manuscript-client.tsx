"use client";

import { useRef, useState } from "react";

type CiteOpt = {
  id: string;
  citeKey: string;
  title: string;
  authors: string;
  year: string;
};

export function ManuscriptClient({
  projectId,
  initialTitle,
  initialMarkdown,
  references,
  canEdit,
  labels,
}: {
  projectId: string;
  initialTitle: string;
  initialMarkdown: string;
  references: CiteOpt[];
  canEdit: boolean;
  labels: {
    title: string;
    save: string;
    reseed: string;
    insertCite: string;
    citeHint: string;
    readonly: string;
    error: string;
    success: string;
  };
}) {
  const [title, setTitle] = useState(initialTitle);
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [citeKey, setCiteKey] = useState(references[0]?.citeKey ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  function insertCitation() {
    if (!citeKey || !taRef.current) return;
    const el = taRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const token = `[@${citeKey}]`;
    const next =
      markdown.slice(0, start) + token + markdown.slice(end);
    setMarkdown(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    });
  }

  async function save(reseed = false) {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/manuscript`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          reseed ? { reseed: true } : { title, markdown }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setTitle(data.manuscript.title);
      setMarkdown(data.manuscript.markdown);
      setMsg(labels.success);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel-grid">
      {!canEdit ? <p className="hint">{labels.readonly}</p> : null}
      <section className="panel">
        <div className="form-stack">
          <label>
            {labels.title}
            <input
              value={title}
              disabled={!canEdit || busy}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          {canEdit ? (
            <div className="inline-form">
              <label>
                {labels.insertCite}
                <select
                  value={citeKey}
                  onChange={(e) => setCiteKey(e.target.value)}
                  disabled={!references.length}
                >
                  {references.length === 0 ? (
                    <option value="">—</option>
                  ) : (
                    references.map((r) => (
                      <option key={r.id} value={r.citeKey}>
                        @{r.citeKey} ({r.year || "?"})
                      </option>
                    ))
                  )}
                </select>
              </label>
              <button
                type="button"
                className="secondary"
                disabled={!citeKey || busy}
                onClick={insertCitation}
              >
                {labels.insertCite}
              </button>
            </div>
          ) : null}
          <p className="hint" style={{ margin: 0 }}>
            {labels.citeHint}
          </p>

          <label>
            Markdown
            <textarea
              ref={taRef}
              className="manuscript-editor"
              value={markdown}
              disabled={!canEdit || busy}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={22}
              spellCheck
            />
          </label>

          {canEdit ? (
            <div className="inline-form">
              <button type="button" disabled={busy} onClick={() => void save(false)}>
                {labels.save}
              </button>
              <button
                type="button"
                className="secondary"
                disabled={busy}
                onClick={() => {
                  if (confirm("Reseed from EQUATOR outline? Unsaved edits will be lost after save.")) {
                    void save(true);
                  }
                }}
              >
                {labels.reseed}
              </button>
            </div>
          ) : null}
          {err ? <p className="error">{err}</p> : null}
          {msg ? <p className="hint">{msg}</p> : null}
        </div>
      </section>
    </div>
  );
}
