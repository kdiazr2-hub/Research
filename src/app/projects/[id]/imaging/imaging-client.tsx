"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { IMAGING_MODALITIES } from "@/lib/imaging";

type Study = {
  id: string;
  subjectKey: string;
  modality: string;
  studyDate: string | null;
  accessionStub: string;
  description: string;
  fileName: string | null;
  fileKind: string;
  fileSize: number;
  hasVaultFile: boolean;
  hasWorkingCopy: boolean;
  retentionStatus: string;
  markedDeleteAt: string | null;
  purgedAt: string | null;
  createdAt: string;
};

export function ImagingClient({
  projectId,
  canEdit,
  canRetention,
  initialStudies,
  retentionDestroyAt,
  labels,
}: {
  projectId: string;
  canEdit: boolean;
  canRetention: boolean;
  initialStudies: Study[];
  retentionDestroyAt: string | null;
  labels: Record<string, string>;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [studies, setStudies] = useState(initialStudies);

  async function refresh() {
    const res = await fetch(`/api/projects/${projectId}/imaging`);
    if (res.ok) {
      const data = await res.json();
      setStudies(data);
    }
    router.refresh();
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const identifiers: Record<string, string> = {};
    const patientName = String(fd.get("patientName") || "").trim();
    const mrn = String(fd.get("mrn") || "").trim();
    if (patientName) identifiers.patientName = patientName;
    if (mrn) identifiers.mrn = mrn;
    fd.set("identifiers", JSON.stringify(identifiers));
    fd.delete("patientName");
    fd.delete("mrn");

    const res = await fetch(`/api/projects/${projectId}/imaging`, {
      method: "POST",
      body: fd,
    });
    setPending(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.hint || labels.error);
      return;
    }
    form.reset();
    setMessage(labels.success);
    await refresh();
  }

  async function retentionAction(
    studyId: string,
    action: "mark_delete" | "unmark" | "purge_stub"
  ) {
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/projects/${projectId}/imaging/${studyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retentionAction: action }),
    });
    if (!res.ok) {
      setError(labels.error);
      return;
    }
    setMessage(labels.success);
    await refresh();
  }

  async function setRetentionDate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = String(fd.get("retentionDestroyAt") || "").trim();
    const res = await fetch(`/api/projects/${projectId}/retention`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        retentionDestroyAt: raw ? new Date(raw).toISOString() : null,
      }),
    });
    if (!res.ok) {
      setError(labels.error);
      return;
    }
    setMessage(labels.success);
    router.refresh();
  }

  return (
    <div className="stack-lg">
      <p className="hint">{labels.imagingVaultNote}</p>
      <p className="hint">{labels.noImagingToNotebooks}</p>

      {canRetention ? (
        <section className="panel">
          <h2>{labels.retention}</h2>
          <form className="inline-form" onSubmit={setRetentionDate}>
            <label>
              {labels.retentionDate}
              <input
                name="retentionDestroyAt"
                type="date"
                defaultValue={
                  retentionDestroyAt
                    ? retentionDestroyAt.slice(0, 10)
                    : ""
                }
              />
            </label>
            <button type="submit">{labels.save}</button>
          </form>
          <p className="meta">{labels.retentionStubNote}</p>
        </section>
      ) : null}

      {canEdit ? (
        <section className="panel">
          <h2>{labels.addStudy}</h2>
          <form className="form-stack" onSubmit={onCreate}>
            <label>
              {labels.subjectKey}
              <input name="subjectKey" required placeholder="SYN-001" />
            </label>
            <label>
              {labels.modality}
              <select name="modality" defaultValue="CT">
                {IMAGING_MODALITIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {labels.studyDate}
              <input name="studyDate" type="date" />
            </label>
            <label>
              {labels.accessionStub}
              <input
                name="accessionStub"
                placeholder={labels.accessionAuto}
              />
            </label>
            <label>
              {labels.description}
              <input name="description" />
            </label>
            <label>
              {labels.patientNameVaultOnly}
              <input name="patientName" placeholder="vault-only" />
            </label>
            <label>
              {labels.mrnVaultOnly}
              <input name="mrn" placeholder="vault-only" />
            </label>
            <label>
              {labels.uploadFile}
              <input name="file" type="file" accept=".dcm,.dicom,.png,.jpg,.jpeg,.nii,.gz,.zip" />
            </label>
            <button type="submit" disabled={pending}>
              {labels.addStudy}
            </button>
          </form>
        </section>
      ) : null}

      <section className="panel">
        <h2>{labels.studies}</h2>
        {studies.length === 0 ? (
          <p className="empty">{labels.noStudies}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{labels.subjectKey}</th>
                <th>{labels.modality}</th>
                <th>{labels.studyDate}</th>
                <th>{labels.accessionStub}</th>
                <th>File</th>
                <th>{labels.retention}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {studies.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div>{s.subjectKey}</div>
                    <div className="meta">{s.description || "—"}</div>
                  </td>
                  <td>
                    <span className="badge accent">{s.modality}</span>
                  </td>
                  <td>
                    {s.studyDate
                      ? new Date(s.studyDate).toISOString().slice(0, 10)
                      : "—"}
                  </td>
                  <td>
                    <code style={{ fontSize: "0.75rem" }}>
                      {s.accessionStub}
                    </code>
                  </td>
                  <td>
                    {s.hasVaultFile ? (
                      <>
                        <div>{s.fileName}</div>
                        <div className="meta">
                          {s.fileKind} · {(s.fileSize / 1024).toFixed(1)} KB
                        </div>
                        <a
                          href={`/api/projects/${projectId}/imaging/${s.id}?download=vault`}
                        >
                          {labels.downloadVault}
                        </a>
                        {" · "}
                      </>
                    ) : (
                      <span className="meta">meta only</span>
                    )}
                    {s.hasWorkingCopy ? (
                      <a
                        href={`/api/projects/${projectId}/imaging/${s.id}?download=working`}
                      >
                        {labels.downloadWorking}
                      </a>
                    ) : null}
                  </td>
                  <td>
                    <span className="badge">{s.retentionStatus}</span>
                  </td>
                  <td>
                    {canRetention && s.retentionStatus === "ACTIVE" ? (
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => retentionAction(s.id, "mark_delete")}
                      >
                        {labels.markDelete}
                      </button>
                    ) : null}
                    {canRetention && s.retentionStatus === "MARKED_DELETE" ? (
                      <>
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => retentionAction(s.id, "unmark")}
                        >
                          Unmark
                        </button>{" "}
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => retentionAction(s.id, "purge_stub")}
                        >
                          {labels.purgeStub}
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="hint">{message}</p> : null}
    </div>
  );
}
