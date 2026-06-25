@echo off
REM ============================================================
REM  Ad Manager MCP Server — Windows STDIO startup script
REM  Usage: run_mcp.bat
REM  Used by: Claude Desktop, Cursor, VS Code, Windsurf
REM ============================================================
SETLOCAL

REM Change to the directory containing this script
cd /d "%~dp0"

REM Load .env if it exists
if exist .env (
    for /f "usebackq tokens=1,2 delims==" %%A in (".env") do (
        set "%%A=%%B"
    )
)

REM Default transport = stdio (for local AI clients)
if not defined MCP_TRANSPORT set MCP_TRANSPORT=stdio
if not defined MCP_LOG_LEVEL set MCP_LOG_LEVEL=INFO

echo [Ad Manager MCP] Starting in STDIO mode...

REM Prefer venv Python if available
if exist "mcp_venv\Scripts\python.exe" (
    "mcp_venv\Scripts\python.exe" mcp_server.py
) else if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" mcp_server.py
) else (
    python mcp_server.py
)
