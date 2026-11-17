"use client";

import { useState } from "react";

type Notebook = {
  id: string;
  title: string;
  kind: string;
  externalPath: string;
  fileName: string | null;
  description: string;
  openHint: string | null;
  artifactCount: number;
};

type Artifact = {
  id: string;
  title: string;
  kind: string;
  pathOrUrl: string;
  provenanceJson: string;
  notebook: { id: string; title: string; kind: string } | null;
};

type ExportOpt = {
  id: string;
  fileName: string;
  relativePath: string;
};

export function AnalysisClient({
  projectId,
  canRegister,
  role,
  initialNotebooks,
  initialArtifacts,
  exports,
  labels,
}: {
  projectId: string;
  canRegister: boolean;
  role: string;
  initialNotebooks: Notebook[];
  initialArtifacts: Artifact[];
  exports: ExportOpt[];
  labels: Record<string, string>;
}) {
  const [notebooks, setNotebooks] = useState(initialNotebooks);
  const [artifacts, setArtifacts] = useState(initialArtifacts);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("ipynb");
  const [path, setPath] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [aTitle, setATitle] = useState("");
  const [aKind, setAKind] = useState("figure");
  const [aPath, setAPath] = useState("");
  const [aNotebook, setANotebook] = useState("");
  const [aExport, setAExport] = useState("");
  const [aNotes, setANotes] = useState("");

  async function registerNotebook() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      let res: Response;
      if (file) {
        const form = new FormData();
        form.append("title", title);
        form.append("kind", kind);
        form.append("externalPath", path);
        form.append("description", description);
        form.append("file", file);
        res = await fetch(`/api/projects/${projectId}/notebooks`, {
          method: "POST",
          body: form,
        });
      } else {
        res = await fetch(`/api/projects/${projectId}/notebooks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            kind,
            externalPath: path,
            description,
          }),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setNotebooks((prev) => [
        { ...data.notebook, artifactCount: 0 },
        ...prev,
      ]);
      setTitle("");
      setPath("");
      setDescription("");
      setFile(null);
      setMsg(labels.success);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function removeNotebook(id: string) {
    if (!confirm("Delete notebook registration?")) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/notebooks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || labels.error);
      }
      setNotebooks((prev) => prev.filter((n) => n.id !== id));
      setArtifacts((prev) =>
        prev.map((a) =>
          a.notebook?.id === id ? { ...a, notebook: null } : a
        )
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function registerArtifact() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/artifacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aTitle,
          kind: aKind,
          pathOrUrl: aPath,
          notebookId: aNotebook || null,
          provenance: {
            analysisExportId: aExport || undefined,
            datasetPath: aExport
              ? exports.find((e) => e.id === aExport)?.relativePath
              : undefined,
            notes: aNotes || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setArtifacts((prev) => [data.artifact, ...prev]);
      setATitle("");
      setAPath("");
      setANotes("");
      setMsg(labels.success);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function removeArtifact(id: string) {
    if (!confirm("Delete artifact?")) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/artifacts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || labels.error);
      }
      setArtifacts((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="analysis-page">
      <p className="meta">{labels.analysisDeidOnly}</p>
      <p className="hint">{labels.openInstructions}</p>
      {role === "ANALYST" ? (
        <p className="meta">Analyst · de-ID datasets only for table access</p>
      ) : null}
      {err ? <p className="error">{err}</p> : null}
      {msg ? <p className="meta">{msg}</p> : null}

      <section className="panel">
        <h2>{labels.notebooks}</h2>
        {notebooks.length === 0 ? (
          <p className="empty">{labels.noNotebooks}</p>
        ) : (
          <ul className="note-list">
            {notebooks.map((n) => (
              <li key={n.id} className="note-card">
                <div className="note-card-head">
                  <div>
                    <strong>{n.title}</strong>{" "}
                    <span className="badge">{n.kind}</span>
                    <div className="meta">
                      {n.externalPath || n.fileName || "—"} · artifacts:{" "}
                      {n.artifactCount}
                    </div>
                    {n.description ? (
                      <div className="meta">{n.description}</div>
                    ) : null}
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {n.openHint ? (
                      <a
                        className="btn secondary"
                        href={n.openHint}
                        title={n.openHint}
                      >
                        {labels.openExternal}
                      </a>
                    ) : null}
                    {canRegister ? (
                      <button
                        type="button"
                        className="secondary"
                        disabled={busy}
                        onClick={() => removeNotebook(n.id)}
                      >
                        {labels.delete}
                      </button>
                    ) : null}
                  </div>
                </div>
                {n.openHint ? (
                  <pre className="export-howto">{n.openHint}</pre>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {canRegister ? (
          <div className="form-stack" style={{ marginTop: "1rem" }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)" }}>
              {labels.registerNotebook}
            </h3>
            <label>
              {labels.notebookTitle}
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
              {labels.notebookKind}
              <select value={kind} onChange={(e) => setKind(e.target.value)}>
                <option value="ipynb">.ipynb</option>
                <option value="py">.py</option>
                <option value="qmd">.qmd</option>
              </select>
            </label>
            <label>
              {labels.notebookPath}
              <input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/path/to/analysis.ipynb or vscode://file/..."
              />
            </label>
            <label>
              {labels.description}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label className="file-attach">
              {labels.notebookUpload}
              <input
                type="file"
                accept=".ipynb,.py,.qmd"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <button
              type="button"
              disabled={busy || !title.trim() || (!path.trim() && !file)}
              onClick={registerNotebook}
            >
              {labels.registerNotebook}
            </button>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <h2>{labels.artifacts}</h2>
        {artifacts.length === 0 ? (
          <p className="empty">{labels.noArtifacts}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>title</th>
                <th>{labels.artifactKind}</th>
                <th>{labels.linkNotebook}</th>
                <th>{labels.provenance}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {artifacts.map((a) => {
                let prov = "{}";
                try {
                  prov = JSON.stringify(JSON.parse(a.provenanceJson), null, 0);
                } catch {
                  prov = a.provenanceJson;
                }
                return (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.title}</strong>
                      <div className="meta">{a.pathOrUrl || "—"}</div>
                    </td>
                    <td>
                      <span className="badge">{a.kind}</span>
                    </td>
                    <td>{a.notebook?.title ?? "—"}</td>
                    <td>
                      <code style={{ fontSize: "0.75rem" }}>{prov}</code>
                    </td>
                    <td>
                      {canRegister ? (
                        <button
                          type="button"
                          className="secondary"
                          disabled={busy}
                          onClick={() => removeArtifact(a.id)}
                        >
                          {labels.delete}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {canRegister ? (
          <div className="form-stack" style={{ marginTop: "1rem" }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)" }}>
              {labels.registerArtifact}
            </h3>
            <label>
              {labels.notebookTitle}
              <input
                value={aTitle}
                onChange={(e) => setATitle(e.target.value)}
              />
            </label>
            <label>
              {labels.artifactKind}
              <select value={aKind} onChange={(e) => setAKind(e.target.value)}>
                <option value="figure">figure</option>
                <option value="table">table</option>
                <option value="other">other</option>
              </select>
            </label>
            <label>
              {labels.artifactPath}
              <input
                value={aPath}
                onChange={(e) => setAPath(e.target.value)}
                placeholder="figures/fig1.png"
              />
            </label>
            <label>
              {labels.linkNotebook}
              <select
                value={aNotebook}
                onChange={(e) => setANotebook(e.target.value)}
              >
                <option value="">—</option>
                {notebooks.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {labels.linkDataset}
              <select
                value={aExport}
                onChange={(e) => setAExport(e.target.value)}
              >
                <option value="">—</option>
                {exports.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fileName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {labels.provenance}
              <textarea
                value={aNotes}
                onChange={(e) => setANotes(e.target.value)}
                placeholder="Used de-ID CSV; no raw PHI"
              />
            </label>
            <button
              type="button"
              disabled={busy || !aTitle.trim()}
              onClick={registerArtifact}
            >
              {labels.registerArtifact}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
