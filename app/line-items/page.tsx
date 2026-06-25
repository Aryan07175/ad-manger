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

async function getLineItems() {
  const res = await fetch("http://localhost:3000/api/line-items", { cache: "no-store" });
  return res.json();
}

async function getOrders() {
  const res = await fetch("http://localhost:3000/api/orders", { cache: "no-store" });
  return res.json();
}

export default async function LineItemsPage() {
  const [{ line_items = [] }, { orders = [] }] = await Promise.all([getLineItems(), getOrders()]);
  const ordersMap = Object.fromEntries(orders.map((o: any) => [o.id, o.name]));

  const rows = line_items.map((li: any) => {
    const rev = calcRevenue(li);
    const potentialRev = calcPotentialRevenue(li);
    const cpm = (li.cost_per_unit_micro || 0) / 1_000_000;
    return [
      <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>#{li.id}</span>,
      <div>
        <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{li.name}</div>
        <div style={{ fontSize: "0.72rem", color: "#4b5563", marginTop: 2 }}>{li.type}</div>
      </div>,
      <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{ordersMap[li.order_id] || `Order #${li.order_id}`}</span>,
      <StatusBadge status={li.status} />,
      <div style={{ minWidth: 140 }}>
        <ProgressBar value={li.impressions_delivered || 0} max={li.goal_impressions || 1} />
        <div style={{ fontSize: "0.7rem", color: "#4b5563", marginTop: 2 }}>
          {(li.impressions_delivered || 0).toLocaleString()} / {(li.goal_impressions || 0).toLocaleString()}
        </div>
      </div>,
      <span style={{ color: "#60a5fa" }}>{(li.clicks_delivered || 0).toLocaleString()}</span>,
      // CPM
      <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#a78bfa" }}>
        ${cpm.toFixed(2)}
      </span>,
      // Revenue earned
      <div>
        <div style={{ fontWeight: 700, color: "#fbbf24", fontSize: "0.875rem" }}>{fmtCurrency(rev)}</div>
        <div style={{ fontSize: "0.7rem", color: "#4b5563" }}>of {fmtCurrency(potentialRev)}</div>
      </div>,
      <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>{li.end_date || "—"}</span>,
    ];
  });

  const delivering = line_items.filter((li: any) => li.status === "DELIVERING").length;
  const totalImpr = line_items.reduce((s: number, li: any) => s + (li.impressions_delivered || 0), 0);
  const totalClicks = line_items.reduce((s: number, li: any) => s + (li.clicks_delivered || 0), 0);
  const totalRevenue = line_items.reduce((s: number, li: any) => s + calcRevenue(li), 0);
  const totalPotential = line_items.reduce((s: number, li: any) => s + calcPotentialRevenue(li), 0);

  return (
    <div style={{ padding: "2rem 2.5rem" }}>
      <PageHeader title="Line Items" subtitle={`${line_items.length} total · ${delivering} delivering`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Delivering</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#34d399", marginTop: 4 }}>{delivering}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Impressions</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#60a5fa", marginTop: 4 }}>{totalImpr.toLocaleString()}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Clicks</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f472b6", marginTop: 4 }}>{totalClicks.toLocaleString()}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Revenue Earned</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fbbf24", marginTop: 4 }}>{fmtCurrency(totalRevenue)}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Potential Revenue</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fb923c", marginTop: 4 }}>{fmtCurrency(totalPotential)}</div>
          <div style={{ fontSize: "0.7rem", color: "#4b5563", marginTop: 2 }}>
            {totalPotential > 0 ? `${((totalRevenue / totalPotential) * 100).toFixed(1)}% realized` : ""}
          </div>
        </div>
      </div>

      <Table
        columns={["ID", "Name", "Order", "Status", "Delivery Progress", "Clicks", "CPM", "Revenue", "End Date"]}
        data={rows}
        emptyMessage="No line items yet. Ask your AI assistant to create a campaign!"
      />

      {/* Revenue breakdown by status */}
      <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {["DELIVERING", "DRAFT", "NEEDS_APPROVAL"].map(status => {
          const items = line_items.filter((li: any) => li.status === status);
          const rev = items.reduce((s: number, li: any) => s + calcRevenue(li), 0);
          return (
            <div key={status} className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{status}</div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 2 }}>{items.length} line items</div>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fbbf24" }}>{fmtCurrency(rev)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
