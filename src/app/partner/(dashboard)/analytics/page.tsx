'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('@/components/partner/AnalyticsChart'), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-secondary/20 animate-pulse rounded-md" />
});

function AnalyticsContent() {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/partner/analytics?period=${period}`)
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
    <div className="p-8 bg-destructive/10 text-destructive rounded-md text-center">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 font-bold underline">Retry</button>
    </div>
  );

  const stats = [
    { name: 'Impressions', value: data.summary.impressions, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Clicks', value: data.summary.clicks, icon: MousePointer2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Conversions', value: data.summary.conversions, icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Total Earned', value: formatCurrency(data.summary.totalEarned), icon: DollarSign, color: 'text-white', bg: 'bg-secondary' },
  ];

  // Prepare Funnel Data
  const funnelData = [
    { name: 'Impressions', value: data.summary.impressions, fill: 'oklch(0.646 0.222 41.116 / 0.4)' },
    { name: 'Clicks', value: data.summary.clicks, fill: 'oklch(0.646 0.222 41.116 / 0.7)' },
    { name: 'Conversions', value: data.summary.conversions, fill: 'oklch(0.646 0.222 41.116)' },
  ];

  // Prepare Time Series Data with Gap Filling
  const chartDataMap: Record<string, any> = {};
  
  // 1. Initialize all dates in the period with zeros
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    chartDataMap[dateStr] = { name: dateStr, impression: 0, click: 0, conversion: 0 };
  }

  // 2. Overlay actual data
  data.timeSeries.forEach((item: any) => {
    const date = item._id.date;
    if (!chartDataMap[date]) chartDataMap[date] = { name: date, impression: 0, click: 0, conversion: 0 };
    chartDataMap[date][item._id.type] = item.count;
  });

  const chartData = Object.values(chartDataMap).sort((a: any, b: any) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Deep dive into your referral metrics and earnings.</p>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-md shadow-none">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  period === p ? "bg-primary text-white-foreground shadow-none" : "hover:bg-secondary text-muted-foreground"
                )}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-card border border-border rounded-md shadow-none hover:shadow-none transition-all">
            <div className={cn("w-10 h-10 rounded-md flex items-center justify-center mb-4 text-sm font-bold", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 p-8 bg-card border border-border rounded-md shadow-none">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-foreground" />
              Growth Trends
            </h3>
          </div>
          <AnalyticsChart 
            data={chartData} 
            series={[
              { key: 'impression', name: 'Impressions', color: 'oklch(0.646 0.222 41.116)', gradient: true },
              { key: 'conversion', name: 'Conversions', color: 'oklch(0.55 0.15 150)', gradient: false }
            ]}
          />
        </div>

        {/* Conversion Funnel */}
        <div className="p-8 bg-card border border-border rounded-md shadow-none flex flex-col">
          <h3 className="text-xl font-bold mb-10 flex items-center gap-2">
            <Filter className="w-5 h-5 text-foreground" />
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
                      width: funnelData[0].value > 0 ? `${(item.value / funnelData[0].value) * 100}%` : '0%',
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
          <div className="mt-10 p-4 bg-muted rounded-md border border-primary/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-1">Overall Conversion Rate</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground">{data.summary.conversionRate}</span>
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
