"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { GuidelineSelect } from "@/components/guideline-select";

export function CreateProjectForm({
  labels,
  locale,
}: {
  locale: string;
  labels: {
    projectName: string;
    description: string;
    reportingGuideline: string;
    phiType: string;
    phiNone: string;
    phi: string;
    phiImaging: string;
    consent: string;
    analysisDeid: string;
    create: string;
    error: string;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(fd.get("name") || ""),
        description: String(fd.get("description") || ""),
        reportingGuideline: String(fd.get("reportingGuideline") || "OTHER"),
        phiType: String(fd.get("phiType") || "NONE"),
        consentDocumented: fd.get("consentDocumented") === "on",
        analysisDeidDefault: fd.get("analysisDeidDefault") === "on",
      }),
    });
    setPending(false);
    if (!res.ok) {
      setError(labels.error);
      return;
    }
    const project = await res.json();
    router.push(`/projects/${project.id}`);
    router.refresh();
  }

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <label>
        {labels.projectName}
        <input name="name" required maxLength={200} />
      </label>
      <label>
        {labels.description}
        <textarea name="description" maxLength={2000} />
      </label>
      <GuidelineSelect
        label={labels.reportingGuideline}
        locale={locale}
        defaultValue="OTHER"
      />
      <label>
        {labels.phiType}
        <select name="phiType" defaultValue="NONE">
          <option value="NONE">{labels.phiNone}</option>
          <option value="PHI">{labels.phi}</option>
          <option value="PHI_IMAGING">{labels.phiImaging}</option>
        </select>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input name="consentDocumented" type="checkbox" />
        {labels.consent}
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          name="analysisDeidDefault"
          type="checkbox"
          defaultChecked
          value="on"
        />
        {labels.analysisDeid}
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={pending}>
        {labels.create}
      </button>
    </form>
  );
}
