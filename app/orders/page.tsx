import { PageHeader, StatusBadge, ProgressBar, Table } from "@/components/ui";

function calcRevenue(li: any): number {
  const impr = li.impressions_delivered || 0;
  const cpm = (li.cost_per_unit_micro || 0) / 1_000_000;
  return (impr / 1000) * cpm;
}

function calcPotentialRevenue(li: any): number {
  const goal = li.goal_impressions || 0;
  const cpm = (li.cost_per_unit_micro || 0) / 1_000_000;
  return (goal / 1000) * cpm;
}

function fmtCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(val);
}

async function getOrders() {
  const res = await fetch("http://localhost:3000/api/orders", { cache: "no-store" });
  return res.json();
}

export default async function OrdersPage() {
  const { orders = [] } = await getOrders();

  // Compute per-order revenue
  const orderStats = orders.map((o: any) => {
    const lis: any[] = o.line_items || [];
    const rev = lis.reduce((s: number, li: any) => s + calcRevenue(li), 0);
    const potential = lis.reduce((s: number, li: any) => s + calcPotentialRevenue(li), 0);
    return { ...o, revenue: rev, potential };
  });

  const rows = orderStats.map((o: any) => [
    <div>
      <div style={{ fontWeight: 600, color: "#6b7280", fontSize: "0.8rem" }}>#{o.id}</div>
    </div>,
    <div>
      <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{o.name}</div>
    </div>,
    <span style={{ color: "#94a3b8" }}>{o.advertiser_name || `ID ${o.advertiser_id}`}</span>,
    <StatusBadge status={o.status} />,
    <span style={{ color: "#60a5fa" }}>{o.line_items?.length || 0}</span>,
    // Revenue earned
    <div>
      <div style={{ fontWeight: 700, color: "#fbbf24", fontSize: "0.9rem" }}>{fmtCurrency(o.revenue)}</div>
      <div style={{ fontSize: "0.7rem", color: "#4b5563" }}>of {fmtCurrency(o.potential)}</div>
    </div>,
    <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
      {o.created_at ? new Date(o.created_at).toLocaleDateString() : "-"}
    </span>
  ]);

  const delivering = orders.filter((o: any) => o.status === "DELIVERING").length;
  const totalRevenue = orderStats.reduce((s: number, o: any) => s + o.revenue, 0);
  const totalPotential = orderStats.reduce((s: number, o: any) => s + o.potential, 0);

  return (
    <div style={{ padding: "2rem 2.5rem" }}>
      <PageHeader title="Orders" subtitle={`${orders.length} total · ${delivering} delivering`} />

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {["DELIVERING", "PENDING", "PAUSED", "ARCHIVED"].map(s => (
          <div key={s} className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#e2e8f0", marginTop: 4 }}>
              {orders.filter((o: any) => o.status === s).length}
            </div>
          </div>
        ))}
        {/* Revenue card */}
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem", border: "1px solid rgba(251,191,36,0.25)" }}>
          <div style={{ fontSize: "0.7rem", color: "#92400e", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Revenue</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "#fbbf24", marginTop: 4 }}>{fmtCurrency(totalRevenue)}</div>
          <div style={{ fontSize: "0.7rem", color: "#4b5563", marginTop: 2 }}>
            {totalPotential > 0 ? `${((totalRevenue / totalPotential) * 100).toFixed(1)}% of ${fmtCurrency(totalPotential)}` : ""}
          </div>
        </div>
      </div>

      <Table
        columns={["ID", "Name", "Advertiser", "Status", "Line Items", "Revenue", "Created"]}
        data={rows}
        emptyMessage="No orders yet. Ask your AI assistant to create one!"
      />

      {/* Line Items Preview per Order with Revenue */}
      {orderStats.map((order: any) => order.line_items?.length > 0 && (
        <div key={order.id} className="glass" style={{ borderRadius: 12, padding: "1.5rem", marginTop: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <StatusBadge status={order.status} />
            <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#e2e8f0" }}>{order.name}</h3>
            <span style={{ color: "#4b5563", fontSize: "0.8rem" }}>({order.advertiser_name})</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Earned</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fbbf24" }}>{fmtCurrency(order.revenue)}</span>
              <span style={{ fontSize: "0.8rem", color: "#4b5563" }}>/ {fmtCurrency(order.potential)} potential</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {order.line_items.map((li: any) => {
              const rev = calcRevenue(li);
              const cpm = (li.cost_per_unit_micro || 0) / 1_000_000;
              return (
                <div key={li.id} style={{ display: "grid", gridTemplateColumns: "1fr 200px 100px 120px", gap: "1rem", alignItems: "center", padding: "0.75rem 1rem", background: "#0d1117", borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#e2e8f0" }}>{li.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#4b5563" }}>{li.type} · ${cpm.toFixed(2)} CPM · Goal: {li.goal_impressions?.toLocaleString()}</div>
                  </div>
                  <ProgressBar value={li.impressions_delivered || 0} max={li.goal_impressions || 1} />
                  <span style={{ fontWeight: 700, color: "#fbbf24", fontSize: "0.875rem", textAlign: "right" }}>{fmtCurrency(rev)}</span>
                  <StatusBadge status={li.status} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
