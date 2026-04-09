'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Tag
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { AlertCircle, Flame, Clock, ArrowRight } from 'lucide-react';
import { FomoTicker } from '@/components/FomoTicker';

export default function MerchantDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.error('Analytics fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-[50vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground animate-pulse">Loading analytics...</p>
    </div>
  </div>;

  if (error) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-[32px] text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Dashboard Error</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-premium-gradient text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  if (!data || !data.stats) return null;

  const stats = [
    { name: 'Total Sales', value: formatCurrency(data.stats.totalSales), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Total Conversions', value: data.stats.conversions, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Net Revenue', value: formatCurrency(data.stats.netRevenue), icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Commission Paid', value: formatCurrency(data.stats.totalCommission), icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      <FomoTicker />
      
      {/* Expiry Alerts Section */}
      {data.topDeals.some((d: any) => d.dealInfo?.validUntil && new Date(d.dealInfo.validUntil).getTime() < Date.now() + 72 * 60 * 60 * 1000) && (
        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Immediate Action Required</h4>
              <p className="text-xs text-muted-foreground">Some of your top-performing deals are expiring within 72 hours.</p>
            </div>
          </div>
          <Link href="/merchant/deals" className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-all">
            Extend Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <h3 className="text-2xl font-bold tracking-tight mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 p-6 bg-card border border-border rounded-2xl min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Revenue Overview</h3>
          </div>
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            {data.dailyRevenue && data.dailyRevenue.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyRevenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'oklch(0.556 0 0)', fontSize: 12 }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'oklch(1 0 0)', 
                        borderRadius: '12px', 
                        border: '1px solid oklch(0.922 0 0)',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="oklch(0.646 0.222 41.116)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
                <p className="text-sm text-muted-foreground max-w-[200px]">Revenue data will appear here once sales transactions occur.</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Deals */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <h3 className="text-lg font-bold mb-6">Top Performing Deals</h3>
          <div className="space-y-6">
            {data.topDeals.map((item: any) => (
              <div key={item._id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex-shrink-0 flex items-center justify-center overflow-hidden border border-border">
                  {item.dealInfo.images?.[0] ? (
                    <img src={item.dealInfo.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Tag className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{item.dealInfo?.title || 'Unknown Deal'}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded uppercase tracking-tighter">ID: {item._id}</p>
                    <p className="text-xs text-muted-foreground">{item.conversions} conversions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(item.conversions * (item.dealInfo?.discountedPrice || 0))}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/merchant/deals">
            <button className="w-full mt-8 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-all">
              View All Deals
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

