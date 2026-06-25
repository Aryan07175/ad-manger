"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const themeColors = {
  primary: "#8b5cf6",
  primaryGradient: "url(#colorPrimary)",
  secondary: "#3b82f6",
  secondaryGradient: "url(#colorSecondary)",
  tertiary: "#10b981",
  tertiaryGradient: "url(#colorTertiary)",
  grid: "rgba(255,255,255,0.05)",
  text: "#a1a1aa",
};

const tooltipStyle = {
  contentStyle: { backgroundColor: '#141415', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', color: '#ededed' },
  itemStyle: { color: '#ededed' },
  labelStyle: { color: '#a1a1aa', fontWeight: 600 },
};

interface ChartProps {
  data: any[];
  height?: number;
}

// ─── Revenue Area Chart ───────────────────────────────────────────────────────
export function RevenueAreaChart({ data, height = 300 }: ChartProps) {
  const fmt = (v: number) => `₹${(v / 1000000).toFixed(1)}M`;
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColors.secondary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={themeColors.secondary} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTertiary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColors.tertiary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={themeColors.tertiary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} width={70} />
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
          <Tooltip {...tooltipStyle} formatter={(v: any) => fmt(v)} />
          <Legend wrapperStyle={{ paddingTop: '16px', color: themeColors.text, fontSize: 12 }} />
          <Area type="monotone" dataKey="ads" name="Ads" stroke={themeColors.primary} fillOpacity={1} fill={themeColors.primaryGradient} strokeWidth={2} />
          <Area type="monotone" dataKey="subscriptions" name="Subscriptions" stroke={themeColors.secondary} fillOpacity={1} fill={themeColors.secondaryGradient} strokeWidth={2} />
          <Area type="monotone" dataKey="iap" name="IAP" stroke={themeColors.tertiary} fillOpacity={1} fill={themeColors.tertiaryGradient} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Sources Bar Chart ───────────────────────────────────────────────────────
export function SourcesBarChart({ data, height = 300 }: ChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} {...tooltipStyle} />
          <Bar dataKey="value" fill={themeColors.primary} radius={[4, 4, 0, 0]}>
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color || themeColors.primary} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Generic Line Chart ──────────────────────────────────────────────────────
interface MultiLineChartProps {
  data: any[];
  lines: { key: string; color: string; name?: string }[];
  height?: number;
  yFormatter?: (v: number) => string;
}
export function MultiLineChart({ data, lines, height = 300, yFormatter = (v) => `${v}` }: MultiLineChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="name" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={yFormatter} width={60} />
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
          <Tooltip {...tooltipStyle} formatter={(v: any) => yFormatter(v)} />
          <Legend wrapperStyle={{ paddingTop: '16px', color: themeColors.text, fontSize: 12 }} />
          {lines.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.name || l.key} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── User Growth Stacked Bar Chart ────────────────────────────────────────────
export function UserGrowthChart({ data, height = 300 }: ChartProps) {
  const fmt = (v: number) => `${(v / 1000).toFixed(0)}K`;
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="name" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} width={55} />
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} {...tooltipStyle} formatter={(v: any) => fmt(v)} />
          <Legend wrapperStyle={{ paddingTop: '16px', color: themeColors.text, fontSize: 12 }} />
          <Bar dataKey="newUsers" name="New Users" stackId="a" fill={themeColors.primary} radius={[0, 0, 0, 0]} />
          <Bar dataKey="returningUsers" name="Returning" stackId="a" fill={themeColors.secondary} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Donut / Pie Chart ────────────────────────────────────────────────────────
interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
  innerRadius?: number;
}
export function DonutChart({ data, height = 240, innerRadius = 60 }: DonutChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={innerRadius + 35} paddingAngle={3} dataKey="value" stroke="none">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} formatter={(v: any) => `${v}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Retention Area Chart ─────────────────────────────────────────────────────
export function RetentionChart({ data, height = 220 }: ChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.35} />
              <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
          <Tooltip {...tooltipStyle} formatter={(v: any) => `${v}%`} />
          <Area type="monotone" dataKey="rate" name="Retention" stroke={themeColors.primary} fillOpacity={1} fill="url(#retGrad)" strokeWidth={2} dot={{ r: 4, fill: themeColors.primary, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── eCPM Multi-Line Chart ────────────────────────────────────────────────────
export function EcpmTrendChart({ data, height = 260 }: ChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="name" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} width={60} />
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
          <Tooltip {...tooltipStyle} formatter={(v: any) => `₹${v}`} />
          <Legend wrapperStyle={{ paddingTop: '16px', color: themeColors.text, fontSize: 12 }} />
          <Line type="monotone" dataKey="banner" name="Banner" stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="interstitial" name="Interstitial" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="rewarded" name="Rewarded" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Rating Trend Chart ───────────────────────────────────────────────────────
export function RatingTrendChart({ data, height = 220 }: ChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} domain={[3.5, 5]} tickFormatter={(v) => `${v}★`} width={45} />
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
          <Tooltip {...tooltipStyle} formatter={(v: any) => `${v}★`} />
          <Line type="monotone" dataKey="rating" name="Rating" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Session Duration Bar ─────────────────────────────────────────────────────
export function SessionDurationChart({ data, height = 200 }: ChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} layout="vertical">
          <XAxis type="number" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} width={55} />
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} horizontal={false} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} {...tooltipStyle} formatter={(v: any) => `${v}%`} />
          <Bar dataKey="users" name="Users %" fill={themeColors.primary} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
