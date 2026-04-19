'use client';

import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export function LastCallDeals() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/deals/fomo')
      .then(res => res.json())
      .then(data => setDeals(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || deals.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider mb-4">
              <Flame className="w-3 h-3 fill-red-500" />
              Dynamic FOMO Engine
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Last Call: <span className="text-gradient">Expiring Soon</span></h2>
          </div>
          <Link href="/deals" className="text-sm font-bold text-foreground flex items-center gap-2 hover:translate-x-1 transition-transform">
            View All Live Rewards <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.slice(0, 4).map((deal) => (
            <div key={deal.id} className="group bg-card border border-border rounded-md overflow-hidden hover:border-primary/30 transition-all hover:shadow-none hover:shadow-primary/5">
              <div className="aspect-[4/3] relative overflow-hidden bg-secondary">
                {deal.images?.[0] ? (
                  <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Flame className="w-12 h-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-none">
                  {deal.urgencyReason}
                </div>
              </div>
              <div className="p-6">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{deal.merchantName}</p>
                <h4 className="font-bold text-foreground mb-4 line-clamp-1">{deal.title}</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">Starting from</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(deal.amount)}</p>
                  </div>
                  <Link href={`/deals/${deal.id}`} className="p-3 bg-secondary rounded-md group-hover:bg-primary group-hover:text-foreground transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
