"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { dauTrendData, retentionData, sessionDurationData, topScreensData, funnelData } from "@/lib/mockData";
import { MultiLineChart, RetentionChart, SessionDurationChart } from "@/components/ui/Charts";
import { Activity, Users, Clock, TrendingUp, TrendingDown, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

function fmtNum(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

const kpis = [
  { label: "Daily Active Users", value: "3.2M", sub: "+4.7% vs last week", icon: <Users className="w-4 h-4 text-violet-400" />, up: true },
  { label: "Monthly Active Users", value: "8.4M", sub: "+12.1% vs last month", icon: <Activity className="w-4 h-4 text-violet-400" />, up: true },
  { label: "Avg Session Duration", value: "4m 22s", sub: "+0m 18s vs last week", icon: <Clock className="w-4 h-4 text-violet-400" />, up: true },
  { label: "Stickiness (DAU/MAU)", value: "38.1%", sub: "-1.2% vs last month", icon: <Smartphone className="w-4 h-4 text-violet-400" />, up: false },
  { label: "Bounce Rate", value: "21.4%", sub: "-2.8% (improving)", icon: <TrendingDown className="w-4 h-4 text-violet-400" />, up: true },
  { label: "Screen Views / Session", value: "6.8", sub: "+0.4 vs last week", icon: <TrendingUp className="w-4 h-4 text-violet-400" />, up: true },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Analytics</h1>
          <p className="text-zinc-400 mt-1">Deep dive into user behaviour, engagement and retention.</p>
        </div>
        <select className="bg-[#141415] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
          <option>Year to Date</option>
        </select>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="glass rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider leading-tight">{k.label}</span>
              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{k.icon}</div>
            </div>
            <div className="text-2xl font-bold text-zinc-100">{k.value}</div>
            <div className={`text-xs font-medium ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* DAU/MAU Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card gradient className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Trend</CardTitle>
            <CardDescription>DAU / WAU / MAU over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <MultiLineChart
              data={dauTrendData}
              height={280}
              lines={[
                { key: "dau", color: "#8b5cf6", name: "DAU" },
                { key: "wau", color: "#3b82f6", name: "WAU" },
                { key: "mau", color: "#10b981", name: "MAU" },
              ]}
              yFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
            />
          </CardContent>
        </Card>

        {/* Retention Curve */}
        <Card>
          <CardHeader>
            <CardTitle>Retention Curve</CardTitle>
            <CardDescription>% of users still active by day</CardDescription>
          </CardHeader>
          <CardContent>
            <RetentionChart data={retentionData} height={220} />
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[{ label: "Day 1", val: "42%" }, { label: "Day 7", val: "21%" }, { label: "Day 30", val: "8%" }].map(r => (
                <div key={r.label} className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-xs text-zinc-500">{r.label}</div>
                  <div className="text-lg font-bold text-violet-400">{r.val}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Duration + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Duration Distribution</CardTitle>
            <CardDescription>% of sessions by duration bucket</CardDescription>
          </CardHeader>
          <CardContent>
            <SessionDurationChart data={sessionDurationData} height={200} />
          </CardContent>
        </Card>

        {/* User Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>From app open to purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-2">
              {funnelData.map((step, i) => {
                const pct = Math.round((step.users / funnelData[0].users) * 100);
                return (
                  <div key={step.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-zinc-300 font-medium">{step.name}</span>
                      <span className="text-zinc-400">{fmtNum(step.users)} <span className="text-zinc-600">({pct}%)</span></span>
                    </div>
                    <div className="h-6 bg-white/5 rounded-md overflow-hidden">
                      <motion.div
                        className="h-full rounded-md"
                        style={{ background: `linear-gradient(90deg, #8b5cf6, #3b82f6)`, opacity: 0.85 - i * 0.1 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      />
                    </div>
                    {i < funnelData.length - 1 && (
                      <div className="text-right text-xs text-rose-400 mt-0.5">
                        Drop-off: {100 - Math.round((funnelData[i + 1].users / step.users) * 100)}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Screens */}
      <Card>
        <CardHeader>
          <CardTitle>Top Screens</CardTitle>
          <CardDescription>Most visited screens in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium">#</th>
                  <th className="text-left py-3 px-4 font-medium">Screen</th>
                  <th className="text-right py-3 px-4 font-medium">Views</th>
                  <th className="text-right py-3 px-4 font-medium">Avg Time</th>
                  <th className="text-right py-3 px-4 font-medium">Bounce Rate</th>
                </tr>
              </thead>
              <tbody>
                {topScreensData.map((row, i) => (
                  <tr key={row.screen} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-zinc-600 font-mono">{i + 1}</td>
                    <td className="py-3 px-4 text-zinc-200 font-medium">{row.screen}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{fmtNum(row.views)}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{row.avgTime}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${row.bounceRate > 40 ? 'bg-rose-500/10 text-rose-400' : row.bounceRate > 25 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {row.bounceRate}%
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
  );
}
