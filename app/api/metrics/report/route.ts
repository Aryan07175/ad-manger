import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

/**
 * POST /api/metrics/report
 * Body: { from: ISO, to: ISO, apps?: string[], format?: 'json'|'csv' }
 * Generates a summary report for the given time range.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { from, to, format = 'json' } = body;

  const db = readDB();
  const snapshots: any[] = db.snapshots || [];

  let results = snapshots;
  if (from) results = results.filter(s => new Date(s.timestamp) >= new Date(from));
  if (to)   results = results.filter(s => new Date(s.timestamp) <= new Date(to));
  results = results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (results.length === 0) {
    return NextResponse.json({ error: 'No data found for the given time range', snapshots: 0 }, { status: 404 });
  }

  // Summary statistics
  const first = results[0];
  const last = results[results.length - 1];

  const avg = (key: string) =>
    results.reduce((s, r) => s + (r[key] || 0), 0) / results.length;
  const max = (key: string) =>
    Math.max(...results.map(r => r[key] || 0));
  const min = (key: string) =>
    Math.min(...results.map(r => r[key] || 0));

  const revenueChange = last.totalRevenue - first.totalRevenue;
  const revenueChangePct = first.totalRevenue ? +((revenueChange / first.totalRevenue) * 100).toFixed(2) : 0;
  const userChange = last.totalActiveUsers - first.totalActiveUsers;
  const userChangePct = first.totalActiveUsers ? +((userChange / first.totalActiveUsers) * 100).toFixed(2) : 0;

  const report = {
    generated_at: new Date().toISOString(),
    period: { from: from || first.timestamp, to: to || last.timestamp },
    data_points: results.length,
    duration_hours: +((new Date(last.timestamp).getTime() - new Date(first.timestamp).getTime()) / 3600000).toFixed(1),
    summary: {
      revenue: {
        start: first.totalRevenue,
        end: last.totalRevenue,
        change: revenueChange,
        change_pct: revenueChangePct,
        avg: Math.round(avg('totalRevenue')),
        peak: max('totalRevenue'),
        low: min('totalRevenue'),
        ad_revenue: last.totalAdRevenue,
        subscriptions: last.totalSubscriptions,
      },
      users: {
        start: first.totalActiveUsers,
        end: last.totalActiveUsers,
        change: userChange,
        change_pct: userChangePct,
        avg: Math.round(avg('totalActiveUsers')),
        peak: max('totalActiveUsers'),
        low: min('totalActiveUsers'),
      },
      quality: {
        avg_rating: +avg('avgRating').toFixed(2),
        avg_health_score: Math.round(avg('avgHealthScore')),
        peak_alerts: max('activeAlerts'),
        critical_apps_avg: +avg('criticalApps').toFixed(1),
      },
      apps: {
        total: last.totalApps,
        critical: last.criticalApps,
        warning: last.warningApps,
      },
    },
    timeseries: results,
  };

  if (format === 'csv') {
    const headers = [
      'timestamp', 'totalRevenue', 'totalAdRevenue', 'totalSubscriptions',
      'iapRevenue', 'totalActiveUsers', 'totalDownloads', 'avgRating',
      'avgHealthScore', 'criticalApps', 'warningApps', 'activeAlerts', 'totalApps',
    ];
    const rows = results.map(r =>
      headers.map(h => JSON.stringify(r[h] ?? '')).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="report_${from?.replace(/[:.]/g, '-')}_to_${to?.replace(/[:.]/g, '-')}.csv"`,
      },
    });
  }

  return NextResponse.json(report);
}
