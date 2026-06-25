# Ad Manager MCP Server

An MCP (Model Context Protocol) server that connects Claude Desktop, Cursor, VS Code, Windsurf, and any MCP-compatible AI client to the Ad Manager dashboard data.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     AI Client (Claude / Cursor)                  │
│                    asks: "Show total revenue"                    │
└───────────────────────────┬──────────────────────────────────────┘
                            │ MCP (STDIO or HTTP)
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    mcp_server.py  (FastMCP)                      │
│  Tools: list_orders · get_order · list_line_items · get_line_item│
│         list_advertisers · get_advertiser · search_orders        │
│         search_advertisers · list_creatives · get_creative       │
│         get_dashboard_metrics · get_total_revenue                │
│         get_total_clicks · get_total_impressions                 │
└───────────────────────────┬──────────────────────────────────────┘
                            │ reads directly
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                         db.json                                  │
│    advertisers · orders · line_items · creatives                 │
│         (same file used by the Next.js dashboard)                │
└──────────────────────────────────────────────────────────────────┘
```

**Stack:**
- Frontend: Next.js 16 + React 19 + TypeScript  
- Backend: Next.js API routes (`/api/orders`, `/api/line-items`, etc.)  
- Database: `db.json` (JSON file, read/written by both Next.js and the MCP server)  
- MCP layer: Python 3.10+ + FastMCP ≥ 2.14

---

## Project structure (MCP files added)

```
demo-ad-manager/
├── mcp_server.py          ← Main FastMCP server  ⭐ NEW
├── requirements.txt       ← Python dependencies  ⭐ NEW
├── .env.example           ← Environment template  ⭐ NEW
├── run_mcp.bat            ← Windows STDIO launcher  ⭐ NEW
├── run_mcp_http.bat       ← Windows HTTP launcher  ⭐ NEW
├── run_mcp.sh             ← Linux/macOS STDIO launcher  ⭐ NEW
├── run_mcp_http.sh        ← Linux/macOS HTTP launcher  ⭐ NEW
├── mcp_config/            ← IDE configuration examples  ⭐ NEW
│   ├── claude_desktop_config.json
│   ├── cursor_mcp_config.json
│   ├── vscode_mcp_config.json
│   └── windsurf_mcp_config.json
├── db.json                ← Shared database (existing)
├── app/                   ← Next.js pages & API routes (existing)
└── ...
```

---

## Quick Start

### 1. Install Python dependencies

```bash
# Inside demo-ad-manager/
pip install -r requirements.txt

