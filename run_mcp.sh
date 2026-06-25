#!/usr/bin/env bash
# ============================================================
#  Ad Manager MCP Server — Linux/macOS STDIO startup script
#  Usage:  chmod +x run_mcp.sh && ./run_mcp.sh
#  Used by: Claude Desktop, Cursor, VS Code, Windsurf
# ============================================================
set -euo pipefail

# Change to the directory containing this script
cd "$(dirname "$0")"

# Load .env if it exists
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export MCP_TRANSPORT="${MCP_TRANSPORT:-stdio}"
export MCP_LOG_LEVEL="${MCP_LOG_LEVEL:-INFO}"

echo "[Ad Manager MCP] Starting in STDIO mode..."

# Prefer venv Python if available
if [ -f "mcp_venv/bin/python" ]; then
  exec "mcp_venv/bin/python" mcp_server.py
elif [ -f ".venv/bin/python" ]; then
  exec ".venv/bin/python" mcp_server.py
else
  exec python3 mcp_server.py
fi
