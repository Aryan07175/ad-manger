import { PageHeader, StatusBadge, Table } from "@/components/ui";

async function getCreatives() {
  const res = await fetch("http://localhost:3000/api/creatives", { cache: "no-store" });
  return res.json();
}

async function getAdvertisers() {
  const res = await fetch("http://localhost:3000/api/advertisers", { cache: "no-store" });
  return res.json();
}

export default async function CreativesPage() {
  const [{ creatives = [] }, { advertisers = [] }] = await Promise.all([getCreatives(), getAdvertisers()]);
  const advMap = Object.fromEntries(advertisers.map((a: any) => [a.id, a.name]));

  const rows = creatives.map((c: any) => [
    <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>#{c.id}</span>,
    <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{c.name}</div>,
    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{advMap[c.advertiser_id] || `ID ${c.advertiser_id}`}</span>,
    <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#818cf8", background: "rgba(99,102,241,0.1)", padding: "2px 8px", borderRadius: 4 }}>{c.width}×{c.height}</span>,
    <span className={`badge badge-${(c.type || "").toLowerCase()}`} style={{ fontSize: "0.7rem" }}>{c.type}</span>,
    <StatusBadge status={c.status} />,
    <span style={{ color: "#60a5fa", fontSize: "0.8rem" }}>
      {c.line_item_ids?.length || 0} line items
    </span>,
    c.click_through_url ? (
      <a href={c.click_through_url} target="_blank" rel="noopener" style={{ color: "#818cf8", fontSize: "0.75rem", textDecoration: "none", maxWidth: 180, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {c.click_through_url}
      </a>
    ) : <span style={{ color: "#4b5563" }}>—</span>
  ]);

  const imageCount = creatives.filter((c: any) => c.type === "IMAGE").length;
  const thirdPartyCount = creatives.filter((c: any) => c.type === "THIRD_PARTY").length;

  return (
    <div style={{ padding: "2rem 2.5rem" }}>
      <PageHeader title="Creatives" subtitle={`${creatives.length} total creatives`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#818cf8", marginTop: 4 }}>{creatives.length}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Image</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#34d399", marginTop: 4 }}>{imageCount}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Third-Party</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>{thirdPartyCount}</div>
        </div>
      </div>

      <Table
        columns={["ID", "Name", "Advertiser", "Size", "Type", "Status", "Associations", "URL"]}
        data={rows}
        emptyMessage="No creatives yet. Upload images via the MCP server!"
      />
    </div>
  );
}
