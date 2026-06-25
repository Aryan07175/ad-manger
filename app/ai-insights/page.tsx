import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { aiInsightsData } from "@/lib/mockData";
import { BrainCircuit, Lightbulb, TrendingDown, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AiInsightsPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-violet-500" />
            AI Insights & Recommendations
          </h1>
          <p className="text-zinc-400 mt-1">Automated root cause analysis and actionable recommendations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {aiInsightsData.map((insight) => (
          <Card key={insight.id} gradient className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Lightbulb className="w-32 h-32 text-violet-500" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                  {insight.title}
                </CardTitle>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20">
                  {insight.impact} Impact
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Root Cause Analysis</div>
                  <p className="text-zinc-300 leading-relaxed bg-[#0a0a0b]/50 p-4 rounded-lg border border-white/5">
                    {insight.reason}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">AI Recommendation</div>
                  <div className="flex flex-col h-full justify-between bg-violet-500/10 p-4 rounded-lg border border-violet-500/20">
                    <p className="text-violet-200 leading-relaxed">
                      {insight.recommendation}
                    </p>
                    <Link href={insight.actionUrl} className="mt-4 w-fit bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      {insight.actionText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
