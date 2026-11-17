"use client";

import { GUIDELINES, REPORTING_GUIDELINES } from "@/lib/equator";

export function GuidelineSelect({
  name = "reportingGuideline",
  defaultValue = "OTHER",
  locale = "es",
  label,
}: {
  name?: string;
  defaultValue?: string;
  locale?: string;
  label: string;
}) {
  const isEs = locale.startsWith("es");
  return (
    <label>
      {label}
      <select name={name} defaultValue={defaultValue}>
        {REPORTING_GUIDELINES.map((id) => (
          <option key={id} value={id}>
            {isEs ? GUIDELINES[id].name.es : GUIDELINES[id].name.en}
          </option>
        ))}
      </select>
    </label>
  );
}
