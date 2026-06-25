"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  revenueChartData, dailyRevenueData, countryRevenueData,
  platformRevenueData, revenueSourceBreakdown, aiInsightsData
} from "@/lib/mockData";
import { RevenueAreaChart, DonutChart, MultiLineChart } from "@/components/ui/Charts";
import { DollarSign, TrendingUp, TrendingDown, Globe, BrainCircuit, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function fmtCurrency(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
}

const kpis = [
  { label: "Total Revenue (MTD)", value: "₹2.84Cr", sub: "+12.4% vs last month", up: true },
  { label: "Ad Revenue", value: "₹1.28Cr", sub: "+8.2% vs last month", up: true },
  { label: "Subscriptions", value: "₹1.14Cr", sub: "+15.4% vs last month", up: true },
  { label: "In-App Purchases", value: "₹28.5L", sub: "-3.1% vs last month", up: false },
  { label: "ARPU", value: "₹33.87", sub: "+4.1% vs last month", up: true },
  { label: "MoM Growth", value: "+12.4%", sub: "vs +8.1% last month", up: true },
];

const forecastItems = [
  { label: "Next Month Revenue", value: "₹3.12Cr", confidence: 87 },
  { label: "Projected DAU", value: "3.5M", confidence: 82 },
  { label: "Sub Renewals", value: "89,200", confidence: 91 },
  { label: "Churn Rate", value: "4.2%", confidence: 78 },
];

export default function RevenuePage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Revenue</h1>
          <p className="text-zinc-400 mt-1">Comprehensive revenue breakdown, forecasting & source analysis.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-[#141415] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option>All Apps</option>
            <option>Gaming App</option>
            <option>Music Streaming</option>
            <option>Chat App</option>
          </select>
          <select className="bg-[#141415] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Year to Date</option>
          </select>
        </div>
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
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider leading-tight">{k.label}</span>
            <div className="text-2xl font-bold text-zinc-100">{k.value}</div>
            <div className={`text-xs font-medium flex items-center gap-1 ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {k.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <Card gradient>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Ads, Subscriptions, and IAP month-over-month</CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueAreaChart data={revenueChartData} height={300} />
        </CardContent>
      </Card>

      {/* Revenue Sources + Platform Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sources */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
            <CardDescription>Breakdown across all monetization types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueSourceBreakdown.map((src) => (
                <div key={src.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: src.color }} />
                    <div>
                      <div className="font-medium text-zinc-200">{src.name}</div>
                      <div className={`text-xs mt-0.5 ${src.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {src.growth >= 0 ? '+' : ''}{src.growth}% vs last month
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-zinc-100">{fmtCurrency(src.revenue)}</div>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(src.revenue / revenueSourceBreakdown[0].revenue) * 100}%`, background: src.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Split */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Revenue</CardTitle>
            <CardDescription>Android vs iOS vs Web</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={platformRevenueData} height={200} />
            <div className="space-y-2 mt-4">
              {platformRevenueData.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-zinc-400">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-200 font-semibold">{p.value}%</span>
                    <span className="text-zinc-500 text-xs ml-2">{fmtCurrency(p.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-violet-400" /> Country-wise Revenue</CardTitle>
            <CardDescription>Top revenue generating markets</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium">Country</th>
                  <th className="text-right py-3 px-4 font-medium">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium">Users</th>
                  <th className="text-right py-3 px-4 font-medium">MoM Growth</th>
                  <th className="text-left py-3 px-4 font-medium">Revenue Share</th>
                </tr>
              </thead>
              <tbody>
                {countryRevenueData.map((row) => {
                  const totalRev = countryRevenueData.reduce((a, b) => a + b.revenue, 0);
                  const pct = Math.round((row.revenue / totalRev) * 100);
                  return (
                    <tr key={row.country} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{row.code === 'IN' ? '🇮🇳' : row.code === 'US' ? '🇺🇸' : row.code === 'ID' ? '🇮🇩' : row.code === 'BR' ? '🇧🇷' : row.code === 'DE' ? '🇩🇪' : row.code === 'GB' ? '🇬🇧' : row.code === 'JP' ? '🇯🇵' : '🇫🇷'}</span>
                          <span className="text-zinc-200 font-medium">{row.country}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-200 font-semibold">{fmtCurrency(row.revenue)}</td>
                      <td className="py-3 px-4 text-right text-zinc-400">{(row.users / 1000).toFixed(0)}K</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-xs font-semibold ${row.growth > 10 ? 'text-emerald-400' : row.growth > 5 ? 'text-amber-400' : 'text-zinc-400'}`}>
                          +{row.growth}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-zinc-500 w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Revenue Forecast */}
      <Card className="border-violet-500/20 bg-violet-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-violet-300">
            <BrainCircuit className="w-5 h-5" />
            AI Revenue Forecast
          </CardTitle>
          <CardDescription>Predicted performance for the next 5 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {forecastItems.map((f) => (
              <div key={f.label} className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">{f.label}</div>
                <div className="text-2xl font-bold text-zinc-100 mb-3">{f.value}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${f.confidence}%` }} />
                  </div>
                  <span className="text-xs text-violet-400 font-medium">{f.confidence}%</span>
                </div>
                <div className="text-xs text-zinc-600 mt-1">confidence</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <p className="text-sm text-violet-200 leading-relaxed">
              <span className="font-semibold">AI Analysis:</span> Based on current growth trends (+12.4% MoM), ad fill rate recovery in APAC, and subscription expansion in India, revenue is projected to reach <strong>₹3.12Cr</strong> next month with a <strong>87% confidence</strong> score. Key risk: potential AdMob policy changes in Q3.
            </p>
            <Link href="/ai-insights" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200 transition-colors">
              View Full AI Report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
