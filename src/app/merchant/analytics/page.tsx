'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  Filter,
  BarChart3,
  MousePointer2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('@/components/partner/AnalyticsChart'), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-secondary/20 animate-pulse rounded-2xl" />
});

function MerchantAnalyticsContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/merchant/analytics?period=${period}`, { credentials: 'include' })
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
  }, [period]);

  if (loading && !data) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-[32px] text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Analytics Error</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Retry</button>
      </div>
    </div>
  );

  const stats = [
    { name: 'Impressions', value: data?.stats?.impressions || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Clicks', value: data?.stats?.clicks || 0, icon: MousePointer2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Conversions', value: data?.stats?.conversions || 0, icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Net Revenue', value: formatCurrency(data?.stats?.netRevenue || 0), icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-8 pb-10 transition-all duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            Live business performance and conversion metrics.
          </p>
        </div>

        <div className="flex flex-col gap-3 items-end">
            <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl shadow-sm">
                {['7d', '30d', '90d'].map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={cn(
                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        period === p ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <stat.icon className="w-24 h-24" />
            </div>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-sm font-bold shadow-inner", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.name}</p>
            <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Trends */}
        <div className="lg:col-span-2 p-8 bg-card border border-border rounded-[40px] shadow-sm flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              Performance Trends
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Revenue</span>
               </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <AnalyticsChart 
                data={(() => {
                    const chartDataMap: Record<string, any> = {};
                    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
                    for (let i = days - 1; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        const dateStr = d.toISOString().split('T')[0];
                        chartDataMap[dateStr] = { name: dateStr, revenue: 0 };
                    }
                    (data?.dailyRevenue || []).forEach((item: any) => {
                        if (chartDataMap[item.name]) chartDataMap[item.name].revenue = item.revenue;
                    });
                    return Object.values(chartDataMap).sort((a: any, b: any) => a.name.localeCompare(b.name));
                })()} 
                series={[{ key: 'revenue', name: 'Revenue', color: 'oklch(0.646 0.222 41.116)', gradient: true }]}
                height={350}
            />
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="p-8 bg-card border border-border rounded-[40px] shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-10 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                Funnel Overview
            </h3>
            
            <div className="space-y-10 flex-1 flex flex-col justify-center">
                {[
                    { label: 'Impressions', value: data?.stats?.impressions || 0, color: 'bg-blue-500' },
                    { label: 'Clicks', value: data?.stats?.clicks || 0, color: 'bg-purple-500' },
                    { label: 'Conversions', value: data?.stats?.conversions || 0, color: 'bg-emerald-500' },
                ].map((item, i, arr) => (
                    <div key={item.label} className="relative">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                            <span className="text-lg font-black">{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-4 bg-secondary/50 rounded-full overflow-hidden p-0.5 border border-border/50">
                            <div 
                                className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-sm", item.color)}
                                style={{ width: arr[0].value > 0 ? `${(item.value / arr[0].value) * 100}%` : '0%' }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-premium-gradient text-white rounded-[32px] shadow-lg shadow-primary/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Conversion Efficiency</p>
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black">
                        {data?.stats?.clicks > 0 ? ((data.stats.conversions / data.stats.clicks) * 100).toFixed(1) : '0.0'}%
                    </span>
                    <span className="text-xs font-medium text-white/80">Click-to-Convert</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function MerchantAnalytics() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[60vh]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <MerchantAnalyticsContent />
    </Suspense>
  );
}
