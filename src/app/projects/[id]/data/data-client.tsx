"use client";

import { useState } from "react";

type Field = {
  id: string;
  key: string;
  name: string;
  fieldType: string;
  isPhi: boolean;
  deidMode: string;
  position: number;
};

type Row = { id: string; values: Record<string, string> };

type ExportRow = {
  id: string;
  fileName: string;
  rowCount: number;
  fieldCount: number;
  phiFieldsStripped: string;
  phiFieldsHashed: string;
  createdAt: string;
};

export function DataClient({
  projectId,
  role,
  initialFields,
  phiHidden,
  initialRows,
  initialExports,
  caps,
  labels,
}: {
  projectId: string;
  role: string;
  initialFields: Field[];
  phiHidden: number;
  initialRows: Row[];
  initialExports: ExportRow[];
  caps: {
    canAccessPhi: boolean;
    canEditSchema: boolean;
    canEditPhi: boolean;
    canEditNonPhi: boolean;
    canExportRaw: boolean;
    canRunDeid: boolean;
  };
  labels: Record<string, string>;
}) {
  const [fields, setFields] = useState(initialFields);
  const [rows, setRows] = useState(initialRows);
  const [exports, setExports] = useState(initialExports);
  const [hiddenPhi, setHiddenPhi] = useState(phiHidden);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("string");
  const [fieldPhi, setFieldPhi] = useState(false);
  const [fieldDeid, setFieldDeid] = useState("strip");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [csvText, setCsvText] = useState("");

  const canWriteRows = caps.canEditPhi || caps.canEditNonPhi;
  const editableFields = fields.filter((f) =>
    f.isPhi ? caps.canEditPhi : caps.canEditNonPhi
  );

  async function refreshMeta() {
    const res = await fetch(`/api/projects/${projectId}/data/fields`);
    if (!res.ok) return;
    const data = await res.json();
    setFields(data.fields);
    setHiddenPhi(data.phiHidden ?? 0);
  }

  async function addField() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/data/fields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fieldName,
          fieldType,
          isPhi: fieldPhi,
          deidMode: fieldDeid,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setFields((prev) => [...prev, data.field]);
      setFieldName("");
      setFieldPhi(false);
      setMsg(labels.success);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function togglePhi(field: Field) {
    if (!caps.canAccessPhi) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/data/fields/${field.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPhi: !field.isPhi }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setFields((prev) =>
        prev.map((f) => (f.id === field.id ? data.field : f))
      );
      setMsg(labels.success);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function removeField(fieldId: string) {
    if (!confirm("Delete field?")) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/data/fields/${fieldId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || labels.error);
      }
      setFields((prev) => prev.filter((f) => f.id !== fieldId));
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function addRow() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/data/rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setRows((prev) => [...prev, data.row]);
      setDraft({});
      setMsg(labels.success);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function removeRow(rowId: string) {
    if (!confirm("Delete row?")) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/data/rows/${rowId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || labels.error);
      }
      setRows((prev) => prev.filter((r) => r.id !== rowId));
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  async function importCsv() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/data/csv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: csvText, createMissingFields: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setCsvText("");
      setMsg(`${labels.success}: ${data.imported}`);
      await refreshMeta();
      const rowsRes = await fetch(`/api/projects/${projectId}/data/rows`);
      if (rowsRes.ok) {
        const rd = await rowsRes.json();
        setRows(rd.rows);
        setFields(rd.fields);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  function downloadCsv(mode: "raw" | "deid") {
    window.location.href = `/api/projects/${projectId}/data/csv?mode=${mode}`;
  }

  async function createDeid() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/data/deid`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setExports((prev) => [data.export, ...prev]);
      setMsg(labels.success);
    } catch (e) {
      setErr(e instanceof Error ? e.message : labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="data-page">
      <p className="meta">{labels.analysisDeidOnly}</p>
      {role === "ANALYST" ? (
        <p className="meta">{labels.analystDeidOnly}</p>
      ) : null}
      {hiddenPhi > 0 || !caps.canAccessPhi ? (
        <p className="hint warn-phi">{labels.phiHiddenNote}</p>
      ) : null}
      {err ? <p className="error">{err}</p> : null}
      {msg ? <p className="meta">{msg}</p> : null}

      <section className="panel">
        <h2>{labels.fields}</h2>
        {fields.length === 0 ? (
          <p className="empty">{labels.noFields}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{labels.fieldName}</th>
                <th>key</th>
                <th>{labels.fieldType}</th>
                <th>{labels.phiField}</th>
                <th>{labels.deidMode}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>
                    <code>{f.key}</code>
                  </td>
                  <td>{f.fieldType}</td>
                  <td>
                    {f.isPhi ? (
                      <span className="badge accent">PHI</span>
                    ) : (
                      "—"
                    )}
                    {caps.canAccessPhi && caps.canEditSchema ? (
                      <button
                        type="button"
                        className="secondary"
                        style={{ marginLeft: "0.4rem" }}
                        disabled={busy}
                        onClick={() => togglePhi(f)}
                      >
                        {f.isPhi ? "unmark" : "PHI"}
                      </button>
                    ) : null}
                  </td>
                  <td>{f.isPhi ? f.deidMode : "—"}</td>
                  <td>
                    {caps.canEditSchema ? (
                      <button
                        type="button"
                        className="secondary"
                        disabled={busy}
                        onClick={() => removeField(f.id)}
                      >
                        {labels.delete}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {caps.canEditSchema ? (
          <div className="inline-form">
            <label>
              {labels.fieldName}
              <input
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
              />
            </label>
            <label>
              {labels.fieldType}
              <select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value)}
              >
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
                <option value="date">date</option>
                <option value="text">text</option>
              </select>
            </label>
            {caps.canAccessPhi ? (
              <>
                <label className="check-inline">
                  <input
                    type="checkbox"
                    checked={fieldPhi}
                    onChange={(e) => setFieldPhi(e.target.checked)}
                  />
                  {labels.phiField}
                </label>
                <label>
                  {labels.deidMode}
                  <select
                    value={fieldDeid}
                    onChange={(e) => setFieldDeid(e.target.value)}
                    disabled={!fieldPhi}
                  >
                    <option value="strip">{labels.deidStrip}</option>
                    <option value="hash">{labels.deidHash}</option>
                  </select>
                </label>
              </>
            ) : null}
            <button
              type="button"
              disabled={busy || !fieldName.trim()}
              onClick={addField}
            >
              {labels.addField}
            </button>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <h2>{labels.rows}</h2>
        <div className="inline-form" style={{ marginBottom: "0.75rem" }}>
          <button
            type="button"
            className="secondary"
            disabled={busy}
            onClick={() => downloadCsv("deid")}
          >
            {labels.exportCsvDeid}
          </button>
          {caps.canExportRaw ? (
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => downloadCsv("raw")}
            >
              {labels.exportCsvRaw}
            </button>
          ) : null}
          {caps.canRunDeid ? (
            <button type="button" disabled={busy} onClick={createDeid}>
              {labels.createDeidDataset}
            </button>
          ) : null}
        </div>

        {fields.length === 0 ? (
          <p className="empty">{labels.noFields}</p>
        ) : rows.length === 0 ? (
          <p className="empty">{labels.noRows}</p>
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  {fields.map((f) => (
                    <th key={f.id}>
                      {f.name}
                      {f.isPhi ? " *" : ""}
                    </th>
                  ))}
                  {caps.canEditPhi ? <th /> : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    {fields.map((f) => (
                      <td key={f.id}>{r.values[f.key] ?? ""}</td>
                    ))}
                    {caps.canEditPhi ? (
                      <td>
                        <button
                          type="button"
                          className="secondary"
                          disabled={busy}
                          onClick={() => removeRow(r.id)}
                        >
                          {labels.delete}
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {canWriteRows && editableFields.length > 0 ? (
          <div className="inline-form" style={{ marginTop: "1rem" }}>
            {editableFields.map((f) => (
              <label key={f.id}>
                {f.name}
                {f.isPhi ? " *" : ""}
                <input
                  value={draft[f.key] ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [f.key]: e.target.value }))
                  }
                />
              </label>
            ))}
            <button type="button" disabled={busy} onClick={addRow}>
              {labels.addRow}
            </button>
          </div>
        ) : null}

        {canWriteRows ? (
          <div style={{ marginTop: "1rem" }}>
            <label>
              {labels.importCsv}
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="col_a,col_b&#10;1,2"
              />
            </label>
            <button
              type="button"
              disabled={busy || !csvText.trim()}
              onClick={importCsv}
              style={{ marginTop: "0.5rem" }}
            >
              {labels.importCsv}
            </button>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <h2>{labels.deidDatasets}</h2>
        {exports.length === 0 ? (
          <p className="empty">{labels.noDeidExports}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>file</th>
                <th>rows</th>
                <th>stripped</th>
                <th>hashed</th>
                <th>when</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {exports.map((e) => (
                <tr key={e.id}>
                  <td>
                    <code>{e.fileName}</code>
                  </td>
                  <td>{e.rowCount}</td>
                  <td>{e.phiFieldsStripped || "—"}</td>
                  <td>{e.phiFieldsHashed || "—"}</td>
                  <td>{new Date(e.createdAt).toLocaleString()}</td>
                  <td>
                    <a
                      href={`/api/projects/${projectId}/data/deid/${e.id}`}
                    >
                      CSV
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
