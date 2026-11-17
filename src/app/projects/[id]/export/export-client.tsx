"use client";

import { useState } from "react";

export function ExportClient({
  projectId,
  labels,
}: {
  projectId: string;
  labels: {
    exportZip: string;
    exportDocx: string;
    exportTex: string;
    howto: string;
    pandocHint: string;
    error: string;
  };
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function download(format: "zip" | "docx" | "tex") {
    setBusy(true);
    setErr(null);
    setInfo(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/export?format=${format}`,
        { method: "POST" }
      );
      const ctype = res.headers.get("content-type") || "";
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || labels.error);
      }
      if (ctype.includes("application/json")) {
        const data = await res.json();
        setInfo(data.pandoc?.message || data.hint || JSON.stringify(data));
        return;
      }
      const blob = await res.blob();
      const pandocMsg = res.headers.get("X-Export-Pandoc");
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download =
        format === "docx"
          ? "manuscript.docx"
          : format === "tex"
            ? "manuscript.tex"
            : "manuscript-export.zip";
      a.click();
      URL.revokeObjectURL(url);
      if (pandocMsg) setInfo(pandocMsg);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <div className="form-stack">
        <p className="hint" style={{ marginTop: 0 }}>
          {labels.pandocHint}
        </p>
        <div className="inline-form">
          <button type="button" disabled={busy} onClick={() => void download("zip")}>
            {labels.exportZip}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={busy}
            onClick={() => void download("docx")}
          >
            {labels.exportDocx}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={busy}
            onClick={() => void download("tex")}
          >
            {labels.exportTex}
          </button>
        </div>
        <pre className="export-howto">{labels.howto}</pre>
        {err ? <p className="error">{err}</p> : null}
        {info ? <p className="hint">{info}</p> : null}
      </div>
    </section>
  );
}
