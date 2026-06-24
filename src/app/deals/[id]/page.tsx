'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingBag, ArrowLeft, CheckCircle2, Copy, Clock, AlertCircle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  usageLimit?: number;
  currentUsage?: number;
  validUntil?: string;
  merchantId?: { name: string };
  categoryId?: { name: string };
};

type ClaimResult = { redeemCode: string; expiresAt?: string } | null;

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);

  const [claiming, setClaiming] = useState(false);
  const [claim, setClaim] = useState<ClaimResult>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try {
      const [dealRes, meRes] = await Promise.all([
        fetch(`/api/storefront/deals/${id}`),
        fetch('/api/customer/auth/me'),
      ]);
      if (!dealRes.ok) { setNotFound(true); return; }
      const dealJson = await dealRes.json();
      setDeal(dealJson.deal);
      if (meRes.ok) {
        const meJson = await meRes.json();
        setCustomerName(meJson.customer?.name || null);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleClaim = async () => {
    setClaiming(true);
    setError('');
    try {
      const res = await fetch('/api/storefront/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: id }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Could not claim this deal');
        return;
      }
      setClaim({ redeemCode: json.redeemCode, expiresAt: json.expiresAt });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  const copyCode = () => {
    if (!claim) return;
    navigator.clipboard.writeText(claim.redeemCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (notFound || !deal) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <ShoppingBag className="w-12 h-12 opacity-20" />
        <p className="font-semibold">This deal is no longer available.</p>
        <Link href="/deals" className="text-sm font-bold text-primary">Back to deals</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link href="/deals" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All deals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-secondary rounded-3xl overflow-hidden">
            {deal.images?.[0] ? (
              <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <ShoppingBag className="w-16 h-16" />
              </div>
            )}
            {deal.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-black px-3 py-1.5 rounded-full">
                -{deal.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Details + claim */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {deal.merchantId?.name || deal.categoryId?.name || 'Deal'}
            </p>
            <h1 className="text-4xl font-black tracking-tighter mb-4">{deal.title}</h1>
            <p className="text-muted-foreground leading-relaxed mb-6">{deal.description}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black">${deal.discountedPrice}</span>
              {deal.originalPrice > deal.discountedPrice && (
                <span className="text-xl text-muted-foreground line-through">${deal.originalPrice}</span>
              )}
            </div>

            {(deal.emirate || deal.landmark) && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <MapPin className="w-4 h-4" /> {[deal.landmark, deal.emirate].filter(Boolean).join(', ')}
              </p>
            )}

            {/* Claim panel */}
            {claim ? (
              <div className="border-2 border-emerald-500/40 bg-emerald-500/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-wider text-sm mb-4">
                  <CheckCircle2 className="w-5 h-5" /> Deal Claimed
                </div>
                <p className="text-sm text-muted-foreground mb-3">Show this code at the merchant to redeem:</p>
                <button
                  onClick={copyCode}
                  className="w-full flex items-center justify-between bg-background border border-border rounded-xl px-5 py-4 mb-4 hover:border-foreground/30 transition-colors"
                >
                  <span className="text-3xl font-black tracking-[0.3em] font-mono">{claim.redeemCode}</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                  </span>
                </button>
                <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-500/10 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Only valid once the merchant scans it on their terminal. An un-redeemed code means the discount has not been applied — make sure they complete it.</span>
                </div>
                {claim.expiresAt && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                    <Clock className="w-3.5 h-3.5" /> Expires {new Date(claim.expiresAt).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <div>
                {customerName ? (
                  <p className="text-xs text-muted-foreground mb-3">Claiming as <span className="font-bold text-foreground">{customerName}</span></p>
                ) : (
                  <p className="text-xs text-muted-foreground mb-3">
                    Claiming as guest.{' '}
                    <Link href="/account" className="font-bold text-primary underline">Log in</Link>{' '}
                    to save it to your account.
                  </p>
                )}
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className={cn(
                    'w-full bg-primary text-primary-foreground font-black uppercase tracking-wider text-sm rounded-xl py-4 transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2'
                  )}
                >
                  {claiming ? <><Loader2 className="w-4 h-4 animate-spin" /> Claiming...</> : 'Claim Deal — Get Code'}
                </button>
                {error && (
                  <p className="flex items-center gap-2 text-sm text-red-500 mt-3">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
