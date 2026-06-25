"""
Ad Manager MCP Server — FastMCP implementation
=====================================================================
Reads data directly from db.json (same file used by the Next.js dashboard)
and exposes 14 MCP tools for Claude Desktop, Cursor, VS Code, and Windsurf.

Transports:
  stdio  — default, used by Claude Desktop / Cursor (zero config)
  http   — set MCP_TRANSPORT=http to enable remote access at /mcp

Authentication (HTTP transport only):
  Set MCP_AUTH_TOKEN env var to require Bearer token on all tool calls.
  If not set in HTTP mode, a random token is generated and printed to stdout.

References:
  https://gofastmcp.com/
  https://modelcontextprotocol.io/specification/draft/basic/security_best_practices
"""

from __future__ import annotations

import os
import json
import hmac
import logging
import secrets
from pathlib import Path
from typing import Optional, Any

# -- FastMCP ------------------------------------------------------------------
from fastmcp import FastMCP, Context
from fastmcp.server.middleware import Middleware
from fastmcp.exceptions import ToolError

# -- Logging ------------------------------------------------------------------
LOG_LEVEL = os.environ.get("MCP_LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ad_manager_mcp")

# -- Database path (resolve relative to this file so the server can be run
#    from any working directory) ----------------------------------------------
_SERVER_DIR = Path(__file__).parent.resolve()
DB_PATH = Path(os.environ.get("DB_PATH", str(_SERVER_DIR / "db.json")))

# -- Authentication token -----------------------------------------------------
AUTH_TOKEN: Optional[str] = os.environ.get("MCP_AUTH_TOKEN")

# -- FastMCP instance ---------------------------------------------------------
mcp = FastMCP(
    name="Ad Manager MCP",
    instructions=(
        "You are connected to the Ad Manager MCP Server. "
        "Use the available tools to query orders, line items, advertisers, "
        "creatives, and dashboard metrics from the local Ad Manager database."
    ),
)


# =============================================================================
# HELPER - read db.json
# =============================================================================

