"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  userGrowthData, countryUsersData, genderData, ageData,
  deviceData, trafficSourceData, topPhoneModels
} from "@/lib/mockData";
import { UserGrowthChart, DonutChart } from "@/components/ui/Charts";
import { Users, UserPlus, UserMinus, Globe, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

function fmtNum(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

const kpis = [
  { label: "Daily Active Users", value: "3.2M", sub: "+4.7% vs yesterday", icon: <Users className="w-4 h-4 text-violet-400" />, up: true },
  { label: "Monthly Active Users", value: "8.4M", sub: "+12.1% vs last month", icon: <Users className="w-4 h-4 text-violet-400" />, up: true },
  { label: "New Users (30d)", value: "680K", sub: "+8.3% vs last month", icon: <UserPlus className="w-4 h-4 text-violet-400" />, up: true },
  { label: "Churn Rate", value: "4.2%", sub: "-0.6% (improving)", icon: <UserMinus className="w-4 h-4 text-violet-400" />, up: true },
];

export default function UsersPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Users</h1>
          <p className="text-zinc-400 mt-1">Audience insights, demographics, devices and traffic sources.</p>
        </div>
        <select className="bg-[#141415] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
        </select>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="glass rounded-xl p-5 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{k.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{k.icon}</div>
            </div>
            <div className="text-3xl font-bold text-zinc-100">{k.value}</div>
            <div className={`text-xs font-medium ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* User Growth Chart */}
      <Card gradient>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New vs Returning users over time</CardDescription>
        </CardHeader>
        <CardContent>
          <UserGrowthChart data={userGrowthData} height={280} />
        </CardContent>
      </Card>

      {/* Demographics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gender */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Split</CardTitle>
            <CardDescription>User gender distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={genderData} height={180} innerRadius={50} />
            <div className="space-y-2 mt-4">
              {genderData.map((g) => (
                <div key={g.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
                    <span className="text-zinc-400">{g.name}</span>
                  </div>
                  <span className="text-zinc-200 font-semibold">{g.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age */}
        <Card>
          <CardHeader>
            <CardTitle>Age Groups</CardTitle>
            <CardDescription>Distribution by age bracket</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={ageData} height={180} innerRadius={50} />
            <div className="space-y-2 mt-4">
              {ageData.map((a) => (
                <div key={a.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
                    <span className="text-zinc-400">{a.name}</span>
                  </div>
                  <span className="text-zinc-200 font-semibold">{a.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device */}
        <Card>
          <CardHeader>
            <CardTitle>Device Type</CardTitle>
            <CardDescription>Platform device breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={deviceData} height={180} innerRadius={50} />
            <div className="space-y-2 mt-4">
              {deviceData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-zinc-400">{d.name}</span>
                  </div>
                  <span className="text-zinc-200 font-semibold">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country + Traffic Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-violet-400" /> Top Countries
            </CardTitle>
            <CardDescription>Users by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countryUsersData.map((c) => (
                <div key={c.country}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-zinc-300 font-medium">{c.country}</span>
                    <span className="text-zinc-400">{fmtNum(c.users)} <span className="text-zinc-600">({c.pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${c.pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>How users discover your apps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trafficSourceData.map((t) => (
                <div key={t.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.color }} />
                    <span className="text-zinc-300 font-medium">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-zinc-200">{fmtNum(t.users)}</div>
                      <div className="text-xs text-zinc-500">users</div>
                    </div>
                    <div className="w-16 text-right">
                      <div className="text-sm font-bold text-zinc-100">{t.value}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Phone Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-violet-400" /> Top Phone Models
          </CardTitle>
          <CardDescription>Most common devices used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium">#</th>
                  <th className="text-left py-3 px-4 font-medium">Device</th>
                  <th className="text-right py-3 px-4 font-medium">Users</th>
                  <th className="text-left py-3 px-4 font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {topPhoneModels.map((m, i) => (
                  <tr key={m.model} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-zinc-600 font-mono">{i + 1}</td>
                    <td className="py-3 px-4 text-zinc-200 font-medium">{m.model}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{fmtNum(m.users)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(m.pct / topPhoneModels[0].pct) * 100}%` }} />
                        </div>
                        <span className="text-xs text-zinc-500">{m.pct}%</span>
                      </div>
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