# Or with a virtual environment (recommended)
python -m venv mcp_venv
mcp_venv\Scripts\activate        # Windows
source mcp_venv/bin/activate     # Linux/macOS
pip install -r requirements.txt
```

### 2. (Optional) Copy .env

```bash
cp .env.example .env
# Edit .env if needed — defaults work out of the box
```

### 3. Test the server

```bash
# Verify it starts without error
python mcp_server.py
```

You should see:
```
2026-06-25 12:00:00 [INFO] ad_manager_mcp - ============================================================
2026-06-25 12:00:00 [INFO] ad_manager_mcp - Ad Manager MCP Server v1.0.0
2026-06-25 12:00:00 [INFO] ad_manager_mcp - Database: C:\...\demo-ad-manager\db.json
2026-06-25 12:00:00 [INFO] ad_manager_mcp - Transport: STDIO
2026-06-25 12:00:00 [INFO] ad_manager_mcp - Starting in STDIO mode (Claude Desktop / Cursor compatible)
```

Press `Ctrl+C` to stop.

---

## Available MCP Tools

| Tool | Description | Key parameters |
|------|-------------|----------------|
| `list_orders` | All orders (optionally filtered) | `status`, `advertiser_id` |
| `get_order` | Single order by ID | `order_id` |
| `search_orders` | Search orders by name | `query` |
| `list_line_items` | All line items (optionally filtered) | `order_id`, `status` |
| `get_line_item` | Single line item by ID | `line_item_id` |
| `list_advertisers` | All advertisers | `status` |
| `get_advertiser` | Single advertiser by ID | `advertiser_id` |
| `search_advertisers` | Search advertisers by name | `query` |
| `list_creatives` | All creatives (optionally filtered) | `advertiser_id`, `line_item_id`, `creative_type` |
| `get_creative` | Single creative by ID | `creative_id` |
| `get_dashboard_metrics` | Full dashboard snapshot (counts + KPIs) | — |
| `get_total_revenue` | Total CPM revenue | `order_id`, `advertiser_id` |
| `get_total_clicks` | Total clicks delivered | `order_id` |
| `get_total_impressions` | Total impressions + delivery % | `order_id` |

### Sample data IDs

| Entity | IDs |
|--------|-----|
| Advertisers | 1001 (Nike), 1002 (Apple), 1003 (ACME), 1004 (Samsung) |
| Orders | 2001 (Nike Summer), 2002 (Apple iPhone 17 Launch), 2003 (ACME Holiday) |
| Line Items | 3001, 3002, 3003, 3004 |
| Creatives | 4001, 4002, 4003, 4004 |

---

## Tool → User request mapping

| User says | MCP tool called |
|-----------|-----------------|
| "Show all active campaigns" | `list_orders(status="DELIVERING")` |
| "Show all orders" | `list_orders()` |
| "What's the total revenue?" | `get_total_revenue()` |
| "How many clicks did we get?" | `get_total_clicks()` |
| "Show impressions" | `get_total_impressions()` |
| "Show me the dashboard" | `get_dashboard_metrics()` |
| "Details on order 2001" | `get_order(order_id=2001)` |
| "Search for Nike campaigns" | `search_orders(query="Nike")` |
| "List all advertisers" | `list_advertisers()` |
| "Who is advertiser 1002?" | `get_advertiser(advertiser_id=1002)` |
| "Search Apple" | `search_advertisers(query="Apple")` |
| "Show line item 3003" | `get_line_item(line_item_id=3003)` |
| "List all creatives" | `list_creatives()` |
| "Show creative 4001" | `get_creative(creative_id=4001)` |

---

## Claude Desktop Setup

1. Open Claude Desktop → **Settings → Developer → Edit Config**  
   (File: `%APPDATA%\Claude\claude_desktop_config.json` on Windows)

2. Paste the contents of `mcp_config/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ad-manager": {
      "command": "python",
      "args": [
        "C:\\Users\\Lenovo\\Desktop\\mcp\\demo-ad-manager\\mcp_server.py"
      ],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "MCP_LOG_LEVEL": "INFO",
        "DB_PATH": "C:\\Users\\Lenovo\\Desktop\\mcp\\demo-ad-manager\\db.json"
      }
    }
  }
}
```

3. Restart Claude Desktop.  
4. You'll see `ad-manager` appear in the tools panel (hammer icon 🔨).

> **Tip:** If `python` is not on your PATH, use the full path:  
> `"C:\\Users\\Lenovo\\AppData\\Local\\Programs\\Python\\Python312\\python.exe"`

---

## Cursor Setup

1. Open Cursor → **File → Preferences → MCP** (or `.cursor/mcp.json` in workspace root)
2. Paste the contents of `mcp_config/cursor_mcp_config.json`
3. Restart Cursor

---

## VS Code MCP Setup

1. Install the **MCP extension** from the VS Code marketplace  
2. Open workspace settings (`.vscode/settings.json`) and add:

```json
{
  "mcp.servers": {
    "ad-manager": {
      "type": "stdio",
      "command": "python",
      "args": [
        "C:\\Users\\Lenovo\\Desktop\\mcp\\demo-ad-manager\\mcp_server.py"
      ],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "DB_PATH": "C:\\Users\\Lenovo\\Desktop\\mcp\\demo-ad-manager\\db.json"
      }
    }
  }
}
```

---

## Windsurf Setup

1. Open Windsurf → **Settings → MCP Servers** (or edit `~/.windsurf/mcp.json`)
2. Paste the contents of `mcp_config/windsurf_mcp_config.json`
3. Reload Windsurf

---

## HTTP Transport (Remote Access)

Use HTTP mode to expose the MCP server over the network so any HTTP-capable client can connect.

### Start HTTP server

**Windows:**
```cmd
run_mcp_http.bat
```

**Linux / macOS:**
```bash
chmod +x run_mcp_http.sh
./run_mcp_http.sh
```

**Or directly:**
```bash
MCP_TRANSPORT=http MCP_PORT=8000 python mcp_server.py
```

### Output on startup
```
[INFO] Ad Manager MCP Server v1.0.0
[INFO] Transport: HTTP
[INFO] MCP endpoint : http://0.0.0.0:8000/mcp
[INFO] ============================================================
[INFO] Authorization header: Bearer abc123def456...
[INFO] ============================================================
```

### Connect via HTTP (example with curl)

```bash
# The MCP endpoint follows the MCP HTTP SSE protocol
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_dashboard_metrics","arguments":{}}}'
```

### Fix token for production

Set in `.env`:
```
MCP_AUTH_TOKEN=my-long-secret-token
MCP_TRANSPORT=http
```

---

## Environment variables reference

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_TRANSPORT` | `stdio` | `stdio` or `http` |
| `MCP_HOST` | `0.0.0.0` | Bind host (HTTP mode) |
| `MCP_PORT` | `8000` | Bind port (HTTP mode) |
| `MCP_AUTH_TOKEN` | *(auto)* | Bearer token (HTTP mode). If not set, random token is generated. |
| `DB_PATH` | `./db.json` | Path to database file |
| `MCP_LOG_LEVEL` | `INFO` | `DEBUG`, `INFO`, `WARNING`, `ERROR` |

