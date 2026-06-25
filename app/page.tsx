import { overviewStats, revenueChartData, appsData, alertsData, aiInsightsData } from "@/lib/mockData";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { RevenueAreaChart } from "@/components/ui/Charts";
import { Smartphone, DollarSign, Users, Activity, AlertTriangle, ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
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

import { LiveClock } from "@/components/ui/LiveClock";

export default async function Dashboard() {
  let lastSnapshot = "Never";
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/metrics/snapshot?limit=1`, { cache: 'no-store' });
    const data = await res.json();
    if (data.newest) {
      lastSnapshot = new Date(data.newest).toLocaleString();
    }
  } catch {}

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-400 mt-1 flex items-center gap-2">
            Real-time metrics and intelligence across your portfolio.
            <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded">
              Last Snapshot: {lastSnapshot}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-r border-white/10 pr-4">
            <LiveClock />
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Healthy
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Apps" 
          value={overviewStats.totalApps} 
          icon={<Smartphone className="w-4 h-4 text-violet-400" />} 
          bgIcon={<Smartphone className="w-16 h-16 text-violet-500" />}
          delay={0.1}
        />
        <MetricCard 
          title="Total Revenue" 
          value={fmtCurrency(overviewStats.totalRevenue)} 
          trend={overviewStats.revenueGrowth}
          trendLabel="vs last month"
          icon={<DollarSign className="w-4 h-4 text-violet-400" />} 
          bgIcon={<DollarSign className="w-16 h-16 text-violet-500" />}
          delay={0.2}
        />
        <MetricCard 
          title="Daily Active Users" 
          value={fmtNumber(overviewStats.dau)} 
          trend={-2.4}
          trendLabel="vs yesterday"
          icon={<Users className="w-4 h-4 text-violet-400" />} 
          bgIcon={<Users className="w-16 h-16 text-violet-500" />}
          delay={0.3}
        />
        <MetricCard 
          title="Avg Ad Fill Rate" 
          value={`${overviewStats.adFillRate}%`} 
          trend={1.2}
          trendLabel="vs last month"
          icon={<Activity className="w-4 h-4 text-violet-400" />} 
          bgIcon={<Activity className="w-16 h-16 text-violet-500" />}
          delay={0.4}
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <Card gradient>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Ad vs Subscription revenue over time</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <RevenueAreaChart data={revenueChartData} height={320} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Top Performing Apps</CardTitle>
                <CardDescription>By revenue and active users</CardDescription>
              </div>
              <Link href="/apps" className="text-sm text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {appsData.slice(0, 5).map((app, i) => (
                  <Link 
                    key={app.id} 
                    href={`/apps/${app.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center font-bold text-lg text-zinc-300 shadow-inner">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-200 group-hover:text-violet-400 transition-colors">{app.name}</div>
                        <div className="text-xs text-zinc-500">{app.category} • {fmtNumber(app.activeUsers)} MAU</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-zinc-200">{fmtCurrency(app.revenue)}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1 justify-end">
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          app.healthScore > 90 ? "bg-emerald-500" : app.healthScore > 70 ? "bg-amber-500" : "bg-rose-500"
                        )}></span>
                        {app.healthScore} Health
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          {/* AI Insights Summary */}
          <Card className="relative overflow-hidden border-violet-500/20 bg-violet-500/5">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-24 h-24 text-violet-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-violet-400">
                <BrainCircuit className="w-5 h-5" />
                Pulse AI Insights
              </CardTitle>
              <CardDescription>Automated anomaly detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsightsData.slice(0, 2).map((insight) => (
                  <div key={insight.id} className="p-4 rounded-lg bg-[#141415] border border-white/5 shadow-sm">
                    <h4 className="font-medium text-zinc-200 text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{insight.reason}</p>
                    <Link href={insight.actionUrl} className="text-xs font-medium bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 px-3 py-1.5 rounded-md transition-colors inline-block w-fit">
                      {insight.actionText}
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-zinc-400" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertsData.slice(0, 4).map((alert) => (
                  <div key={alert.id} className="flex gap-3 items-start">
                    <div className={cn(
                      "mt-0.5 w-2 h-2 rounded-full shrink-0",
                      alert.type === 'critical' ? 'bg-rose-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    )}></div>
                    <div>
                      <div className="text-sm font-medium text-zinc-300 leading-snug">{alert.message}</div>
                      <div className="text-xs text-zinc-500 mt-1">{alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
