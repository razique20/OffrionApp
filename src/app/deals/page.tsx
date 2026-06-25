'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Loader2, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { CustomerMobileChrome } from '@/components/CustomerMobileChrome';

type Deal = {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  emirate?: string;
  landmark?: string;
  tags?: string[];
  merchantId?: { name: string };
  categoryId?: { name: string };
};

export default function DealsBrowsePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '24' });
      if (query.trim()) params.set('search', query.trim());
      const res = await fetch(`/api/storefront/deals?${params.toString()}`);
      const json = await res.json();
      setDeals(json.deals || []);
    } catch {
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  const searchAndGrid = (
    <>
        <form
          onSubmit={(e) => { e.preventDefault(); setQuery(search); }}
          className="relative mb-8 md:mb-12 max-w-xl"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals by name, tag, or keyword..."
            className="w-full bg-secondary/40 border border-border rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
          />
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-32 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-32 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No deals found</p>
            {query && <p className="text-sm mt-1">Try a different search.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Link
                key={deal._id}
                href={`/deals/${deal._id}`}
                className="group border border-border rounded-2xl overflow-hidden bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="relative aspect-[16/10] bg-secondary overflow-hidden">
                  {deal.images?.[0] ? (
                    <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                  )}
                  {deal.discountPercentage > 0 && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-black px-2.5 py-1 rounded-full">
                      -{deal.discountPercentage}%
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    {deal.merchantId?.name || deal.categoryId?.name || 'Deal'}
                  </p>
                  <h3 className="font-bold tracking-tight mb-2 line-clamp-1">{deal.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{deal.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black">${deal.discountedPrice}</span>
                      {deal.originalPrice > deal.discountedPrice && (
                        <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  {deal.tags && deal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {deal.tags.slice(0, 3).map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                          <Tag className="w-2.5 h-2.5" /> {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
    </>
  );

  return (
    <>
      {/* Desktop / web — existing layout with marketing chrome */}
      <main className="hidden md:block min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-3">Offrion Deals</p>
            <h1 className="text-5xl font-black tracking-tighter mb-4">Browse Deals</h1>
            <p className="text-lg text-muted-foreground">Claim a deal, show the code at the merchant, and save.</p>
          </div>
          {searchAndGrid}
        </div>
      </main>

      {/* Mobile — native app style */}
      <CustomerMobileChrome title="Deals">
        {searchAndGrid}
      </CustomerMobileChrome>
    </>
  );
}
