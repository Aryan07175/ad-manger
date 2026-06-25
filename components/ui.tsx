export function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase().replace(/ /g, "_");
  return <span className={`badge badge-${s}`}>{status}</span>;
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontSize: "0.72rem", color: "#94a3b8", width: 38, textAlign: "right" }}>{pct.toFixed(0)}%</span>
    </div>
  );
}

export function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="glass" style={{ borderRadius: 12, padding: "1.25rem 1.5rem" }}>
      <div style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: "1.75rem", fontWeight: 700, color: color || "#e2e8f0", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: "#4b5563", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ margin: "0.4rem 0 0", color: "#6b7280", fontSize: "0.875rem" }}>{subtitle}</p>}
    </div>
  );
}

export function Table({ columns, data, emptyMessage }: { columns: string[]; data: React.ReactNode[][]; emptyMessage?: string }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #1f2937" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#0d1117" }}>
            {columns.map(col => (
              <th key={col} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #1f2937" }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: "3rem", textAlign: "center", color: "#4b5563", fontSize: "0.875rem" }}>{emptyMessage || "No data found"}</td></tr>
          ) : data.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #1a2030", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#cbd5e1", verticalAlign: "middle" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
