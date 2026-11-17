"use client";

import { useMemo, useState } from "react";

type RefOpt = { id: string; citeKey: string; title: string };
type NoteRow = {
  id: string;
  title: string;
  body: string;
  pageStub: string;
  highlightStub: string;
  reference: { id: string; citeKey: string; title: string };
  author: { email: string | null; name: string | null } | null;
  updatedAt: string;
};

export function NotesClient({
  projectId,
  references,
  initial,
  canEdit,
  labels,
}: {
  projectId: string;
  references: RefOpt[];
  initial: NoteRow[];
  canEdit: boolean;
  labels: {
    newNote: string;
    title: string;
    body: string;
    page: string;
    highlight: string;
    reference: string;
    save: string;
    delete: string;
    empty: string;
    readonly: string;
    error: string;
    success: string;
  };
}) {
  const [notes, setNotes] = useState(initial);
  const [referenceId, setReferenceId] = useState(references[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pageStub, setPageStub] = useState("");
  const [highlightStub, setHighlightStub] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const refLabel = useMemo(() => {
    const map = new Map(references.map((r) => [r.id, r]));
    return (id: string) => map.get(id);
  }, [references]);

  async function createNote() {
    if (!referenceId) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId,
          title,
          body,
          pageStub,
          highlightStub,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setNotes((prev) => [
        { ...data.note, updatedAt: data.note.updatedAt },
        ...prev,
      ]);
      setTitle("");
      setBody("");
      setPageStub("");
      setHighlightStub("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function remove(noteId: string) {
    if (!confirm("Delete note?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(labels.error);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel-grid">
      {!canEdit ? <p className="hint">{labels.readonly}</p> : null}
      {canEdit && references.length > 0 ? (
        <section className="panel">
          <h2>{labels.newNote}</h2>
          <div className="form-stack">
            <label>
              {labels.reference}
              <select
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
              >
                {references.map((r) => (
                  <option key={r.id} value={r.id}>
                    @{r.citeKey} — {r.title || "untitled"}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {labels.title}
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
              {labels.body}
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} />
            </label>
            <div className="inline-form">
              <label>
                {labels.page}
                <input
                  value={pageStub}
                  onChange={(e) => setPageStub(e.target.value)}
                  placeholder="12"
                />
              </label>
              <label style={{ flex: 1 }}>
                {labels.highlight}
                <input
                  value={highlightStub}
                  onChange={(e) => setHighlightStub(e.target.value)}
                  placeholder="quoted phrase…"
                />
              </label>
            </div>
            <button type="button" disabled={busy} onClick={() => void createNote()}>
              {labels.save}
            </button>
            {err ? <p className="error">{err}</p> : null}
          </div>
        </section>
      ) : null}

      <section className="panel">
        {notes.length === 0 ? (
          <p className="empty">{labels.empty}</p>
        ) : (
          <ul className="note-list">
            {notes.map((n) => (
              <li key={n.id} className="note-card">
                <div className="note-card-head">
                  <strong>{n.title || "—"}</strong>
                  <span className="badge accent">@{n.reference.citeKey}</span>
                </div>
                {(n.pageStub || n.highlightStub) && (
                  <p className="meta">
                    {n.pageStub ? `p.${n.pageStub}` : ""}
                    {n.pageStub && n.highlightStub ? " · " : ""}
                    {n.highlightStub ? `“${n.highlightStub}”` : ""}
                  </p>
                )}
                <p style={{ whiteSpace: "pre-wrap" }}>{n.body}</p>
                <div className="meta">
                  {n.author?.name || n.author?.email || "—"} ·{" "}
                  {new Date(n.updatedAt).toLocaleString()}
                  {refLabel(n.reference.id)?.title
                    ? ` · ${refLabel(n.reference.id)?.title}`
                    : ""}
                </div>
                {canEdit ? (
                  <button
                    type="button"
                    className="secondary"
                    disabled={busy}
                    onClick={() => void remove(n.id)}
                  >
                    {labels.delete}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
