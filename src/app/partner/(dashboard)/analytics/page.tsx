'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  ShoppingBag,
  DollarSign,
  Calendar,
  Filter,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const envParam = searchParams.get('env') === 'sandbox' ? 'sandbox' : 'production';
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/partner/analytics?period=${period}&environment=${envParam}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch analytics');
        return json;
      })
      .then(json => {
        setData(json);
      })
      .catch(err => {
        console.error('Analytics fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [period, envParam]);

  if (loading && !data) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-destructive/10 text-destructive rounded-2xl text-center">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 font-bold underline">Retry</button>
    </div>
  );

  const stats = [
    { name: 'Impressions', value: data.summary.impressions, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Clicks', value: data.summary.clicks, icon: MousePointer2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Conversions', value: data.summary.conversions, icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Total Earned', value: formatCurrency(data.summary.totalEarned), icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  // Prepare Funnel Data
  const funnelData = [
    { name: 'Impressions', value: data.summary.impressions, fill: 'oklch(0.646 0.222 41.116 / 0.4)' },
    { name: 'Clicks', value: data.summary.clicks, fill: 'oklch(0.646 0.222 41.116 / 0.7)' },
    { name: 'Conversions', value: data.summary.conversions, fill: 'oklch(0.646 0.222 41.116)' },
  ];

  // Prepare Time Series Data (Group by date)
  const chartDataMap: Record<string, any> = {};
  data.timeSeries.forEach((item: any) => {
    const date = item._id.date;
    if (!chartDataMap[date]) chartDataMap[date] = { name: date, impression: 0, click: 0, conversion: 0 };
    chartDataMap[date][item._id.type] = item.count;
  });
  const chartData = Object.values(chartDataMap).sort((a: any, b: any) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {envParam === 'sandbox' ? 'Sandbox Analytics' : 'Performance Analytics'}
          </h1>
          <p className="text-muted-foreground">
            {envParam === 'sandbox' 
              ? 'Monitor your integration tests and sandbox API usage.' 
              : 'Deep dive into your referral metrics and earnings.'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl shadow-sm">
          {['7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                period === p ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary text-muted-foreground"
              )}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-sm font-bold", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 p-8 bg-card border border-border rounded-[32px] shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Growth Trends
            </h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.646 0.222 41.116)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="oklch(0.646 0.222 41.116)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.922 0 0)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'oklch(0.556 0 0)', fontSize: 11 }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'oklch(0.556 0 0)', fontSize: 11 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '16px', 
                    border: '1px solid oklch(0.922 0 0)',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="impression" 
                  stroke="oklch(0.646 0.222 41.116)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorImp)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="conversion" 
                  stroke="oklch(0.55 0.15 150)" 
                  strokeWidth={3}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="p-8 bg-card border border-border rounded-[32px] shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-10 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Conversion Funnel
          </h3>
          <div className="flex-1 flex flex-col justify-center gap-8">
            {funnelData.map((item, i) => (
              <div key={item.name} className="relative">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                    style={{ 
                      width: `${(item.value / funnelData[0].value) * 100}%`,
                      opacity: 1 - (i * 0.25)
                    }}
                  />
                </div>
                {i < funnelData.length - 1 && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground/40 bg-background px-2">
                    {((funnelData[i+1].value / item.value) * 100 || 0).toFixed(1)}% drop
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Overall Conversion Rate</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary">{data.summary.conversionRate}</span>
              <span className="text-xs text-muted-foreground font-medium">of all clicks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnerAnalytics() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[60vh]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
