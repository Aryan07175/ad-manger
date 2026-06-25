import { PageHeader, StatusBadge, Table } from "@/components/ui";

function calcRevenue(li: any): number {
  const impr = li.impressions_delivered || 0;
  const cpm = (li.cost_per_unit_micro || 0) / 1_000_000;
  return (impr / 1000) * cpm;
}

function fmtCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(val);
}

async function getAdvertisers() {
  const res = await fetch("http://localhost:3000/api/advertisers", { cache: "no-store" });
  return res.json();
}

async function getOrders() {
  const res = await fetch("http://localhost:3000/api/orders", { cache: "no-store" });
  return res.json();
}

async function getCreatives() {
  const res = await fetch("http://localhost:3000/api/creatives", { cache: "no-store" });
  return res.json();
}

async function getLineItems() {
  const res = await fetch("http://localhost:3000/api/line-items", { cache: "no-store" });
  return res.json();
}

export default async function AdvertisersPage() {
  const [{ advertisers = [] }, { orders = [] }, { creatives = [] }, { line_items = [] }] = await Promise.all([
    getAdvertisers(), getOrders(), getCreatives(), getLineItems()
  ]);

  // Revenue per advertiser: sum revenue of all line items for their orders
  const ordersByAdv: Record<number, any[]> = {};
  orders.forEach((o: any) => {
    if (!ordersByAdv[o.advertiser_id]) ordersByAdv[o.advertiser_id] = [];
    ordersByAdv[o.advertiser_id].push(o);
  });

  const lineItemsByOrder: Record<number, any[]> = {};
  line_items.forEach((li: any) => {
    if (!lineItemsByOrder[li.order_id]) lineItemsByOrder[li.order_id] = [];
    lineItemsByOrder[li.order_id].push(li);
  });

  const advStats = advertisers.map((a: any) => {
    const adOrders = ordersByAdv[a.id] || [];
    const adCreatives = creatives.filter((c: any) => c.advertiser_id === a.id);
    const adLineItems = adOrders.flatMap((o: any) => lineItemsByOrder[o.id] || []);
    const revenue = adLineItems.reduce((s: number, li: any) => s + calcRevenue(li), 0);
    const impressions = adLineItems.reduce((s: number, li: any) => s + (li.impressions_delivered || 0), 0);
    return { ...a, adOrders, adCreatives, adLineItems, revenue, impressions };
  });

  const totalRevenue = advStats.reduce((s: number, a: any) => s + a.revenue, 0);

  const rows = advStats.map((a: any) => [
    <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>#{a.id}</span>,
    <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{a.name}</div>,
    <StatusBadge status={a.status || "ACTIVE"} />,
    <span style={{ color: "#818cf8" }}>{a.adOrders.length}</span>,
    <span style={{ color: "#60a5fa" }}>{a.impressions.toLocaleString()}</span>,
    <span style={{ color: "#34d399" }}>{a.adCreatives.length}</span>,
    <div style={{ fontWeight: 700, color: "#fbbf24", fontSize: "0.9rem" }}>{fmtCurrency(a.revenue)}</div>,
    <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
      {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
    </span>
  ]);

  return (
    <div style={{ padding: "2rem 2.5rem" }}>
      <PageHeader title="Advertisers" subtitle={`${advertisers.length} total advertisers`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Advertisers</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#818cf8", marginTop: 4 }}>{advertisers.length}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Orders</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#34d399", marginTop: 4 }}>{orders.length}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Creatives</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>{creatives.length}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem", border: "1px solid rgba(251,191,36,0.25)" }}>
          <div style={{ fontSize: "0.7rem", color: "#92400e", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Revenue</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "#fbbf24", marginTop: 4 }}>{fmtCurrency(totalRevenue)}</div>
        </div>
      </div>

      <Table
        columns={["ID", "Name", "Status", "Orders", "Impressions", "Creatives", "Revenue", "Created"]}
        data={rows}
        emptyMessage="No advertisers yet."
      />

      {/* Revenue breakdown bar chart */}
      {advStats.filter((a: any) => a.revenue > 0).length > 0 && (
        <div className="glass" style={{ borderRadius: 12, padding: "1.5rem", marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#94a3b8", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Revenue by Advertiser</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {advStats.sort((a: any, b: any) => b.revenue - a.revenue).map((a: any) => {
              const pct = totalRevenue > 0 ? (a.revenue / totalRevenue) * 100 : 0;
              return (
                <div key={a.id} style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                  <div style={{ height: 8, background: "#1f2937", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #fbbf24, #f59e0b)", borderRadius: 4, transition: "width 0.5s ease" }} />
                  </div>
                  <span style={{ fontWeight: 700, color: "#fbbf24", fontSize: "0.875rem", textAlign: "right" }}>{fmtCurrency(a.revenue)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
