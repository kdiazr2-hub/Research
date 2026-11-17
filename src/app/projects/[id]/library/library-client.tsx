"use client";

import { useState } from "react";

type RefRow = {
  id: string;
  citeKey: string;
  title: string;
  authors: string;
  year: string;
  journal: string;
  doi: string;
  pdfPath: string | null;
  pdfFileName: string | null;
  _count?: { notes: number };
};

export function LibraryClient({
  projectId,
  initial,
  canEdit,
  labels,
}: {
  projectId: string;
  initial: RefRow[];
  canEdit: boolean;
  labels: {
    import: string;
    pasteBib: string;
    attachPdf: string;
    delete: string;
    notes: string;
    empty: string;
    readonly: string;
    error: string;
    success: string;
    phiSafe: string;
  };
}) {
  const [refs, setRefs] = useState(initial);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function importText() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/references`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setRefs((prev) => [...data.references, ...prev]);
      setText("");
      setMsg(`${labels.success}: ${data.imported}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function attachPdf(refId: string, file: File) {
    setBusy(true);
    setErr(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(
        `/api/projects/${projectId}/references/${refId}/pdf`,
        { method: "POST", body: form }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setRefs((prev) =>
        prev.map((r) => (r.id === refId ? { ...r, ...data.reference } : r))
      );
      setMsg(labels.success);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function remove(refId: string) {
    if (!confirm("Delete reference?")) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/references/${refId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || labels.error);
      }
      setRefs((prev) => prev.filter((r) => r.id !== refId));
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel-grid">
      <p className="hint" style={{ marginTop: 0 }}>
        {labels.phiSafe}
      </p>
      {!canEdit ? <p className="hint">{labels.readonly}</p> : null}

      {canEdit ? (
        <section className="panel">
          <h2>{labels.import}</h2>
          <div className="form-stack">
            <label>
              {labels.pasteBib}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder={"@article{smith2020,\n  title={...},\n  author={...},\n  year={2020}\n}"}
              />
            </label>
            <button type="button" disabled={busy || !text.trim()} onClick={importText}>
              {labels.import}
            </button>
          </div>
          {err ? <p className="error">{err}</p> : null}
          {msg ? <p className="hint">{msg}</p> : null}
        </section>
      ) : null}

      <section className="panel">
        {refs.length === 0 ? (
          <p className="empty">{labels.empty}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Title</th>
                <th>Year</th>
                <th>PDF</th>
                <th>{labels.notes}</th>
                {canEdit ? <th /> : null}
              </tr>
            </thead>
            <tbody>
              {refs.map((r) => (
                <tr key={r.id}>
                  <td>
                    <code>@{r.citeKey}</code>
                  </td>
                  <td>
                    <strong>{r.title || "—"}</strong>
                    <div className="meta">{r.authors}</div>
                    {r.journal ? <div className="meta">{r.journal}</div> : null}
                  </td>
                  <td>{r.year || "—"}</td>
                  <td>
                    {r.pdfPath ? (
                      <a
                        href={`/api/projects/${projectId}/references/${r.id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {r.pdfFileName || "PDF"}
                      </a>
                    ) : canEdit ? (
                      <label className="file-attach">
                        {labels.attachPdf}
                        <input
                          type="file"
                          accept="application/pdf"
                          disabled={busy}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void attachPdf(r.id, f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{r._count?.notes ?? 0}</td>
                  {canEdit ? (
                    <td>
                      <button
                        type="button"
                        className="secondary"
                        disabled={busy}
                        onClick={() => void remove(r.id)}
                      >
                        {labels.delete}
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
