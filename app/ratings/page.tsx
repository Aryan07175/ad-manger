"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ratingsOverview, ratingTrendData, topComplaints, recentReviews, aiReviewSummary } from "@/lib/mockData";
import { RatingTrendChart } from "@/components/ui/Charts";
import { Star, ThumbsUp, ThumbsDown, BrainCircuit, TrendingUp, TrendingDown, Minus, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function fmtNum(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString();
}

const kpis = [
  { label: "Average Rating", value: `${ratingsOverview.average}★`, sub: "+0.1 this month", up: true },
  { label: "Total Reviews", value: fmtNum(ratingsOverview.total), sub: "+12.4% this month", up: true },
  { label: "Positive Reviews", value: `${ratingsOverview.positive}%`, sub: "+2.1% this month", up: true },
  { label: "Response Rate", value: `${ratingsOverview.responseRate}%`, sub: "-3% this month", up: false },
];

const sentimentConfig: Record<string, { label: string; icon: any; className: string }> = {
  positive: { label: "Positive", icon: ThumbsUp, className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  negative: { label: "Negative", icon: ThumbsDown, className: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  neutral: { label: "Neutral", icon: Minus, className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

export default function RatingsPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Ratings & Reviews</h1>
          <p className="text-zinc-400 mt-1">Monitor user feedback, sentiment trends and review insights.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-[#141415] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option>All Apps</option>
            <option>Gaming App</option>
            <option>Music Streaming</option>
          </select>
          <select className="bg-[#141415] border border-white/5 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
          </select>
        </div>
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
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{k.label}</span>
            <div className="text-3xl font-bold text-amber-400">{k.value}</div>
            <div className={`text-xs font-medium flex items-center gap-1 ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {k.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rating Distribution + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of all {fmtNum(ratingsOverview.total)} reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Big Star Display */}
            <div className="text-center mb-6">
              <div className="text-6xl font-black text-amber-400">{ratingsOverview.average}</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={cn("w-5 h-5", s <= Math.round(ratingsOverview.average) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700')} />
                ))}
              </div>
              <div className="text-sm text-zinc-500 mt-1">{fmtNum(ratingsOverview.total)} reviews</div>
            </div>
            <div className="space-y-2">
              {ratingsOverview.distribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-400 w-4 text-right">{d.stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-amber-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                  <span className="text-zinc-500 w-8 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card gradient className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rating Trend</CardTitle>
            <CardDescription>Average rating and review volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <RatingTrendChart data={ratingTrendData} height={250} />
          </CardContent>
        </Card>
      </div>

      {/* AI Summary + Top Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Summary */}
        <Card className="border-violet-500/20 bg-violet-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-300">
              <BrainCircuit className="w-5 h-5" /> AI Review Summary
            </CardTitle>
            <CardDescription>Auto-generated from 284K reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Top Issues</div>
              <div className="space-y-2">
                {aiReviewSummary.topIssues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-rose-300 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2">
                    <ThumbsDown className="w-4 h-4 mt-0.5 shrink-0" />
                    {issue}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">AI Suggestions</div>
              <div className="space-y-2">
                {aiReviewSummary.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-emerald-300 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
                    <ThumbsUp className="w-4 h-4 mt-0.5 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>Top Complaints</CardTitle>
            <CardDescription>Most frequent user issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topComplaints.map((c, i) => (
                <div key={c.complaint} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 font-mono text-xs w-4">{i + 1}</span>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">{c.complaint}</div>
                      <div className="text-xs text-zinc-500">{fmtNum(c.count)} mentions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className={cn("text-xs", c.trend === 'up' ? 'text-rose-400' : c.trend === 'down' ? 'text-emerald-400' : 'text-zinc-500')}>
                      {c.trend === 'up' ? '↑' : c.trend === 'down' ? '↓' : '→'} {c.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-400" /> Recent Reviews
          </CardTitle>
          <CardDescription>Latest user feedback across all apps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentReviews.map((r) => {
              const cfg = sentimentConfig[r.sentiment];
              const SentIcon = cfg.icon;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-zinc-200">{r.user}</span>
                      <span className="text-xs text-zinc-500 ml-2">{r.app} · {r.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={cn("w-3 h-3", s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700')} />
                        ))}
                      </div>
                      <span className={cn("flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium", cfg.className)}>
                        <SentIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
