'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingBag, Copy, CheckCircle2, Clock, AlertCircle, Tag } from 'lucide-react';
import { Logo } from '@/components/Logo';

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

  useEffect(() => {
    fetch(`/api/storefront/coupon/${encodeURIComponent(code)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setCoupon(j))
      .catch(() => setCoupon(null))
      .finally(() => setLoading(false));
  }, [code]);

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
        <Link href="/deals" className="text-sm font-bold text-primary">Browse deals</Link>
      </main>
    );
  }

  const redeemed = coupon.status === 'completed';
  const expired = !redeemed && coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  const savings = coupon.deal ? coupon.deal.originalPrice - coupon.deal.discountedPrice : 0;

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-5 py-8">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="border border-border rounded-3xl overflow-hidden bg-card shadow-sm">
          {/* Deal image */}
          <div className="relative aspect-[16/10] bg-secondary">
            {coupon.deal?.image ? (
              <img src={coupon.deal.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20"><ShoppingBag className="w-12 h-12" /></div>
            )}
            {coupon.deal && coupon.deal.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-black px-2.5 py-1 rounded-full">
                -{coupon.deal.discountPercentage}% OFF
              </span>
            )}
          </div>

          <div className="p-6">
            <h1 className="text-xl font-black tracking-tight mb-1">{coupon.deal?.title || 'Your deal'}</h1>
            {coupon.deal && (
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-black">${coupon.deal.discountedPrice}</span>
                {coupon.deal.originalPrice > coupon.deal.discountedPrice && (
                  <span className="text-base text-muted-foreground line-through">${coupon.deal.originalPrice}</span>
                )}
              </div>
            )}
            {savings > 0 && (
              <p className="flex items-center gap-1 text-sm font-bold text-emerald-600 mb-5">
                <Tag className="w-4 h-4" /> {redeemed ? 'You saved' : "You'll save"} ${savings}
              </p>
            )}

            {/* Code */}
            <p className="text-xs text-muted-foreground mb-2">Your coupon code — show this at the merchant:</p>
            <button
              onClick={copy}
              disabled={redeemed || !!expired}
              className="w-full flex items-center justify-between bg-background border border-border rounded-xl px-4 py-3.5 mb-3 hover:border-foreground/30 transition-colors disabled:opacity-60"
            >
              <span className="text-lg font-black tracking-[0.15em] font-mono">{coupon.displayCode}</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </span>
            </button>

            {redeemed ? (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-2"><CheckCircle2 className="w-3.5 h-3.5" /> Already redeemed</p>
            ) : expired ? (
              <p className="flex items-center gap-1.5 text-xs text-red-500 font-semibold mb-2"><AlertCircle className="w-3.5 h-3.5" /> This coupon has expired</p>
            ) : coupon.expiresAt ? (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2"><Clock className="w-3.5 h-3.5" /> Expires {new Date(coupon.expiresAt).toLocaleString()}</p>
            ) : null}

            {/* Save to account */}
            {!redeemed && !expired && (
              <Link
                href={`/account?link=${coupon.code}`}
                className="w-full mt-3 bg-primary text-primary-foreground font-black uppercase tracking-wider text-sm rounded-xl py-3.5 flex items-center justify-center gap-2"
              >
                Save to my Offrion account
              </Link>
            )}
            <p className="text-[11px] text-muted-foreground text-center mt-4">
              Track all your deals in one place with a free Offrion account.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
