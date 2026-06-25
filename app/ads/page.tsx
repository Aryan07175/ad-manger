"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { adPerformanceData, adNetworkData, ecpmTrendData, topAdUnits, worstAdUnits } from "@/lib/mockData";
import { EcpmTrendChart, SourcesBarChart } from "@/components/ui/Charts";
import { Megaphone, TrendingUp, TrendingDown, Zap, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function fmtCurrency(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
}

function fmtNum(v: number) {
  if (v >= 1000000000) return `${(v / 1000000000).toFixed(1)}B`;
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

const adTypes = [
  { key: 'banner', label: 'Banner', color: '#10b981' },
  { key: 'interstitial', label: 'Interstitial', color: '#3b82f6' },
  { key: 'rewarded', label: 'Rewarded', color: '#8b5cf6' },
  { key: 'native', label: 'Native', color: '#f59e0b' },
  { key: 'video', label: 'Video', color: '#ec4899' },
];

const kpis = [
  { label: "Total Ad Revenue", value: "₹1.67Cr", sub: "+8.2% vs last month", up: true },
  { label: "Total Impressions", value: "393M", sub: "+6.4% vs last month", up: true },
  { label: "Avg eCPM", value: "₹425", sub: "+12.1% vs last month", up: true },
  { label: "Avg Fill Rate", value: "85.4%", sub: "-1.2% vs last month", up: false },
  { label: "Avg CTR", value: "4.96%", sub: "+0.3% vs last month", up: true },
];

export default function AdsPage() {
  const adRevenueChartData = adTypes.map(t => ({
    name: t.label,
    value: adPerformanceData[t.key as keyof typeof adPerformanceData].revenue / 100000,
    color: t.color,
  }));

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Ads</h1>
          <p className="text-zinc-400 mt-1">Advertising performance, mediation and ad unit analytics.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-[#141415] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option>All Networks</option>
            <option>AdMob</option>
            <option>AppLovin</option>
            <option>Meta AN</option>
          </select>
          <select className="bg-[#141415] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="glass rounded-xl p-4 flex flex-col gap-2"
          >
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{k.label}</span>
            <div className="text-2xl font-bold text-zinc-100">{k.value}</div>
            <div className={`text-xs font-medium flex items-center gap-1 ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {k.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Ad Type */}
        <Card gradient>
          <CardHeader>
            <CardTitle>Revenue by Ad Type</CardTitle>
            <CardDescription>In ₹ Lakhs</CardDescription>
          </CardHeader>
          <CardContent>
            <SourcesBarChart data={adRevenueChartData} height={250} />
          </CardContent>
        </Card>

        {/* eCPM Trend */}
        <Card>
          <CardHeader>
            <CardTitle>eCPM Trend</CardTitle>
            <CardDescription>Banner, Interstitial & Rewarded eCPM (₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <EcpmTrendChart data={ecpmTrendData} height={260} />
          </CardContent>
        </Card>
      </div>

      {/* Ad Format Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-violet-400" /> Ad Format Performance
          </CardTitle>
          <CardDescription>Detailed metrics per ad format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium">Format</th>
                  <th className="text-right py-3 px-4 font-medium">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium">Impressions</th>
                  <th className="text-right py-3 px-4 font-medium">eCPM</th>
                  <th className="text-right py-3 px-4 font-medium">CTR</th>
                  <th className="text-right py-3 px-4 font-medium">Fill Rate</th>
                </tr>
              </thead>
              <tbody>
                {adTypes.map((type) => {
                  const d = adPerformanceData[type.key as keyof typeof adPerformanceData];
                  return (
                    <tr key={type.key} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: type.color }} />
                          <span className="text-zinc-200 font-medium">{type.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-zinc-100">{fmtCurrency(d.revenue)}</td>
                      <td className="py-3 px-4 text-right text-zinc-300">{fmtNum(d.impressions)}</td>
                      <td className="py-3 px-4 text-right text-zinc-300">₹{d.ecpm}</td>
                      <td className="py-3 px-4 text-right text-zinc-300">{d.ctr}%</td>
                      <td className="py-3 px-4 text-right">
                        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full",
                          d.fillRate >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                          d.fillRate >= 75 ? 'bg-amber-500/10 text-amber-400' :
                          'bg-rose-500/10 text-rose-400'
                        )}>
                          {d.fillRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ad Network Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Network Performance</CardTitle>
          <CardDescription>Revenue and fill rate across all connected ad networks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium">Network</th>
                  <th className="text-right py-3 px-4 font-medium">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium">Impressions</th>
                  <th className="text-right py-3 px-4 font-medium">eCPM</th>
                  <th className="text-right py-3 px-4 font-medium">Fill Rate</th>
                  <th className="text-right py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {adNetworkData.map((n) => (
                  <tr key={n.network} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-zinc-200 font-semibold">{n.network}</td>
                    <td className="py-3 px-4 text-right font-semibold text-zinc-100">{fmtCurrency(n.revenue)}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{fmtNum(n.impressions)}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">₹{n.ecpm}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${n.fillRate}%`, background: n.fillRate >= 85 ? '#10b981' : '#f59e0b' }} />
                        </div>
                        <span className="text-zinc-300 w-10 text-right">{n.fillRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn("text-xs font-semibold px-2 py-1 rounded-full",
                        n.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      )}>
                        {n.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top & Worst Ad Units */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" /> Top Performing Ad Units
            </CardTitle>
            <CardDescription>Highest revenue generating units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topAdUnits.map((u, i) => (
                <div key={u.unit} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 font-mono text-sm w-4">{i + 1}</span>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">{u.unit}</div>
                      <span className="text-xs text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">{u.type}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-zinc-100">{fmtCurrency(u.revenue)}</div>
                    <div className="text-xs text-zinc-500">₹{u.ecpm} eCPM · {u.fillRate}% fill</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Worst Performing Ad Units
            </CardTitle>
            <CardDescription>Units needing immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {worstAdUnits.map((u, i) => (
                <div key={u.unit} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 font-mono text-sm w-4">{i + 1}</span>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">{u.unit}</div>
                      <span className="text-xs text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">{u.type}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-zinc-100">{fmtCurrency(u.revenue)}</div>
                    <div className="text-xs text-rose-400">₹{u.ecpm} eCPM · {u.fillRate}% fill</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
