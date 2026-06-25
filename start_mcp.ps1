$env:MCP_TRANSPORT = "http"
$env:MCP_PORT = "8000"
$env:MCP_AUTH_TOKEN = "pulse-ai-secure-token-123"
$env:MCP_LOG_LEVEL = "INFO"

Write-Host "Starting Pulse AI Ad Manager MCP Server (HTTP/SSE Mode)..." -ForegroundColor Cyan
Write-Host "Endpoint: http://localhost:8000/mcp" -ForegroundColor Green
Write-Host "Token:    pulse-ai-secure-token-123" -ForegroundColor Green

& "C:\Users\Lenovo\Desktop\mcp\demo-ad-manager\mcp_venv\Scripts\python.exe" "C:\Users\Lenovo\Desktop\mcp\demo-ad-manager\mcp_server.py"
