#!/usr/bin/env bash
# ============================================================
#  Ad Manager MCP Server — Linux/macOS HTTP startup script
#  Usage:  chmod +x run_mcp_http.sh && ./run_mcp_http.sh
#  Exposes MCP endpoint at http://localhost:8000/mcp
# ============================================================
set -euo pipefail

cd "$(dirname "$0")"

# Load .env if it exists
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export MCP_TRANSPORT=http
export MCP_HOST="${MCP_HOST:-0.0.0.0}"
export MCP_PORT="${MCP_PORT:-8000}"
export MCP_LOG_LEVEL="${MCP_LOG_LEVEL:-INFO}"

echo "[Ad Manager MCP] Starting in HTTP mode on port ${MCP_PORT}..."
echo "[Ad Manager MCP] MCP endpoint: http://localhost:${MCP_PORT}/mcp"
echo ""

# Prefer venv Python if available
if [ -f "mcp_venv/bin/python" ]; then
  exec "mcp_venv/bin/python" mcp_server.py
elif [ -f ".venv/bin/python" ]; then
  exec ".venv/bin/python" mcp_server.py
else
  exec python3 mcp_server.py
fi
