import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Search, Plus, Filter } from "lucide-react";
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

async function getApps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/apps`, { cache: 'no-store' });
    const data = await res.json();
    return data.apps || [];
  } catch {
    // fallback to mockData if API is unreachable
    const { appsData } = await import('@/lib/mockData');
    return appsData;
  }
}

export default async function AppsPage() {
  const appsData = await getApps();
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Applications</h1>
          <p className="text-zinc-400 mt-1">Manage and monitor all your connected apps.</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add App
        </button>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b border-white/5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search apps..." 
                className="w-full bg-[#0d0d0e] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              />
            </div>
            <button className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-zinc-500 uppercase bg-[#0a0a0b]/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold">App Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Platform</th>
                  <th className="px-6 py-4 font-semibold text-right">Active Users</th>
                  <th className="px-6 py-4 font-semibold text-right">Revenue</th>
                  <th className="px-6 py-4 font-semibold text-right">Rating</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appsData.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/apps/${app.id}`} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center font-bold text-violet-300">
                          {app.name.charAt(0)}
                        </div>
                        <div className="font-medium text-zinc-200 group-hover:text-violet-400 transition-colors">{app.name}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{app.category}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-zinc-300 border border-white/10">
                        {app.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-300">{fmtNumber(app.activeUsers)}</td>
                    <td className="px-6 py-4 text-right text-zinc-300 font-medium">{fmtCurrency(app.revenue)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-amber-400">★</span>
                        <span className="text-zinc-300 font-medium">{app.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "badge",
                        app.status === 'Active' ? 'badge-active' : 
                        app.status === 'Warning' ? 'badge-warning' : 'badge-critical'
                      )}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">{app.lastUpdated}</td>
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
