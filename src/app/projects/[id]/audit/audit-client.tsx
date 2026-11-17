"use client";

import { FormEvent, useMemo, useState } from "react";

type Entry = {
  id: string;
  action: string;
  createdAt: string;
  userEmail: string;
  metadata: string;
};

export function AuditClient({
  projectId,
  fullAccess,
  actions,
  initialEntries,
  labels,
}: {
  projectId: string;
  fullAccess: boolean;
  actions: string[];
  initialEntries: Entry[];
  labels: Record<string, string>;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [actionList, setActionList] = useState(actions);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actionOptions = useMemo(
    () => ["", ...actionList].filter((v, i, a) => a.indexOf(v) === i),
    [actionList]
  );

  async function onFilter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const action = String(fd.get("action") || "");
    const user = String(fd.get("user") || "");
    const q = String(fd.get("q") || "");
    const from = String(fd.get("from") || "");
    const to = String(fd.get("to") || "");
    if (action) params.set("action", action);
    if (user) params.set("user", user);
    if (q) params.set("q", q);
    if (from) params.set("from", new Date(from).toISOString());
    if (to) params.set("to", new Date(`${to}T23:59:59`).toISOString());
    params.set("limit", "200");

    const res = await fetch(
      `/api/projects/${projectId}/audit?${params.toString()}`
    );
    setPending(false);
    if (!res.ok) {
      setError(labels.error);
      return;
    }
    const data = await res.json();
    setActionList(data.actions || []);
    setEntries(
      (data.entries || []).map(
        (l: {
          id: string;
          action: string;
          createdAt: string;
          user: { email?: string } | null;
          metadataRaw?: string;
          metadata?: unknown;
        }) => ({
          id: l.id,
          action: l.action,
          createdAt:
            typeof l.createdAt === "string"
              ? l.createdAt
              : new Date(l.createdAt).toISOString(),
          userEmail: l.user?.email ?? "—",
          metadata:
            l.metadataRaw ||
            (typeof l.metadata === "string"
              ? l.metadata
              : JSON.stringify(l.metadata ?? {})),
        })
      )
    );
  }

  return (
    <div className="stack-lg">
      {!fullAccess ? <p className="hint">{labels.auditLimited}</p> : null}
      <form className="inline-form" onSubmit={onFilter}>
        <label>
          {labels.filterAction}
          <select name="action" defaultValue="">
            <option value="">{labels.filterAll}</option>
            {actionOptions
              .filter(Boolean)
              .map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
          </select>
        </label>
        <label>
          {labels.filterUser}
          <input name="user" type="search" placeholder="email" />
        </label>
        <label>
          {labels.filterQuery}
          <input name="q" type="search" placeholder="metadata…" />
        </label>
        <label>
          {labels.filterFrom}
          <input name="from" type="date" />
        </label>
        <label>
          {labels.filterTo}
          <input name="to" type="date" />
        </label>
        <button type="submit" disabled={pending}>
          {labels.applyFilters}
        </button>
      </form>

      {entries.length === 0 ? (
        <p className="empty">—</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>When</th>
              <th>Action</th>
              <th>User</th>
              <th>Meta</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.createdAt).toLocaleString()}</td>
                <td>
                  <span className="badge accent">{e.action}</span>
                </td>
                <td>{e.userEmail}</td>
                <td>
                  <code style={{ fontSize: "0.75rem", wordBreak: "break-word" }}>
                    {e.metadata}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
