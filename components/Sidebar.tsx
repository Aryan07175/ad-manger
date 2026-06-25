"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Smartphone, 
  BarChart3, 
  DollarSign, 
  Users, 
  Megaphone, 
  Star, 
  Bell, 
  BrainCircuit, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Apps", href: "/apps", icon: Smartphone },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Revenue", href: "/revenue", icon: DollarSign },
  { name: "Users", href: "/users", icon: Users },
  { name: "Ads", href: "/ads", icon: Megaphone },
  { name: "Ratings & Reviews", href: "/ratings", icon: Star },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "AI Insights", href: "/ai-insights", icon: BrainCircuit },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-[#0a0a0b]/80 backdrop-blur-xl flex flex-col sticky top-0 shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          Pulse AI
        </h1>
      </div>
      
      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 mt-2 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-violet-500/10 text-violet-400" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-violet-400" : "text-zinc-500")} />
              {item.name}
              {item.name === "Alerts" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 mt-auto">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-zinc-900 border-2 border-transparent"></div>
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-200">Admin User</div>
              <div className="text-xs text-zinc-500">Pro Plan</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
