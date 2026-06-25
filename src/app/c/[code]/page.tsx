'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingBag, Copy, CheckCircle2, Clock, AlertCircle, Tag, QrCode, Store, Sparkles, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

type Coupon = {
  code: string;
  displayCode: string;
  status: string;
  expiresAt: string | null;
  alreadyOwned: boolean;
  deal: { title: string; image: string | null; originalPrice: number; discountedPrice: number; discountPercentage: number } | null;
};

export default function CouponLandingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    fetch(`/api/storefront/coupon/${encodeURIComponent(code)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setCoupon(j))
      .catch(() => setCoupon(null))
      .finally(() => setLoading(false));
  }, [code]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const copy = () => {
    if (!coupon) return;
    navigator.clipboard.writeText(coupon.displayCode);
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

  if (!coupon) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-6 text-center">
        <ShoppingBag className="w-12 h-12 opacity-20" />
        <p className="font-semibold">This coupon could not be found.</p>
        <p className="text-sm text-muted-foreground max-w-xs">Double-check you opened the full link, or browse current deals on Offrion.</p>
        <Link href="/deals" className="text-sm font-bold text-primary inline-flex items-center gap-1">Browse deals <ArrowRight className="w-4 h-4" /></Link>
      </main>
    );
  }

  const redeemed = coupon.status === 'completed';
  const expired = !redeemed && !!coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now;
  const active = !redeemed && !expired;
  const savings = coupon.deal ? coupon.deal.originalPrice - coupon.deal.discountedPrice : 0;

  // Live countdown when active and < 24h out; otherwise a date.
  let expiryText: string | null = null;
  let expiryUrgent = false;
  if (coupon.expiresAt && active) {
    const ms = new Date(coupon.expiresAt).getTime() - now;
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    const s = Math.floor((ms % 60_000) / 1000);
    if (h >= 24) {
      expiryText = `Valid until ${new Date(coupon.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    } else if (h >= 1) {
      expiryText = `Expires in ${h}h ${m}m`;
      expiryUrgent = h < 6;
    } else {
      expiryText = `Expires in ${m}m ${s}s`;
      expiryUrgent = true;
    }
  }

  const statusChip = redeemed
    ? { label: 'Redeemed', cls: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle2 }
    : expired
    ? { label: 'Expired', cls: 'bg-red-500/10 text-red-500', icon: AlertCircle }
    : { label: 'Active', cls: 'bg-amber-500/10 text-amber-600', icon: Sparkles };

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary/40 to-background flex flex-col items-center px-5 py-10">
      <div className="w-full max-w-sm">
        {/* Brand + intro */}
        <div className="flex flex-col items-center text-center mb-7">
          <Logo size="md" />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">Your deal is ready</p>
          <h1 className="text-2xl font-black tracking-tighter mt-1">
            {savings > 0 ? <>You {redeemed ? 'got' : 'get'} <span className="text-primary">${savings} off</span></> : 'Your Offrion coupon'}
          </h1>
        </div>

        {/* Coupon ticket */}
        <div className="relative bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          {/* status chip */}
          <div className="absolute top-3 right-3 z-10">
            <span className={cn('inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full', statusChip.cls)}>
              <statusChip.icon className="w-3 h-3" /> {statusChip.label}
            </span>
          </div>

          {/* Deal image */}
          <div className="relative aspect-[16/9] bg-secondary">
            {coupon.deal?.image ? (
              <img src={coupon.deal.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20"><ShoppingBag className="w-12 h-12" /></div>
            )}
            {coupon.deal && coupon.deal.discountPercentage > 0 && (
              <span className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
                -{coupon.deal.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Deal info */}
          <div className="px-6 pt-5 pb-4">
            <h2 className="text-lg font-black tracking-tight leading-snug">{coupon.deal?.title || 'Your deal'}</h2>
            {coupon.deal && (
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-black">${coupon.deal.discountedPrice}</span>
                {coupon.deal.originalPrice > coupon.deal.discountedPrice && (
                  <span className="text-base text-muted-foreground line-through">${coupon.deal.originalPrice}</span>
                )}
                {savings > 0 && (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <Tag className="w-3.5 h-3.5" /> Save ${savings}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Perforated divider (classic coupon look) */}
          <div className="relative">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border border-border" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border border-border" />
            <div className="border-t-2 border-dashed border-border mx-5" />
          </div>

          {/* Code */}
          <div className="px-6 pt-5 pb-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Show this code at the merchant</p>
            <button
              onClick={copy}
              disabled={!active}
              className="w-full flex items-center justify-between bg-secondary/50 border border-border rounded-xl px-4 py-4 hover:border-foreground/30 transition-colors disabled:opacity-60"
            >
              <span className="text-xl font-black tracking-[0.15em] font-mono">{coupon.displayCode}</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </span>
            </button>

            {expiryText && (
              <p className={cn('flex items-center gap-1.5 text-xs mt-3', expiryUrgent ? 'text-red-500 font-semibold' : 'text-muted-foreground')}>
                <Clock className="w-3.5 h-3.5" /> {expiryText}
              </p>
            )}
            {redeemed && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-3"><CheckCircle2 className="w-3.5 h-3.5" /> This coupon has been redeemed.</p>
            )}
            {expired && (
              <p className="flex items-center gap-1.5 text-xs text-red-500 font-semibold mt-3"><AlertCircle className="w-3.5 h-3.5" /> This coupon has expired.</p>
            )}
          </div>
        </div>

        {/* How to use */}
        {active && (
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              { icon: Tag, label: 'Show code' },
              { icon: Store, label: 'At merchant' },
              { icon: QrCode, label: 'They scan it' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 text-center border border-border rounded-2xl py-3 bg-card">
                <s.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground">{i + 1}. {s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Save to account */}
        {active && (
          <Link
            href={`/account?link=${coupon.code}`}
            className="w-full mt-5 bg-primary text-primary-foreground font-black uppercase tracking-wider text-sm rounded-xl py-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {coupon.alreadyOwned ? 'View in my account' : 'Save to my account'} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
        <p className="text-[11px] text-muted-foreground text-center mt-4">
          Powered by <span className="font-bold text-foreground">Offrion</span> — track all your deals in one place.
        </p>
      </div>
    </main>
  );
}
