export function AuditPanel({
  entries,
}: {
  entries: {
    id: string;
    action: string;
    createdAt: string;
    userEmail: string;
    metadata: string;
  }[];
}) {
  if (entries.length === 0) {
    return <p className="empty">—</p>;
  }

  return (
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
  );
}
