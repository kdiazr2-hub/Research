"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES, type Role } from "@/lib/types";

type Member = {
  id: string;
  role: string;
  canViewPhi: boolean;
  canViewImaging: boolean;
  user: { id: string; email: string; name: string | null };
};

export function MembersPanel({
  projectId,
  canManage,
  members,
  labels,
}: {
  projectId: string;
  canManage: boolean;
  members: Member[];
  labels: {
    members: string;
    invite: string;
    inviteEmail: string;
    role: string;
    changeRole: string;
    error: string;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function invite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${projectId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(fd.get("email") || ""),
        role: String(fd.get("role") || "VIEWER"),
        canViewPhi: fd.get("canViewPhi") === "on",
        canViewImaging: fd.get("canViewImaging") === "on",
      }),
    });
    if (!res.ok) {
      setError(labels.error);
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  async function changeRole(membershipId: string, role: Role) {
    setError(null);
    const res = await fetch(`/api/projects/${projectId}/members`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ membershipId, role }),
    });
    if (!res.ok) {
      setError(labels.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>{labels.role}</th>
            <th>PHI</th>
            <th>Imaging</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>
                <div>{m.user.name}</div>
                <div className="meta">{m.user.email}</div>
              </td>
              <td>
                {canManage ? (
                  <select
                    value={m.role}
                    aria-label={labels.changeRole}
                    onChange={(e) =>
                      changeRole(m.id, e.target.value as Role)
                    }
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ) : (
                  m.role
                )}
              </td>
              <td>{m.canViewPhi ? "✓" : "—"}</td>
              <td>{m.canViewImaging ? "✓" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {canManage ? (
        <form className="inline-form" onSubmit={invite}>
          <label>
            {labels.inviteEmail}
            <input name="email" type="email" required />
          </label>
          <label>
            {labels.role}
            <select name="role" defaultValue="COLLABORATOR">
              {ROLES.filter((r) => r !== "OWNER").map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <input name="canViewPhi" type="checkbox" /> PHI
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <input name="canViewImaging" type="checkbox" /> Imaging
          </label>
          <button type="submit">{labels.invite}</button>
        </form>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
