const http = require('http');

const API_URL = 'http://localhost:3000/api/metrics/snapshot';
// Default interval is 1 hour (3600000 ms), but can be overridden by argument
// For testing/demo, the user might want a much shorter interval like 10s (10000 ms)
const intervalStr = process.argv[2] || '3600000';
const intervalMs = parseInt(intervalStr, 10);

console.log(`Starting metrics recorder. Interval: ${intervalMs}ms (${intervalMs / 1000} seconds)`);

function recordSnapshot() {
  const req = http.request(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 201) {
        const snapshot = JSON.parse(data).snapshot;
        console.log(`[${new Date().toISOString()}] Snapshot saved. Revenue: ₹${snapshot.totalRevenue}`);
      } else {
        console.error(`[${new Date().toISOString()}] Failed to save snapshot: HTTP ${res.statusCode}`);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`[${new Date().toISOString()}] Connection error (is server running?): ${e.message}`);
  });

  req.end();
}

// Record immediately on start
recordSnapshot();

// Schedule subsequent recordings
setInterval(recordSnapshot, intervalMs);
