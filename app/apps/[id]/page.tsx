import { revenueSources, platformRevenue, retentionData, adPerformanceData } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { SourcesBarChart } from "@/components/ui/Charts";
import { Smartphone, DollarSign, Users, Activity, Download, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function AppProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let app: any = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/apps/${id}`, { cache: 'no-store' });
    if (res.ok) app = await res.json();
  } catch {
    const { appsData } = await import('@/lib/mockData');
    app = appsData.find((a: any) => a.id === id) || null;
  }

  if (!app) notFound();

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Back Link */}
      <Link href="/apps" className="text-sm text-zinc-400 hover:text-zinc-200 flex items-center gap-2 mb-2 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Apps
      </Link>

      {/* App Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center font-bold text-4xl text-violet-300 shadow-xl">
            {app.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">{app.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-zinc-400">
              <span className="bg-white/5 px-2 py-1 rounded-md border border-white/10 text-zinc-300">{app.category}</span>
              <span>{app.platform}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  app.status === 'Active' ? 'bg-emerald-500' : app.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                )}></span>
                {app.status}
              </span>
              <span>•</span>
              <span>Last updated: {app.lastUpdated}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#141415] hover:bg-white/5 border border-white/10 text-zinc-200 px-4 py-2 rounded-lg font-medium transition-colors">
            Edit App
          </button>
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            View Reports
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Revenue (30d)" 
          value={fmtCurrency(app.revenue)} 
          trend={8.2} 
          icon={<DollarSign className="w-4 h-4 text-violet-400" />} 
          bgIcon={<DollarSign className="w-16 h-16 text-violet-500" />}
        />
        <MetricCard 
          title="Active Users (30d)" 
          value={fmtNumber(app.activeUsers)} 
          trend={-1.4} 
          icon={<Users className="w-4 h-4 text-violet-400" />} 
          bgIcon={<Users className="w-16 h-16 text-violet-500" />}
          delay={0.1} 
        />
        <MetricCard 
          title="Downloads" 
          value={fmtNumber(app.downloads)} 
          icon={<Download className="w-4 h-4 text-violet-400" />} 
          bgIcon={<Download className="w-16 h-16 text-violet-500" />}
          delay={0.2} 
        />
        <MetricCard 
          title="Avg Rating" 
          value={`${app.rating}★`} 
          icon={<Star className="w-4 h-4 text-violet-400" />} 
          bgIcon={<Star className="w-16 h-16 text-violet-500" />}
          delay={0.3} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Breakdown */}
        <Card gradient>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>Breakdown by monetization type</CardDescription>
          </CardHeader>
          <CardContent>
            <SourcesBarChart data={revenueSources} height={250} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-[#0a0a0b]/50 rounded-lg p-3 border border-white/5 text-center">
                <div className="text-xs text-zinc-500 mb-1">Ad Revenue</div>
                <div className="font-semibold text-zinc-200">{fmtCurrency(app.adRevenue)}</div>
              </div>
              <div className="bg-[#0a0a0b]/50 rounded-lg p-3 border border-white/5 text-center">
                <div className="text-xs text-zinc-500 mb-1">Subscriptions</div>
                <div className="font-semibold text-zinc-200">{fmtCurrency(app.subscriptions)}</div>
              </div>
              <div className="bg-[#0a0a0b]/50 rounded-lg p-3 border border-white/5 text-center">
                <div className="text-xs text-zinc-500 mb-1">IAP</div>
                <div className="font-semibold text-zinc-200">{fmtCurrency(app.revenue - app.adRevenue - app.subscriptions)}</div>
              </div>
              <div className="bg-[#0a0a0b]/50 rounded-lg p-3 border border-white/5 text-center">
                <div className="text-xs text-zinc-500 mb-1">ARPU</div>
                <div className="font-semibold text-zinc-200">₹{(app.revenue / app.activeUsers).toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Performance Details */}
        <Card>
          <CardHeader>
            <CardTitle>Ad Performance Details</CardTitle>
            <CardDescription>eCPM and Fill Rate by Ad Unit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(adPerformanceData).map(([key, data]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0b]/50 border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200 capitalize">{key} Ads</span>
                    <span className="text-xs text-zinc-500">eCPM: ₹{data.ecpm.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-zinc-200">{fmtCurrency(data.revenue)}</div>
                    <div className="text-xs text-zinc-500">{data.fillRate}% Fill</div>
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
