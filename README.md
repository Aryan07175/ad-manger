# 📱 Ad Manager Dashboard + MCP Server

> A full-stack Ad Manager dashboard built with **Next.js 16**, connected to **Claude AI** via a **Model Context Protocol (MCP) server** — enabling natural language queries over your ad campaign data.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.10+-green?logo=python)](https://python.org)
[![FastMCP](https://img.shields.io/badge/FastMCP-2.14-orange)](https://github.com/jlowin/fastmcp)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)

---

## 🌐 Live Demo

**[https://demo-ad-manager-4euc4hbh8-aryan07175s-projects.vercel.app](https://demo-ad-manager-4euc4hbh8-aryan07175s-projects.vercel.app)**

---

## 🧠 What Is This Project?

**Ad Manager Dashboard** is a Google Ad Manager–style platform that lets you:

- 📊 **Monitor** app performance metrics — revenue, DAU, fill rates, health scores
- 📢 **Manage** advertisers, orders, line items, and creatives
- 🤖 **Talk to your data** using Claude AI through a built-in MCP server
- 📈 **Visualise** revenue trends, ratings, alerts, and AI insights in real time

The unique feature of this project is the **MCP (Model Context Protocol) integration** — instead of writing SQL queries or clicking through filters, you can simply ask Claude:

> *"What's our total ad revenue?"*  
> *"Show all active campaigns for Nike"*  
> *"List all creatives for order 2001"*

...and Claude calls the right tool, reads from `db.json`, and returns the answer.

---

## 🏗️ Architecture

### Full System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER / DEVELOPER                             │
│                                                                     │
│   Browser ──────────────────────────┐                              │
│   (Dashboard UI)                    │                              │
│                                     │                              │
│   Claude Desktop / Cursor ──────────┤                              │
│   (Natural language queries)        │                              │
└─────────────────────────────────────┼──────────────────────────────┘
                                      │
              ┌───────────────────────┼────────────────────────┐
              │                       │                        │
              ▼                       ▼                        │
┌─────────────────────┐  ┌─────────────────────┐             │
│   Next.js App       │  │   MCP Server         │             │
│   (Port 3000)       │  │   mcp_server.py      │             │
│                     │  │   (FastMCP / Python)  │             │
│  Pages:             │  │                       │             │
│  / Dashboard        │  │  Transport:           │             │
│  /apps              │  │  • STDIO (Claude)     │             │
│  /advertisers       │  │  • HTTP  (Remote)     │             │
│  /orders            │  │                       │             │
│  /line-items        │  │  Tools exposed:       │             │
│  /creatives         │  │  • list_orders        │             │
│  /analytics         │  │  • get_order          │             │
│  /reports           │  │  • list_advertisers   │             │
│  /revenue           │  │  • list_line_items    │             │
│  /alerts            │  │  • list_creatives     │             │
│  /ai-insights       │  │  • get_dashboard_     │             │
│  /ratings           │  │    metrics            │             │
│  /settings          │  │  • get_total_revenue  │             │
│  /users             │  │  • get_total_clicks   │             │
│                     │  │  • get_total_         │             │
│  API Routes:        │  │    impressions        │             │
│  /api/apps          │  │  • search_orders      │             │
│  /api/orders        │  │  • search_advertisers │             │
│  /api/advertisers   │  │  + more...            │             │
│  /api/line-items    │  └──────────┬────────────┘             │
│  /api/creatives     │             │                          │
│  /api/alerts        │             │  reads directly          │
│  /api/metrics/...   │             │                          │
└──────────┬──────────┘             │                          │
           │ reads / writes         │                          │
           └──────────┬─────────────┘                          │
                      ▼                                        │
         ┌────────────────────────┐                           │
         │       db.json          │ ◄─────────────────────────┘
         │                        │
         │  advertisers []        │
         │  orders []             │
         │  line_items []         │
         │  creatives []          │
         │  apps []               │
         │  alerts []             │
         │  snapshots []          │
         └────────────────────────┘
```

---

### How Claude + MCP Works

```
You type in Claude Desktop:
"What's the total revenue for Nike campaigns?"
          │
          ▼
┌─────────────────────┐
│   Claude (LLM)      │   ← Understands intent
│   Decides to call   │
│   get_total_revenue │
│   (advertiser_id=   │
│    1001)            │
└────────┬────────────┘
         │  MCP Protocol (STDIO)
         │  sends tool call request
         ▼
┌─────────────────────┐
│   mcp_server.py     │   ← Receives the tool call
│   FastMCP           │
│                     │
│   get_total_revenue │
│   (advertiser_id=   │
│    1001)            │
└────────┬────────────┘
         │  reads
         ▼
┌─────────────────────┐
│     db.json         │   ← Single source of truth
│                     │
│  filters orders by  │
│  advertiser 1001    │
│  sums CPM revenue   │
└────────┬────────────┘
         │  returns JSON result
         ▼
┌─────────────────────┐
│   mcp_server.py     │   ← Sends result back
└────────┬────────────┘
         │  MCP response
         ▼
┌─────────────────────┐
│   Claude (LLM)      │   ← Formats into natural language
└────────┬────────────┘
         │
         ▼
"Nike's total ad revenue is ₹45.2L across 3 active campaigns."
```

---

## 📁 Project Structure

```
demo-ad-manager/
│
├── 📂 app/                          # Next.js App Router pages
│   ├── page.tsx                     # Dashboard overview (KPIs, charts, alerts)
│   ├── layout.tsx                   # Root layout with sidebar
│   ├── globals.css                  # Global styles
│   │
│   ├── 📂 ads/                      # Ads management page
│   ├── 📂 advertisers/              # Advertisers list & details
│   ├── 📂 ai-insights/              # AI-powered anomaly insights
│   ├── 📂 alerts/                   # System alerts & notifications
│   ├── 📂 analytics/                # Analytics overview
│   ├── 📂 apps/                     # App portfolio management
│   │   └── [id]/                    # Individual app detail page
│   ├── 📂 creatives/                # Ad creatives library
│   ├── 📂 line-items/               # Line items management
│   ├── 📂 orders/                   # Campaign orders
│   ├── 📂 ratings/                  # App ratings breakdown
│   ├── 📂 reports/                  # Custom reports
│   ├── 📂 revenue/                  # Revenue analytics
│   ├── 📂 settings/                 # Dashboard settings
│   ├── 📂 users/                    # User management
│   │
│   └── 📂 api/                      # Next.js API Routes (REST)
│       ├── apps/route.ts            # GET /api/apps, POST /api/apps
│       ├── apps/[id]/route.ts       # GET/PUT/DELETE /api/apps/:id
│       ├── advertisers/route.ts     # GET/POST /api/advertisers
│       ├── advertisers/[id]/route.ts
│       ├── orders/route.ts          # GET/POST /api/orders
│       ├── orders/[id]/route.ts
│       ├── line-items/route.ts      # GET/POST /api/line-items
│       ├── line-items/[id]/route.ts
│       ├── line-items/[id]/duplicate/route.ts
│       ├── creatives/route.ts       # GET/POST /api/creatives
│       ├── creatives/[id]/route.ts
│       ├── creatives/[id]/associate/route.ts
│       ├── alerts/route.ts          # GET/POST /api/alerts
│       ├── metrics/snapshot/route.ts  # Metrics snapshots
│       └── metrics/report/route.ts    # Metrics reporting
│
├── 📂 components/                   # Reusable React components
│   ├── Sidebar.tsx                  # Navigation sidebar
│   ├── QueryProvider.tsx            # React Query provider
│   └── 📂 ui/
│       ├── Card.tsx                 # Card component
│       ├── Charts.tsx               # Recharts wrappers (Area, Bar, Line)
│       ├── LiveClock.tsx            # Real-time clock
│       └── MetricCard.tsx           # KPI metric card
│
├── 📂 lib/                          # Utilities & shared logic
│   ├── db.ts                        # JSON database read/write helpers
│   ├── mockData.ts                  # Static mock data (fallback)
│   └── utils.ts                     # Utility functions (cn, formatters)
│
├── 📂 mcp_config/                   # MCP client configuration templates
│   ├── claude_desktop_config.json   # Claude Desktop config
│   ├── cursor_mcp_config.json       # Cursor IDE config
│   ├── vscode_mcp_config.json       # VS Code config
│   └── windsurf_mcp_config.json     # Windsurf config
│
├── 📂 scripts/
│   └── record-metrics.js            # Cron-style metrics recorder
│
├── mcp_server.py                    # ⭐ FastMCP server (Python)
├── requirements.txt                 # Python dependencies
├── db.json                          # 📦 Shared JSON database
├── .env.example                     # Environment variable template
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Node.js dependencies
│
├── run_mcp.bat                      # Windows: start MCP (STDIO)
├── run_mcp.sh                       # Linux/macOS: start MCP (STDIO)
├── run_mcp_http.bat                 # Windows: start MCP (HTTP)
├── run_mcp_http.sh                  # Linux/macOS: start MCP (HTTP)
└── start_mcp.ps1                    # PowerShell launcher
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+

---

### 1. Clone the repo

```bash
git clone https://github.com/Aryan07175/ad-manger.git
cd ad-manger
```

---

### 2. Run the Next.js Dashboard

```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### 3. Set up the MCP Server (for Claude integration)

```bash
# Create a virtual environment
python -m venv mcp_venv

# Activate it
mcp_venv\Scripts\activate       # Windows
source mcp_venv/bin/activate    # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Test the server
python mcp_server.py
```

---

### 4. Connect Claude Desktop to the MCP Server

1. Open **Claude Desktop** → Settings → Developer → **Edit Config**

2. Add this to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ad-manager": {
      "command": "python",
      "args": [
        "C:\\path\\to\\ad-manger\\mcp_server.py"
      ],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "DB_PATH": "C:\\path\\to\\ad-manger\\db.json"
      }
    }
  }
}
```

3. **Restart Claude Desktop** — you'll see the `ad-manager` tools appear in the 🔨 tools panel.

---

## 🛠️ Available MCP Tools

| Tool | What it does |
|------|-------------|
| `get_dashboard_metrics` | Full dashboard snapshot — counts, KPIs, health |
| `list_orders` | All campaign orders (filter by status/advertiser) |
| `get_order` | Single order details by ID |
| `search_orders` | Search orders by name keyword |
| `list_advertisers` | All advertisers (filter by status) |
| `get_advertiser` | Single advertiser by ID |
| `search_advertisers` | Search advertisers by name |
| `list_line_items` | All line items (filter by order/status) |
| `get_line_item` | Single line item by ID |
| `list_creatives` | All creatives (filter by advertiser/line item/type) |
| `get_creative` | Single creative by ID |
| `get_total_revenue` | Total CPM revenue (filter by order/advertiser) |
| `get_total_clicks` | Total clicks delivered (filter by order) |
| `get_total_impressions` | Impressions + delivery % (filter by order) |

---

## 💬 Example Claude Queries

Once connected, try asking Claude:

```
"Show me the dashboard overview"
"What's our total ad revenue?"
"List all active campaigns"
"Show all Nike orders"
"How many impressions did order 2001 get?"
"List all creatives for advertiser 1002"
"Search for Apple campaigns"
"Show me line item 3003"
```

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Vanilla CSS (custom dark theme) |
| **Charts** | Recharts |
| **State** | React Query (TanStack Query) |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | `db.json` (flat-file JSON) |
| **MCP Server** | Python 3.10+, FastMCP 2.14 |
| **MCP Transport** | STDIO (Claude Desktop) / HTTP (remote) |
| **Deployment** | Vercel |

---

## 🌍 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Base URL for API calls |
| `MCP_TRANSPORT` | `stdio` | `stdio` or `http` |
| `MCP_HOST` | `0.0.0.0` | Bind host (HTTP mode) |
| `MCP_PORT` | `8000` | Bind port (HTTP mode) |
| `MCP_AUTH_TOKEN` | *(auto-generated)* | Bearer token (HTTP mode) |
| `DB_PATH` | `./db.json` | Path to the database file |
| `MCP_LOG_LEVEL` | `INFO` | Logging verbosity |

Copy `.env.example` to `.env` and edit as needed.

---

## 📦 Sample Data

The `db.json` comes pre-seeded with:

| Entity | Sample Data |
|--------|-------------|
| **Advertisers** | Nike Inc., Apple Corp., ACME Corp., Samsung Global |
| **Orders** | Nike Summer 2025, Apple iPhone 17 Launch, ACME Holiday |
| **Line Items** | IDs 3001–3004 across multiple orders |
| **Creatives** | IDs 4001–4004 (Banner, Video, Native) |
| **Apps** | 10 apps across categories (Food, Finance, Gaming, etc.) |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<p align="center">Built with ❤️ using Next.js + FastMCP + Claude</p>
