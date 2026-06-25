import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

/**
 * GET /api/metrics/snapshot
 * Query params:
 *   from  - ISO timestamp (e.g. 2024-06-25T00:00:00Z)
 *   to    - ISO timestamp
 *   limit - max records to return (default 1000)
 *
 * Returns all snapshots in the given time range, or all if no range given.
 */
export async function GET(request: NextRequest) {
  const db = readDB();
  const snapshots: any[] = db.snapshots || [];

  const from = request.nextUrl.searchParams.get('from');
  const to = request.nextUrl.searchParams.get('to');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '1000', 10);

  let results = snapshots;
  if (from) results = results.filter(s => new Date(s.timestamp) >= new Date(from));
  if (to)   results = results.filter(s => new Date(s.timestamp) <= new Date(to));

  // Sort by timestamp descending, limit results
  results = results
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  return NextResponse.json({
    snapshots: results,
    total: results.length,
    oldest: results.length ? results[results.length - 1].timestamp : null,
    newest: results.length ? results[0].timestamp : null,
  });
}

/**
 * POST /api/metrics/snapshot
 * Records a new snapshot of current metrics.
 * Body: optional partial override of metric values (for testing).
 * In production this would pull from real data sources.
 */
export async function POST(request: NextRequest) {
  const db = readDB();
  if (!db.snapshots) db.snapshots = [];

  const body = await request.json().catch(() => ({}));
  const apps: any[] = db.apps || [];

  // Aggregate live metrics from db
  const totalRevenue = apps.reduce((s: number, a: any) => s + (a.revenue || 0), 0);
  const totalAdRevenue = apps.reduce((s: number, a: any) => s + (a.adRevenue || 0), 0);
  const totalSubscriptions = apps.reduce((s: number, a: any) => s + (a.subscriptions || 0), 0);
  const totalActiveUsers = apps.reduce((s: number, a: any) => s + (a.activeUsers || 0), 0);
  const totalDownloads = apps.reduce((s: number, a: any) => s + (a.downloads || 0), 0);
  const avgRating = apps.length
    ? +(apps.reduce((s: number, a: any) => s + (a.rating || 0), 0) / apps.length).toFixed(2)
    : 0;
  const avgHealthScore = apps.length
    ? Math.round(apps.reduce((s: number, a: any) => s + (a.healthScore || 0), 0) / apps.length)
    : 0;
  const criticalApps = apps.filter((a: any) => a.status === 'Critical').length;
  const warningApps = apps.filter((a: any) => a.status === 'Warning').length;
  const activeAlerts = (db.alerts || []).length;

  // Destructure timestamp out so ...restBody spread doesn't create a duplicate key
  const { timestamp: bodyTimestamp, ...restBody } = body;
  const snapshot = {
    id: `snap_${Date.now()}`,
    timestamp: bodyTimestamp || new Date().toISOString(),
    // Revenue
    totalRevenue,
    totalAdRevenue,
    totalSubscriptions,
    iapRevenue: totalRevenue - totalAdRevenue - totalSubscriptions,
    // Users
    totalActiveUsers,
    totalDownloads,
    // Quality
    avgRating,
    avgHealthScore,
    criticalApps,
    warningApps,
    activeAlerts,
    // App count
    totalApps: apps.length,
    // Overrides from body (for testing/simulation)
    ...restBody,
  };

  db.snapshots.push(snapshot);
  writeDB(db);

  return NextResponse.json({ success: true, snapshot }, { status: 201 });
}

/**
 * DELETE /api/metrics/snapshot
 * Body: { before: ISO string } — deletes all snapshots older than `before`
 */
export async function DELETE(request: NextRequest) {
  const db = readDB();
  const { before } = await request.json();
  const cutoff = new Date(before);
  const before_count = (db.snapshots || []).length;
  db.snapshots = (db.snapshots || []).filter((s: any) => new Date(s.timestamp) >= cutoff);
  writeDB(db);
  return NextResponse.json({ deleted: before_count - db.snapshots.length });
}
