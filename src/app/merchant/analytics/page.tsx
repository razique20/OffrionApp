'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  MousePointer2,
  Eye,
  Target,
  AlertCircle
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export default function MerchantAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetch('/api/merchant/analytics', { credentials: 'include' })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch analytics');
        return json;
      })
      .then(json => {
        setData(json);
      })
      .catch(err => {
        console.error('Analytics error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Crunching your numbers...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="p-10 bg-destructive/5 border border-destructive/10 rounded-[40px] text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-2">Analytics Offline</h3>
        <p className="text-muted-foreground mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-premium-gradient text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  if (!data || !data.stats) return null;

  const { stats } = data;
  const ctr = ((stats.clicks / stats.impressions) * 100 || 0).toFixed(1);
  const convRate = ((stats.conversions / stats.clicks) * 100 || 0).toFixed(1);

  const funnelData = [
    { name: 'Impressions', value: stats.impressions, fill: 'oklch(0.646 0.222 41.116)' },
    { name: 'Clicks', value: stats.clicks, fill: 'oklch(0.627 0.265 303.891)' },
    { name: 'Conversions', value: stats.conversions, fill: 'oklch(0.705 0.191 146.75)' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your deal engagement and ROI.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary p-1 rounded-xl">
            {['7d', '30d', '90d'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  timeRange === range ? "bg-background shadow-sm" : "hover:bg-background/50 text-muted-foreground"
                )}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="p-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Revenue" 
          value={formatCurrency(stats.totalSales)} 
          change="+14.2%" 
          isPositive={true}
          icon={DollarSign}
          color="text-primary"
          bg="bg-primary/10"
        />
        <StatCard 
          title="Impressions" 
          value={stats.impressions.toLocaleString()} 
          change="+5.1%" 
          isPositive={true}
          icon={Eye}
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <StatCard 
          title="Click Rate (CTR)" 
          value={`${ctr}%`} 
          change="-0.4%" 
          isPositive={false}
          icon={MousePointer2}
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
        <StatCard 
          title="Conv. Rate" 
          value={`${convRate}%`} 
          change="+2.8%" 
          isPositive={true}
          icon={Target}
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-8 bg-card border border-border rounded-[32px] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Revenue Growth</h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.646 0.222 41.116)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="oklch(0.646 0.222 41.116)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.922 0 0)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'oklch(0.556 0 0)', fontSize: 12 }} 
                  dy={10}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return d.toLocaleDateString('en-US', { weekday: 'short' });
                  }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'oklch(0.556 0 0)', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'oklch(1 0 0)', 
                    borderRadius: '16px', 
                    border: '1px solid oklch(0.922 0 0)',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="oklch(0.646 0.222 41.116)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="p-8 bg-card border border-border rounded-[32px] shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-8">Conversion Funnel</h3>
          <div className="flex-1 flex flex-col justify-center gap-8">
            {funnelData.map((item, i) => (
              <div key={item.name} className="relative">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.name}</span>
                  <span className="text-lg font-bold">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(item.value / funnelData[0].value) * 100}%`,
                      backgroundColor: item.fill 
                    }}
                  />
                </div>
                {i < funnelData.length - 1 && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground/50">
                    ▼ {((funnelData[i+1].value / item.value) * 100 || 0).toFixed(1)}% drop-off
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-secondary/50 rounded-2xl border border-border text-center">
             <p className="text-xs text-muted-foreground">Overall conversion efficiency</p>
             <p className="text-2xl font-black mt-1 text-primary">{((stats.conversions / stats.impressions) * 100 || 0).toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Top Deals Table */}
      <div className="p-8 bg-card border border-border rounded-[32px] shadow-sm overflow-hidden">
        <h3 className="text-xl font-bold mb-8">Deal Performance Ranking</h3>
        <div className="overflow-x-auto -mx-8 px-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <th className="pb-4">Deal Details</th>
                <th className="pb-4">Conversions</th>
                <th className="pb-4">Revenue</th>
                <th className="pb-4">ROI</th>
                <th className="pb-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.topDeals.map((item: any) => (
                <tr key={item._id} className="border-b border-border/50 group hover:bg-secondary/20 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden border border-border">
                        {item.dealInfo?.images?.[0] ? (
                          <img src={item.dealInfo.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-muted-foreground/30" /></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold truncate max-w-[200px]">{item.dealInfo?.title || 'Unknown Deal'}</h4>
                        <p className="text-xs text-muted-foreground">ID: {item._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className="font-bold">{item.conversions}</span>
                    <p className="text-[10px] text-muted-foreground">units sold</p>
                  </td>
                  <td className="py-5 font-bold">
                    {formatCurrency(item.conversions * (item.dealInfo?.discountedPrice || 0))}
                  </td>
                  <td className="py-5 text-primary font-bold">
                    +{(Math.random() * 20 + 5).toFixed(1)}x
                  </td>
                  <td className="py-5 text-right">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isPositive, icon: Icon, color, bg }: any) {
  return (
    <div className="p-6 bg-card border border-border rounded-[28px] shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", bg)}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
          isPositive ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"
        )}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-black tracking-tighter mt-1">{value}</h3>
      </div>
    </div>
  );
}
