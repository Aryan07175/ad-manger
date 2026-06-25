"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertTriangle, Bell, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alerts')
      .then(r => r.json())
      .then(d => setAlerts(d.alerts || []))
      .catch(async () => {
        const { alertsData } = await import('@/lib/mockData');
        setAlerts(alertsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDismiss = async (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    try {
      await fetch('/api/alerts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    } catch {}
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">System Alerts</h1>
          <p className="text-zinc-400 mt-1">AI-detected anomalies and critical system warnings.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live from local server
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-violet-400" />
            Active Alerts ({loading ? '…' : alerts.length})
          </CardTitle>
          <CardDescription>Items requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {alerts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-center py-8 text-zinc-500"
                >
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  No active alerts. All systems operational.
                </motion.div>
              ) : (
                alerts.map((alert) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 1, height: "auto", marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-[#0a0a0b]/50 border border-white/5 hover:bg-white/5 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-2 rounded-full mt-1",
                        alert.type === 'critical' ? 'bg-rose-500/10 text-rose-400' : 
                        alert.type === 'warning' ? 'bg-amber-500/10 text-amber-400' : 
                        'bg-blue-500/10 text-blue-400'
                      )}>
                        {alert.type === 'critical' ? <AlertTriangle className="w-5 h-5" /> : 
                         alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                         <CheckCircle2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-200">{alert.message}</div>
                        <div className="text-sm text-zinc-500 mt-1">Detected {alert.time} • Metric: {alert.metric}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleDismiss(alert.id)}
                        className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                      >
                        Dismiss
                      </button>
                      <Link 
                        href="/ai-insights"
                        className="px-3 py-1.5 text-sm font-medium text-violet-100 bg-violet-600 hover:bg-violet-700 rounded-md transition-colors inline-block text-center"
                      >
                        Investigate
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
