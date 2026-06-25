"""
Test all 14 MCP tool functions by calling the underlying Python functions directly.
FastMCP wraps them in FunctionTool descriptors, so we import and call the
module-level functions before they are decorated.
"""
import sys
import json
import warnings
warnings.filterwarnings("ignore")

# We need to call the raw Python functions (not the FastMCP-wrapped descriptors).
# Reload the module's source and exec it without the mcp decorators by
# directly calling the functions from the global namespace after module load.

import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location("mcp_server", "mcp_server.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

# Get the underlying functions from the FastMCP tool registry
# FastMCP >= 2.x stores tools; we call _read_db() based helpers directly.

# Instead of going through the MCP descriptors, call the module functions by name
# (they exist as real functions in mod.__dict__ before decoration applied)
# Actually with FastMCP the @mcp.tool() decorator registers AND returns the original fn
# So mod.list_orders is the FunctionTool — but the original fn is stored inside it.

def call_tool(tool_name, **kwargs):
    """Extract and call the underlying Python function from a FastMCP FunctionTool."""
    tool_fn = getattr(mod, tool_name)
    # FastMCP FunctionTool stores original fn at .fn attribute
    if hasattr(tool_fn, "fn"):
        return tool_fn.fn(**kwargs)
    # Fallback: direct call
    return tool_fn(**kwargs)


print("=== list_orders() ===")
result = json.loads(call_tool("list_orders"))
print("Total orders:", result["total"])
for o in result["orders"]:
    print("  [{status}] {name} - rev ${rev}".format(
        status=o["status"], name=o["name"], rev=o["total_revenue_usd"]
    ))

print()
print("=== list_orders(status=DELIVERING) — Active Campaigns ===")
result = json.loads(call_tool("list_orders", status="DELIVERING"))
print("Delivering orders:", result["total"])
for o in result["orders"]:
    print("  ", o["name"])

print()
print("=== get_total_revenue() ===")
result = json.loads(call_tool("get_total_revenue"))
print("Total Revenue: $", result["total_revenue_usd"])

print()
print("=== get_total_clicks() ===")
result = json.loads(call_tool("get_total_clicks"))
print("Total Clicks:", result["total_clicks"], " CTR:", result["overall_ctr_pct"], "%")

print()
print("=== get_total_impressions() ===")
result = json.loads(call_tool("get_total_impressions"))
print("Total Impressions:", result["total_impressions"], " Delivery:", result["overall_delivery_pct"], "%")

print()
print("=== search_orders(query=Nike) ===")
result = json.loads(call_tool("search_orders", query="Nike"))
print("Results:", result["total"])
for o in result["orders"]:
    print("  ", o["name"])

print()
print("=== search_advertisers(query=Apple) ===")
result = json.loads(call_tool("search_advertisers", query="Apple"))
print("Results:", result["total"])
for a in result["advertisers"]:
    print("  ", a["name"])

print()
print("=== get_order(order_id=2001) ===")
result = json.loads(call_tool("get_order", order_id=2001))
print("Order:", result["name"], "| Advertiser:", result["advertiser_name"])
print("Line items:", result["total_line_items"], "| Revenue: $", result["total_revenue_usd"])

print()
print("=== list_line_items() ===")
result = json.loads(call_tool("list_line_items"))
print("Total line items:", result["total"])
for li in result["line_items"]:
    print("  [{status}] {name} - ${rev}".format(
        status=li["status"], name=li["name"], rev=li["revenue_usd"]
    ))

print()
print("=== get_line_item(line_item_id=3001) ===")
result = json.loads(call_tool("get_line_item", line_item_id=3001))
print("Line item:", result["name"], "| CTR:", result["ctr_pct"], "% | Revenue: $", result["revenue_usd"])

print()
print("=== list_advertisers() ===")
result = json.loads(call_tool("list_advertisers"))
print("Total advertisers:", result["total"])
for a in result["advertisers"]:
    print("  [{status}] {name} - ${rev}".format(
        status=a["status"], name=a["name"], rev=a["total_revenue_usd"]
    ))

print()
print("=== get_advertiser(advertiser_id=1001) ===")
result = json.loads(call_tool("get_advertiser", advertiser_id=1001))
print("Advertiser:", result["name"], "| Orders:", result["total_orders"], "| Revenue: $", result["total_revenue_usd"])

print()
print("=== list_creatives() ===")
result = json.loads(call_tool("list_creatives"))
print("Total creatives:", result["total"])

print()
print("=== get_creative(creative_id=4001) ===")
result = json.loads(call_tool("get_creative", creative_id=4001))
print("Creative:", result["name"], "| Size:", result["width"], "x", result["height"])

print()
print("=== get_dashboard_metrics() ===")
result = json.loads(call_tool("get_dashboard_metrics"))
s = result["summary"]
print("  Orders:", s["total_orders"], " Line Items:", s["total_line_items"])
print("  Revenue: $", s["total_revenue_usd"], " CTR:", s["overall_ctr_pct"], "% eCPM: $", s["effective_cpm_usd"])
print("  Top line item:", result["top_line_items_by_revenue"][0]["name"])

print()
print("=" * 60)
print("ALL 14 MCP TOOLS TESTED AND PASSED SUCCESSFULLY")
print("=" * 60)
