@echo off
REM ============================================================
REM  Ad Manager MCP Server — Windows HTTP startup script
REM  Usage: run_mcp_http.bat
REM  Exposes MCP endpoint at http://localhost:8000/mcp
REM ============================================================
SETLOCAL

cd /d "%~dp0"

REM Load .env if it exists
if exist .env (
    for /f "usebackq tokens=1,2 delims==" %%A in (".env") do (
        set "%%A=%%B"
    )
)

REM Force HTTP transport
set MCP_TRANSPORT=http
if not defined MCP_HOST set MCP_HOST=0.0.0.0
if not defined MCP_PORT set MCP_PORT=8000
if not defined MCP_LOG_LEVEL set MCP_LOG_LEVEL=INFO

echo [Ad Manager MCP] Starting in HTTP mode on port %MCP_PORT%...
echo [Ad Manager MCP] MCP endpoint: http://localhost:%MCP_PORT%/mcp
echo.

REM Prefer venv Python if available
if exist "mcp_venv\Scripts\python.exe" (
    "mcp_venv\Scripts\python.exe" mcp_server.py
) else if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" mcp_server.py
) else (
    python mcp_server.py
)
