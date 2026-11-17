"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function PhiSettingsForm({
  projectId,
  canChangePhiFlags,
  initial,
  labels,
}: {
  projectId: string;
  canChangePhiFlags: boolean;
  initial: {
    name: string;
    description: string;
    reportingGuideline: string;
    phiType: string;
    consentDocumented: boolean;
    consentDocUrl: string;
    legalBasis: string;
    analysisDeidDefault: boolean;
  };
  labels: {
    projectName: string;
    description: string;
    reportingGuideline: string;
    care: string;
    prisma: string;
    otherGeneric: string;
    phiType: string;
    phiNone: string;
    phi: string;
    phiImaging: string;
    consent: string;
    consentUrl: string;
    legalBasis: string;
    analysisDeid: string;
    save: string;
    error: string;
    success: string;
  };
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    const fd = new FormData(e.currentTarget);

    const payload: Record<string, unknown> = {
      name: String(fd.get("name") || ""),
      description: String(fd.get("description") || ""),
      reportingGuideline: String(fd.get("reportingGuideline") || "OTHER"),
    };

    if (canChangePhiFlags) {
      const url = String(fd.get("consentDocUrl") || "").trim();
      payload.phiType = String(fd.get("phiType") || "NONE");
      payload.consentDocumented = fd.get("consentDocumented") === "on";
      payload.consentDocUrl = url || null;
      payload.legalBasis = String(fd.get("legalBasis") || "") || null;
      payload.analysisDeidDefault = fd.get("analysisDeidDefault") === "on";
    }

    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setPending(false);
    if (!res.ok) {
      setError(labels.error);
      return;
    }
    setMessage(labels.success);
    router.refresh();
  }

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <label>
        {labels.projectName}
        <input name="name" defaultValue={initial.name} required />
      </label>
      <label>
        {labels.description}
        <textarea name="description" defaultValue={initial.description} />
      </label>
      <label>
        {labels.reportingGuideline}
        <select
          name="reportingGuideline"
          defaultValue={initial.reportingGuideline}
        >
          <option value="CARE">{labels.care}</option>
          <option value="PRISMA">{labels.prisma}</option>
          <option value="OTHER">{labels.otherGeneric}</option>
        </select>
      </label>
      {canChangePhiFlags ? (
        <>
          <label>
            {labels.phiType}
            <select name="phiType" defaultValue={initial.phiType}>
              <option value="NONE">{labels.phiNone}</option>
              <option value="PHI">{labels.phi}</option>
              <option value="PHI_IMAGING">{labels.phiImaging}</option>
            </select>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              name="consentDocumented"
              type="checkbox"
              defaultChecked={initial.consentDocumented}
            />
            {labels.consent}
          </label>
          <label>
            {labels.consentUrl}
            <input
              name="consentDocUrl"
              type="url"
              defaultValue={initial.consentDocUrl}
              placeholder="https://"
            />
          </label>
          <label>
            {labels.legalBasis}
            <input name="legalBasis" defaultValue={initial.legalBasis} />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              name="analysisDeidDefault"
              type="checkbox"
              defaultChecked={initial.analysisDeidDefault}
            />
            {labels.analysisDeid}
          </label>
        </>
      ) : (
        <p className="hint">PHI flags: owner only</p>
      )}
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="hint">{message}</p> : null}
      <button type="submit" disabled={pending}>
        {labels.save}
      </button>
    </form>
  );
}
