"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Download, Calendar, Activity, DollarSign, Users, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

function fmtCurrency(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
}

function fmtNumber(val: number): string {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toLocaleString();
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const generateReport = async (format: "json" | "csv") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/metrics/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: from ? new Date(from).toISOString() : undefined,
          to: to ? new Date(to).toISOString() : undefined,
          format,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate report");
      }

      if (format === "csv") {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        setReport(data);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Reports Generation</h1>
          <p className="text-zinc-400 mt-1">Generate on-demand historical reports of platform metrics.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-400" />
            Report Parameters
          </CardTitle>
          <CardDescription>Select the time range to query the snapshot database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Start Date/Time (Local)</label>
              <input
                type="datetime-local"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="block w-full bg-[#141415] border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">End Date/Time (Local)</label>
              <input
                type="datetime-local"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="block w-full bg-[#141415] border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => generateReport("json")}
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? "Generating..." : "Generate Summary"}
              </button>
              <button
                onClick={() => generateReport("csv")}
                disabled={loading}
                className="bg-[#141415] hover:bg-white/5 border border-white/10 disabled:opacity-50 text-zinc-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> CSV Export
              </button>
            </div>
          </div>
          {error && <div className="mt-4 text-sm text-rose-400 font-medium">{error}</div>}
        </CardContent>
      </Card>

      {report && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            Report Summary
            <span className="text-xs font-normal bg-white/5 border border-white/10 px-2 py-1 rounded text-zinc-400">
              {report.data_points} snapshots over {report.duration_hours} hours
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/[0.02]">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Revenue Change</div>
                  <div className="text-2xl font-bold text-zinc-100">{fmtCurrency(report.summary.revenue.change)}</div>
                  <div className={cn("text-xs mt-1", report.summary.revenue.change_pct >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {report.summary.revenue.change_pct >= 0 ? "+" : ""}{report.summary.revenue.change_pct}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02]">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Users Change</div>
                  <div className="text-2xl font-bold text-zinc-100">{fmtNumber(report.summary.users.change)}</div>
                  <div className={cn("text-xs mt-1", report.summary.users.change_pct >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {report.summary.users.change_pct >= 0 ? "+" : ""}{report.summary.users.change_pct}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02]">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Avg Health Score</div>
                  <div className="text-2xl font-bold text-zinc-100">{report.summary.quality.avg_health_score}/100</div>
                  <div className="text-xs text-zinc-500 mt-1">Average over period</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02]">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Peak Alerts</div>
                  <div className="text-2xl font-bold text-zinc-100">{report.summary.quality.peak_alerts}</div>
                  <div className="text-xs text-zinc-500 mt-1">Max active concurrently</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Timeline</CardTitle>
              <CardDescription>Metrics snapshot at each recording interval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                      <th className="text-right py-3 px-4 font-medium">Total Rev</th>
                      <th className="text-right py-3 px-4 font-medium">Active Users</th>
                      <th className="text-right py-3 px-4 font-medium">Avg Rating</th>
                      <th className="text-right py-3 px-4 font-medium">Health</th>
                      <th className="text-center py-3 px-4 font-medium">Alerts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {report.timeseries.map((row: any) => (
                      <tr key={row.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 text-zinc-300">{new Date(row.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-zinc-200 font-medium">{fmtCurrency(row.totalRevenue)}</td>
                        <td className="py-3 px-4 text-right text-zinc-300">{fmtNumber(row.totalActiveUsers)}</td>
                        <td className="py-3 px-4 text-right text-amber-400">{row.avgRating}★</td>
                        <td className="py-3 px-4 text-right text-zinc-300">{row.avgHealthScore}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs", row.activeAlerts > 0 ? "bg-rose-500/10 text-rose-400" : "bg-zinc-500/10 text-zinc-400")}>
                            {row.activeAlerts}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