---

## Troubleshooting

### `ModuleNotFoundError: No module named 'fastmcp'`

```bash
pip install -r requirements.txt
```

### `Database file not found`

Make sure `DB_PATH` points to `db.json`:
```bash
DB_PATH=C:\Users\Lenovo\Desktop\mcp\demo-ad-manager\db.json python mcp_server.py
```

Or run `mcp_server.py` from the `demo-ad-manager/` directory:
```bash
cd C:\Users\Lenovo\Desktop\mcp\demo-ad-manager
python mcp_server.py
```

### Claude Desktop shows no tools

1. Check the config path: `%APPDATA%\Claude\claude_desktop_config.json`
2. Verify `python` is on PATH: open cmd → `python --version`
3. Use the full absolute Python path in the config
4. Restart Claude Desktop after editing the config

### HTTP 403 / Access denied

Make sure to include the Bearer token in every request:
```
Authorization: Bearer <token printed at startup>
```

### Port 8000 already in use

```bash
MCP_PORT=8080 ./run_mcp_http.sh
```

---

## Development — run both servers together

```bash
# Terminal 1 — Next.js dashboard
cd demo-ad-manager
npm run dev
# → http://localhost:3000

# Terminal 2 — MCP server (HTTP for testing)
cd demo-ad-manager
MCP_TRANSPORT=http python mcp_server.py
# → http://localhost:8000/mcp
```

Both read the same `db.json`, so changes made via the dashboard are instantly
visible to the MCP server and vice versa.

---

## Security notes

- **STDIO transport**: No network exposure, no auth needed. Safe by design.
- **HTTP transport**: Always set `MCP_AUTH_TOKEN` in production.  
  The auto-generated token is printed to stdout on every startup (not ideal for production).
- The MCP server only **reads** from `db.json` — it never writes.
- Run behind a reverse proxy (nginx/caddy) with TLS for public-facing deployments.