def _read_db() -> dict[str, Any]:
    """Read and return the full database dict from db.json."""
    try:
        return json.loads(DB_PATH.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ToolError(f"Database file not found: {DB_PATH}")
    except json.JSONDecodeError as exc:
        raise ToolError(f"Database file is corrupted: {exc}")


def _calc_revenue(line_item: dict) -> float:
    """CPM-based revenue: (impressions / 1000) x (cost_per_unit_micro / 1_000_000)."""
    impr = line_item.get("impressions_delivered", 0) or 0
    cpm = (line_item.get("cost_per_unit_micro", 0) or 0) / 1_000_000
    return (impr / 1000) * cpm


# =============================================================================
# BEARER TOKEN AUTHENTICATION MIDDLEWARE (HTTP transport only)
# =============================================================================

class BearerAuthMiddleware(Middleware):
    """Validates Authorization: Bearer <token> on every tool call.

    Falls back silently when headers are unavailable (stdio transport).
    Uses constant-time comparison to prevent timing attacks.
    """

    async def on_call_tool(self, context, call_next):
        global AUTH_TOKEN
        if not AUTH_TOKEN:
            return await call_next(context)

        try:
            from fastmcp.server.dependencies import get_http_headers
            headers = get_http_headers()
            auth_header = headers.get("authorization", "")
        except Exception:
            # stdio transport - skip auth
            return await call_next(context)

        if not auth_header:
            logger.warning("Auth failed: Missing Authorization header")
            raise ToolError("Access denied: provide 'Authorization: Bearer <token>'")

        if not auth_header.startswith("Bearer "):
            logger.warning("Auth failed: Invalid Authorization format")
            raise ToolError("Access denied: use 'Authorization: Bearer <token>'")

        token = auth_header[7:]
        if not hmac.compare_digest(
            token.encode("utf-8"), AUTH_TOKEN.encode("utf-8")
        ):
            logger.warning("Auth failed: Invalid token")
            raise ToolError("Access denied: invalid token")

        logger.debug("Auth passed")
        return await call_next(context)


mcp.add_middleware(BearerAuthMiddleware())


# =============================================================================
# HEALTH / CAPABILITY RESOURCE
# =============================================================================

@mcp.resource("health://status")
def health_status() -> str:
    """Health check and server capability discovery."""
    db = _read_db()
    return json.dumps({
        "status": "ok",
        "server": "Ad Manager MCP",
        "version": "1.0.0",
        "database": str(DB_PATH),
        "counts": {
            "advertisers": len(db.get("advertisers", [])),
            "orders": len(db.get("orders", [])),
            "line_items": len(db.get("line_items", [])),
            "creatives": len(db.get("creatives", [])),
        },
        "tools": [
            "list_orders", "get_order", "search_orders",
            "list_line_items", "get_line_item",
            "list_advertisers", "get_advertiser", "search_advertisers",
            "list_creatives", "get_creative",
            "get_dashboard_metrics",
            "get_total_revenue", "get_total_clicks", "get_total_impressions",
        ],
    }, indent=2)


# =============================================================================
# ORDERS TOOLS
# =============================================================================

@mcp.tool()
def list_orders(
    status: Optional[str] = None,
    advertiser_id: Optional[int] = None,
) -> str:
    """List all advertising orders, optionally filtered by status or advertiser.

    Args:
        status: Filter by order status. Common values: DELIVERING, PENDING,
                PAUSED, COMPLETED, CANCELED, DRAFT.
        advertiser_id: Filter orders belonging to a specific advertiser (by ID).

    Returns:
        JSON with orders array, each enriched with advertiser_name and
        nested line_items summary.

    Examples:
        list_orders()                          -> all orders
        list_orders(status="DELIVERING")       -> active/delivering orders (active campaigns)
        list_orders(advertiser_id=1001)        -> Nike Inc. orders
    """
    db = _read_db()
    orders: list[dict] = db.get("orders", [])
    advertisers: list[dict] = db.get("advertisers", [])
    line_items: list[dict] = db.get("line_items", [])

    if status:
        orders = [o for o in orders if o.get("status") == status.upper()]
    if advertiser_id is not None:
        orders = [o for o in orders if o.get("advertiser_id") == advertiser_id]

    adv_map = {a["id"]: a for a in advertisers}
    enriched = []
    for order in orders:
        adv = adv_map.get(order.get("advertiser_id", 0), {})
        lis = [li for li in line_items if li.get("order_id") == order["id"]]
        revenue = sum(_calc_revenue(li) for li in lis)
        total_impr = sum(li.get("impressions_delivered", 0) or 0 for li in lis)
        total_clicks = sum(li.get("clicks_delivered", 0) or 0 for li in lis)
        enriched.append({
            **order,
            "advertiser_name": adv.get("name"),
            "total_line_items": len(lis),
            "total_impressions": total_impr,
            "total_clicks": total_clicks,
            "total_revenue_usd": round(revenue, 2),
            "line_items": lis,
        })

    logger.info("list_orders -> %d result(s) [status=%s]", len(enriched), status)
    return json.dumps({"orders": enriched, "total": len(enriched)}, indent=2)


@mcp.tool()
def get_order(order_id: int) -> str:
    """Get full details of a single order by its ID.

    Args:
        order_id: The unique integer ID of the order (e.g. 2001).

    Returns:
        JSON object with order fields, advertiser info, and all line items.
        Returns an error object if the order is not found.
    """
    db = _read_db()
    order = next((o for o in db.get("orders", []) if o["id"] == order_id), None)
    if not order:
        logger.warning("get_order: order %d not found", order_id)
        return json.dumps({"error": f"Order {order_id} not found"}, indent=2)

    adv = next(
        (a for a in db.get("advertisers", []) if a["id"] == order.get("advertiser_id")),
        {}
    )
    lis = [li for li in db.get("line_items", []) if li.get("order_id") == order_id]
    revenue = sum(_calc_revenue(li) for li in lis)

    result = {
        **order,
        "advertiser": adv,
        "advertiser_name": adv.get("name"),
        "total_line_items": len(lis),
        "total_revenue_usd": round(revenue, 2),
        "line_items": lis,
    }
    logger.info("get_order -> order_id=%d '%s'", order_id, order.get("name"))
    return json.dumps(result, indent=2)


@mcp.tool()
def search_orders(query: str) -> str:
    """Search orders by name (case-insensitive partial match).

    Args:
        query: Search string to match against order names.
               Example: "Nike", "holiday", "2025"

    Returns:
        JSON with matching orders array and total count.
    """
    if not query or not query.strip():
        raise ToolError("query must be a non-empty string")

    db = _read_db()
    q = query.strip().lower()
    orders = db.get("orders", [])
    adv_map = {a["id"]: a for a in db.get("advertisers", [])}
    line_items = db.get("line_items", [])

    matches = []
    for order in orders:
        if q in order.get("name", "").lower():
            adv = adv_map.get(order.get("advertiser_id", 0), {})
            lis = [li for li in line_items if li.get("order_id") == order["id"]]
            matches.append({
                **order,
                "advertiser_name": adv.get("name"),
                "total_line_items": len(lis),
            })

    logger.info("search_orders '%s' -> %d result(s)", query, len(matches))
    return json.dumps({"orders": matches, "total": len(matches), "query": query}, indent=2)


# =============================================================================
# LINE ITEMS TOOLS
# =============================================================================

@mcp.tool()
def list_line_items(
    order_id: Optional[int] = None,
    status: Optional[str] = None,
) -> str:
    """List all line items, optionally filtered by order or status.

    Args:
        order_id: Filter line items belonging to a specific order.
        status: Filter by delivery status. Values: DELIVERING, NEEDS_APPROVAL,
                PAUSED, COMPLETED, CANCELED, DRAFT.

    Returns:
        JSON with line_items array including delivery stats and revenue per item.
    """
    db = _read_db()
    items: list[dict] = db.get("line_items", [])

    if order_id is not None:
        items = [li for li in items if li.get("order_id") == order_id]
    if status:
        items = [li for li in items if li.get("status") == status.upper()]

    enriched = []
    for li in items:
        impr = li.get("impressions_delivered", 0) or 0
        clicks = li.get("clicks_delivered", 0) or 0
        enriched.append({
            **li,
            "revenue_usd": round(_calc_revenue(li), 2),
            "ctr_pct": round((clicks / impr * 100) if impr else 0, 3),
        })

    logger.info(
        "list_line_items -> %d result(s) [order=%s status=%s]",
        len(enriched), order_id, status
    )
    return json.dumps({"line_items": enriched, "total": len(enriched)}, indent=2)


@mcp.tool()
def get_line_item(line_item_id: int) -> str:
    """Get full details of a single line item by its ID.

    Args:
        line_item_id: The unique integer ID of the line item (e.g. 3001).

    Returns:
        JSON object with all line item fields, revenue calculation, and CTR.
        Returns an error object if the line item is not found.
    """
    db = _read_db()
    li = next((x for x in db.get("line_items", []) if x["id"] == line_item_id), None)
    if not li:
        logger.warning("get_line_item: %d not found", line_item_id)
        return json.dumps({"error": f"Line item {line_item_id} not found"}, indent=2)

    order = next(
        (o for o in db.get("orders", []) if o["id"] == li.get("order_id")), {}
    )
    impr = li.get("impressions_delivered", 0) or 0
    clicks = li.get("clicks_delivered", 0) or 0
    result = {
        **li,
        "revenue_usd": round(_calc_revenue(li), 2),
        "ctr_pct": round((clicks / impr * 100) if impr else 0, 3),
        "order_name": order.get("name"),
    }
    logger.info("get_line_item -> %d '%s'", line_item_id, li.get("name"))
    return json.dumps(result, indent=2)


# =============================================================================
# ADVERTISERS TOOLS
# =============================================================================

@mcp.tool()
def list_advertisers(status: Optional[str] = None) -> str:
    """List all advertisers in the system.

    Args:
        status: Optional filter by status (e.g. 'ACTIVE', 'INACTIVE').

    Returns:
        JSON with advertisers array. Each advertiser includes order count
        and total revenue generated.
    """
    db = _read_db()
    advertisers: list[dict] = db.get("advertisers", [])
    orders = db.get("orders", [])
    line_items = db.get("line_items", [])

    if status:
        advertisers = [a for a in advertisers if a.get("status") == status.upper()]

    enriched = []
    for adv in advertisers:
        adv_orders = [o for o in orders if o.get("advertiser_id") == adv["id"]]
        order_ids = {o["id"] for o in adv_orders}
        adv_lis = [li for li in line_items if li.get("order_id") in order_ids]
        revenue = sum(_calc_revenue(li) for li in adv_lis)
        enriched.append({
            **adv,
            "total_orders": len(adv_orders),
            "total_line_items": len(adv_lis),
            "total_revenue_usd": round(revenue, 2),
        })

    logger.info("list_advertisers -> %d result(s)", len(enriched))
    return json.dumps({"advertisers": enriched, "total": len(enriched)}, indent=2)


@mcp.tool()
def get_advertiser(advertiser_id: int) -> str:
    """Get full details of a single advertiser by ID.

    Args:
        advertiser_id: The unique integer ID of the advertiser (e.g. 1001).

    Returns:
        JSON with advertiser fields, all orders, all line items, and total revenue.
        Returns an error object if the advertiser is not found.
    """
    db = _read_db()
    adv = next((a for a in db.get("advertisers", []) if a["id"] == advertiser_id), None)
    if not adv:
        logger.warning("get_advertiser: %d not found", advertiser_id)
        return json.dumps({"error": f"Advertiser {advertiser_id} not found"}, indent=2)

    orders = [o for o in db.get("orders", []) if o.get("advertiser_id") == advertiser_id]
    order_ids = {o["id"] for o in orders}
    line_items = [li for li in db.get("line_items", []) if li.get("order_id") in order_ids]
    revenue = sum(_calc_revenue(li) for li in line_items)

    result = {
        **adv,
        "orders": orders,
        "total_orders": len(orders),
        "line_items": line_items,
        "total_line_items": len(line_items),
        "total_revenue_usd": round(revenue, 2),
    }
    logger.info("get_advertiser -> %d '%s'", advertiser_id, adv.get("name"))
    return json.dumps(result, indent=2)


@mcp.tool()
def search_advertisers(query: str) -> str:
    """Search advertisers by name (case-insensitive partial match).

    Args:
        query: Search string to match against advertiser names.
               Example: "Nike", "Apple", "Corp"

    Returns:
        JSON with matching advertisers array and total count.
    """
    if not query or not query.strip():
        raise ToolError("query must be a non-empty string")

    db = _read_db()
    q = query.strip().lower()
    matches = [
        a for a in db.get("advertisers", [])
        if q in a.get("name", "").lower()
    ]
    logger.info("search_advertisers '%s' -> %d result(s)", query, len(matches))
    return json.dumps({"advertisers": matches, "total": len(matches), "query": query}, indent=2)


# =============================================================================
# CREATIVES TOOLS
# =============================================================================

@mcp.tool()
def list_creatives(
    advertiser_id: Optional[int] = None,
    line_item_id: Optional[int] = None,
    creative_type: Optional[str] = None,
) -> str:
    """List all ad creatives, optionally filtered by advertiser, line item, or type.

    Args:
        advertiser_id: Filter creatives belonging to a specific advertiser.
        line_item_id: Filter creatives associated with a specific line item.
        creative_type: Filter by creative type (e.g. 'IMAGE', 'VIDEO', 'HTML5').

    Returns:
        JSON with creatives array including dimensions and click-through URLs.
    """
    db = _read_db()
    creatives: list[dict] = db.get("creatives", [])

    if advertiser_id is not None:
        creatives = [c for c in creatives if c.get("advertiser_id") == advertiser_id]
    if line_item_id is not None:
        creatives = [
            c for c in creatives
            if line_item_id in (c.get("line_item_ids") or [])
        ]
    if creative_type:
        creatives = [c for c in creatives if c.get("type") == creative_type.upper()]

    logger.info("list_creatives -> %d result(s)", len(creatives))
    return json.dumps({"creatives": creatives, "total": len(creatives)}, indent=2)


@mcp.tool()
def get_creative(creative_id: int) -> str:
    """Get full details of a single creative by its ID.

    Args:
        creative_id: The unique integer ID of the creative (e.g. 4001).

    Returns:
        JSON with creative details including dimensions, URLs, and associated
        advertiser and line items.
        Returns an error object if the creative is not found.
    """
    db = _read_db()
    creative = next((c for c in db.get("creatives", []) if c["id"] == creative_id), None)
    if not creative:
        logger.warning("get_creative: %d not found", creative_id)
        return json.dumps({"error": f"Creative {creative_id} not found"}, indent=2)

    adv = next(
        (a for a in db.get("advertisers", []) if a["id"] == creative.get("advertiser_id")),
        {}
    )
    lis = [
        li for li in db.get("line_items", [])
        if li["id"] in (creative.get("line_item_ids") or [])
    ]
    result = {
        **creative,
        "advertiser_name": adv.get("name"),
        "line_items": lis,
    }
    logger.info("get_creative -> %d '%s'", creative_id, creative.get("name"))
    return json.dumps(result, indent=2)


# =============================================================================
# DASHBOARD METRICS TOOLS
# =============================================================================

@mcp.tool()
def get_dashboard_metrics() -> str:
    """Get a complete dashboard overview with all key performance metrics.

    Returns a comprehensive JSON snapshot including:
    - Total counts (orders, line items, advertisers, creatives)
    - Aggregate impressions, clicks, CTR, and revenue
    - Breakdown by order (revenue, impressions, clicks per order)
    - Breakdown by advertiser (revenue per advertiser)
    - Top performing line items by revenue
    - Status distribution across orders and line items

    This is the primary tool for:
      "Show me the dashboard"
      "What are my overall stats?"
      "Give me a campaign summary"
      "Show all active campaigns"
    """
    db = _read_db()
    orders = db.get("orders", [])
    line_items = db.get("line_items", [])
    advertisers = db.get("advertisers", [])
    creatives = db.get("creatives", [])

    total_impr = sum(li.get("impressions_delivered", 0) or 0 for li in line_items)
    total_clicks = sum(li.get("clicks_delivered", 0) or 0 for li in line_items)
    total_revenue = sum(_calc_revenue(li) for li in line_items)
    ctr = round((total_clicks / total_impr * 100) if total_impr else 0, 3)
    ecpm = round((total_revenue / total_impr * 1000) if total_impr else 0, 4)

    # Per-order breakdown
    order_map = {o["id"]: o for o in orders}
    adv_map = {a["id"]: a for a in advertisers}
    order_stats: dict[int, dict] = {}
    for li in line_items:
        oid = li.get("order_id")
        if oid not in order_stats:
            order_stats[oid] = {
                "impressions": 0, "clicks": 0, "revenue": 0.0, "line_items": 0
            }
        order_stats[oid]["impressions"] += li.get("impressions_delivered", 0) or 0
        order_stats[oid]["clicks"] += li.get("clicks_delivered", 0) or 0
        order_stats[oid]["revenue"] += _calc_revenue(li)
        order_stats[oid]["line_items"] += 1

    orders_breakdown = []
    for oid, stats in order_stats.items():
        o = order_map.get(oid, {})
        adv = adv_map.get(o.get("advertiser_id"), {})
        orders_breakdown.append({
            "order_id": oid,
            "order_name": o.get("name"),
            "advertiser_name": adv.get("name"),
            "status": o.get("status"),
            **{k: round(v, 2) if isinstance(v, float) else v for k, v in stats.items()},
        })
    orders_breakdown.sort(key=lambda x: x["revenue"], reverse=True)

    # Status distributions
    order_statuses: dict[str, int] = {}
    for o in orders:
        s = o.get("status", "UNKNOWN")
        order_statuses[s] = order_statuses.get(s, 0) + 1

    li_statuses: dict[str, int] = {}
    for li in line_items:
        s = li.get("status", "UNKNOWN")
        li_statuses[s] = li_statuses.get(s, 0) + 1

    # Top 5 line items by revenue
    li_sorted = sorted(line_items, key=_calc_revenue, reverse=True)[:5]
    top_line_items = [
        {
            "id": li["id"],
            "name": li.get("name"),
            "status": li.get("status"),
            "revenue_usd": round(_calc_revenue(li), 2),
            "impressions": li.get("impressions_delivered", 0),
            "clicks": li.get("clicks_delivered", 0),
        }
        for li in li_sorted
    ]

    result = {
        "summary": {
            "total_orders": len(orders),
            "total_line_items": len(line_items),
            "total_advertisers": len(advertisers),
            "total_creatives": len(creatives),
            "total_impressions": total_impr,
            "total_clicks": total_clicks,
            "total_revenue_usd": round(total_revenue, 2),
            "overall_ctr_pct": ctr,
            "effective_cpm_usd": ecpm,
        },
        "order_status_distribution": order_statuses,
        "line_item_status_distribution": li_statuses,
        "orders_breakdown": orders_breakdown,
        "top_line_items_by_revenue": top_line_items,
    }

    logger.info(
        "get_dashboard_metrics -> rev=$%.2f impr=%d clicks=%d ctr=%.3f%%",
        total_revenue, total_impr, total_clicks, ctr,
    )
    return json.dumps(result, indent=2)


@mcp.tool()
def get_total_revenue(
    order_id: Optional[int] = None,
    advertiser_id: Optional[int] = None,
) -> str:
    """Get total CPM-based revenue across all line items (or filtered subset).

    Revenue formula: (impressions_delivered / 1000) x (cost_per_unit_micro / 1_000_000)

    Args:
        order_id: Restrict calculation to line items of a specific order.
        advertiser_id: Restrict to a specific advertiser's orders.

    Returns:
        JSON with total_revenue_usd, currency, scope, and per-line-item breakdown.

    Examples:
        get_total_revenue()                    -> total across all campaigns
        get_total_revenue(order_id=2001)       -> revenue for Nike Summer 2025
        get_total_revenue(advertiser_id=1001)  -> revenue for Nike Inc.
    """
    db = _read_db()
    line_items = db.get("line_items", [])
    scope = "all"

    if advertiser_id is not None:
        adv_order_ids = {
            o["id"] for o in db.get("orders", [])
            if o.get("advertiser_id") == advertiser_id
        }
        line_items = [li for li in line_items if li.get("order_id") in adv_order_ids]
        adv = next((a for a in db.get("advertisers", []) if a["id"] == advertiser_id), {})
        scope = f"advertiser:{advertiser_id} ({adv.get('name', 'unknown')})"
    elif order_id is not None:
        line_items = [li for li in line_items if li.get("order_id") == order_id]
        order = next((o for o in db.get("orders", []) if o["id"] == order_id), {})
        scope = f"order:{order_id} ({order.get('name', 'unknown')})"

    breakdown = [
        {
            "line_item_id": li["id"],
            "line_item_name": li.get("name"),
            "impressions": li.get("impressions_delivered", 0),
            "cost_per_unit_micro": li.get("cost_per_unit_micro", 0),
            "revenue_usd": round(_calc_revenue(li), 2),
        }
        for li in line_items
    ]
    total = round(sum(b["revenue_usd"] for b in breakdown), 2)

    logger.info("get_total_revenue -> $%.2f [scope=%s]", total, scope)
    return json.dumps({
        "total_revenue_usd": total,
        "currency": "USD",
        "scope": scope,
        "line_item_count": len(breakdown),
        "breakdown": breakdown,
    }, indent=2)


@mcp.tool()
def get_total_clicks(order_id: Optional[int] = None) -> str:
    """Get total clicks across all delivered line items (or a specific order).

    Args:
        order_id: Restrict to line items belonging to a specific order.
                  If omitted, returns clicks across ALL line items.

    Returns:
        JSON with total_clicks, scope, and per-line-item breakdown including CTR.
    """
    db = _read_db()
    line_items = db.get("line_items", [])
    scope = "all"

    if order_id is not None:
        line_items = [li for li in line_items if li.get("order_id") == order_id]
        order = next((o for o in db.get("orders", []) if o["id"] == order_id), {})
        scope = f"order:{order_id} ({order.get('name', 'unknown')})"

    breakdown = []
    for li in line_items:
        impr = li.get("impressions_delivered", 0) or 0
        clicks = li.get("clicks_delivered", 0) or 0
        breakdown.append({
            "line_item_id": li["id"],
            "line_item_name": li.get("name"),
            "clicks": clicks,
            "impressions": impr,
            "ctr_pct": round((clicks / impr * 100) if impr else 0, 3),
        })

    total_clicks = sum(b["clicks"] for b in breakdown)
    total_impr = sum(b["impressions"] for b in breakdown)
    overall_ctr = round((total_clicks / total_impr * 100) if total_impr else 0, 3)

    logger.info("get_total_clicks -> %d clicks [scope=%s]", total_clicks, scope)
    return json.dumps({
        "total_clicks": total_clicks,
        "total_impressions": total_impr,
        "overall_ctr_pct": overall_ctr,
        "scope": scope,
        "breakdown": breakdown,
    }, indent=2)


@mcp.tool()
def get_total_impressions(order_id: Optional[int] = None) -> str:
    """Get total impressions delivered across all line items (or a specific order).

    Args:
        order_id: Restrict to line items belonging to a specific order.
                  If omitted, returns impressions across ALL line items.

    Returns:
        JSON with total_impressions, total_goal_impressions, delivery_pct,
        scope, and per-line-item breakdown.
    """
    db = _read_db()
    line_items = db.get("line_items", [])
    scope = "all"

    if order_id is not None:
        line_items = [li for li in line_items if li.get("order_id") == order_id]
        order = next((o for o in db.get("orders", []) if o["id"] == order_id), {})
        scope = f"order:{order_id} ({order.get('name', 'unknown')})"

    breakdown = []
    for li in line_items:
        delivered = li.get("impressions_delivered", 0) or 0
        goal = li.get("goal_impressions", 0) or 0
        breakdown.append({
            "line_item_id": li["id"],
            "line_item_name": li.get("name"),
            "status": li.get("status"),
            "impressions_delivered": delivered,
            "goal_impressions": goal,
            "delivery_pct": round((delivered / goal * 100) if goal else 0, 1),
        })

    total_delivered = sum(b["impressions_delivered"] for b in breakdown)
    total_goal = sum(b["goal_impressions"] for b in breakdown)
    overall_delivery = round((total_delivered / total_goal * 100) if total_goal else 0, 1)

    logger.info("get_total_impressions -> %d [scope=%s]", total_delivered, scope)
    return json.dumps({
        "total_impressions": total_delivered,
        "total_goal_impressions": total_goal,
        "overall_delivery_pct": overall_delivery,
        "scope": scope,
        "breakdown": breakdown,
    }, indent=2)


# =============================================================================
# ENTRY POINT
# =============================================================================

def main() -> None:
    """Start the MCP server (stdio or HTTP based on MCP_TRANSPORT env var)."""
    global AUTH_TOKEN

    transport = os.environ.get("MCP_TRANSPORT", "stdio").lower()
    host = os.environ.get("MCP_HOST", "0.0.0.0")
    port = int(os.environ.get("MCP_PORT", "8000"))

    logger.info("=" * 60)
    logger.info("Ad Manager MCP Server v1.0.0")
    logger.info("Database: %s", DB_PATH)
    logger.info("Transport: %s", transport.upper())

    if transport == "stdio":
        logger.info("Starting in STDIO mode (Claude Desktop / Cursor compatible)")
        mcp.run(transport="stdio")
    else:
        # HTTP mode
        if AUTH_TOKEN is None:
            AUTH_TOKEN = secrets.token_hex(32)
            logger.info("Auto-generated auth token (set MCP_AUTH_TOKEN to pin a token):")
            logger.info("  Token : %s", AUTH_TOKEN)
        else:
            logger.info("Using pre-configured MCP_AUTH_TOKEN")

        logger.info("MCP endpoint : http://%s:%d/mcp", host, port)
        logger.info("=" * 60)
        logger.info("Authorization header: Bearer %s", AUTH_TOKEN)
        logger.info("=" * 60)

        mcp.run(transport="http", host=host, port=port, path="/mcp")


if __name__ == "__main__":
    main()
