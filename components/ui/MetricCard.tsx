"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  bgIcon?: React.ReactNode;
  delay?: number;
}

export function MetricCard({ title, value, trend, trendLabel, icon, bgIcon, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-xl p-5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {bgIcon}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">{title}</h3>
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="text-3xl font-bold text-zinc-100 mb-2">{value}</div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className={cn(
            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5",
            trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {trend >= 0 ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="text-zinc-500">{trendLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}
