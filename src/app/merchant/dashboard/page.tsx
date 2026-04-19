'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Tag,
  AlertCircle, 
  Flame, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('@/components/partner/AnalyticsChart'), { 
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-secondary/20 animate-pulse rounded-md" />
});

export default function MerchantDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/merchant/analytics`, { credentials: 'include' })
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
      <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-md text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Dashboard Error</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-border bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-bold transition-all mt-4"
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
    { name: 'Net Revenue', value: formatCurrency(data.stats.netRevenue), icon: DollarSign, color: 'text-white', bg: 'bg-secondary' },
    { name: 'Commission Paid', value: formatCurrency(data.stats.totalCommission), icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
          <p className="text-sm text-muted-foreground italic">Welcome back to your business portal.</p>
        </div>
      </div>
      
      {/* Verification Action Banner */}
      {data.verificationStatus !== 'verified' && (
        <div className="vercel-section flex flex-col md:flex-row items-center justify-between gap-6 p-6">
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-md flex items-center justify-center border border-red-500/20">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Verification Required</h3>
              <p className="text-foreground/80 text-sm max-w-md mt-1">
                Complete your business verification to start publishing live deals and clearing commissions to your bank account.
              </p>
            </div>
          </div>
          <Link 
            href="/merchant/kyc" 
            className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all whitespace-nowrap"
          >
            Start Verification
          </Link>
        </div>
      )}

      {/* Expiry Alerts Section */}
      {data.topDeals.some((d: any) => d.dealInfo?.validUntil && new Date(d.dealInfo.validUntil).getTime() < Date.now() + 72 * 60 * 60 * 1000) && (
        <div className="p-6 bg-muted border border-border rounded-md flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-500/10 rounded-md flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Immediate Action Required</h4>
              <p className="text-xs text-muted-foreground">Some of your top-performing deals are expiring within 72 hours.</p>
            </div>
          </div>
          <Link href="/merchant/deals" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-all">
            Extend Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="vercel-section p-6 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-muted rounded-md border border-border">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
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
        <div className="lg:col-span-2 vercel-section p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
            <h3 className="text-sm font-semibold">Revenue Overview</h3>
          </div>
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            {data.dailyRevenue && data.dailyRevenue.length > 0 ? (
              <div className="w-full mt-4">
                <AnalyticsChart 
                  data={(() => {
                    const chartDataMap: Record<string, any> = {};
                    // Dashboard is always 7 days
                    for (let i = 6; i >= 0; i--) {
                      const d = new Date();
                      d.setDate(d.getDate() - i);
                      const dateStr = d.toISOString().split('T')[0];
                      chartDataMap[dateStr] = { name: dateStr, revenue: 0 };
                    }
                    (data.dailyRevenue || []).forEach((item: any) => {
                      if (chartDataMap[item.name]) chartDataMap[item.name].revenue = item.revenue;
                    });
                    return Object.values(chartDataMap).sort((a: any, b: any) => a.name.localeCompare(b.name));
                  })()} 
                  series={[{ key: 'revenue', name: 'Revenue', color: 'oklch(0.646 0.222 41.116)', gradient: true }]}
                  height={300}
                />
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
        <div className="vercel-section p-6">
          <h3 className="text-sm font-semibold mb-6 border-b border-border pb-4">Top Performing Deals</h3>
          <div className="space-y-6">
            {data.topDeals.map((item: any) => (
              <div key={item._id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden border border-border">
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
            <button className="w-full mt-8 py-2 rounded-md border border-border bg-muted text-sm hover:bg-secondary transition-all">
              View All Deals
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

