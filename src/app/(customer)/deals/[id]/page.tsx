'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingBag, ArrowLeft, CheckCircle2, Copy, Clock, AlertCircle, MapPin, Tag, Sparkles, Calendar, Users, QrCode, Store, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSetMobileChrome } from '@/components/customer/MobileChromeContext';

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
  dealType?: string;
  eventType?: string;
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

  // Register the mobile shell (title, back, sticky claim/copy bar) for the layout.
  useSetMobileChrome({
    title: deal?.title || 'Deal',
    back: true,
    bottomBar: !deal ? null : claim ? (
      <button
        onClick={copyCode}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 font-black uppercase tracking-wider text-sm rounded-xl py-3.5"
      >
        {copied ? <><CheckCircle2 className="w-4 h-4" /> Code Copied</> : <><Copy className="w-4 h-4" /> Copy Code {claim.redeemCode}</>}
      </button>
    ) : (
      <button
        onClick={handleClaim}
        disabled={claiming}
        className="w-full bg-primary text-primary-foreground font-black uppercase tracking-wider text-sm rounded-xl py-3.5 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {claiming ? <><Loader2 className="w-4 h-4 animate-spin" /> Claiming...</> : `Claim — $${deal.discountedPrice}`}
      </button>
    ),
  }, [deal, claim, copied, claiming]);

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

  const validUntil = deal.validUntil ? new Date(deal.validUntil) : null;
  const usageLeft = deal.usageLimit && deal.usageLimit > 0
    ? Math.max(0, deal.usageLimit - (deal.currentUsage || 0))
    : null;
  const location = [deal.landmark, deal.emirate].filter(Boolean).join(', ');

  const chips = [
    deal.categoryId?.name && { icon: Tag, label: deal.categoryId.name },
    deal.dealType && { icon: Sparkles, label: deal.dealType.replace(/-/g, ' ') },
    validUntil && { icon: Calendar, label: `Until ${validUntil.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` },
    usageLeft !== null && { icon: Users, label: `${usageLeft} left` },
  ].filter(Boolean) as { icon: React.ElementType; label: string }[];

  // Shared claim panel state used by both desktop card and mobile bottom bar.
  const claimedPanel = claim && (
    <div className="border-2 border-emerald-500/40 bg-emerald-500/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-wider text-sm mb-3">
        <CheckCircle2 className="w-5 h-5" /> Deal Claimed
      </div>
      <p className="text-sm text-muted-foreground mb-3">Show this code at the merchant:</p>
      <button
        onClick={copyCode}
        className="w-full flex items-center justify-between bg-background border border-border rounded-xl px-5 py-4 mb-3 hover:border-foreground/30 transition-colors"
      >
        <span className="text-2xl font-black tracking-[0.25em] font-mono">{claim?.redeemCode}</span>
        <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
        </span>
      </button>
      <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-500/10 rounded-lg p-3">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Valid only once the merchant scans it. An un-redeemed code means the discount hasn&apos;t been applied — make sure they complete it.</span>
      </div>
    </div>
  );

  return (
    <>
    {/* Desktop / web — existing layout with marketing chrome */}
    <main className="hidden md:block min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <Link href="/deals" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All deals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">
          {/* ── Left: hero + content ── */}
          <div className="space-y-8">
            {/* Hero image */}
            <div className="relative aspect-[16/10] bg-secondary rounded-3xl overflow-hidden">
              {deal.images?.[0] ? (
                <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <ShoppingBag className="w-16 h-16" />
                </div>
              )}
              {deal.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
                  -{deal.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Merchant + title + description */}
            <div>
              <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
                <Store className="w-3.5 h-3.5" />
                {deal.merchantId?.name || deal.categoryId?.name || 'Deal'}
              </p>
              <h1 className="text-4xl font-black tracking-tighter mb-4">{deal.title}</h1>
              <p className="text-muted-foreground leading-relaxed">{deal.description}</p>
            </div>

            {/* Detail chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {chips.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-secondary/60 border border-border rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize">
                    <c.icon className="w-3.5 h-3.5 text-muted-foreground" /> {c.label}
                  </span>
                ))}
              </div>
            )}

            {/* Location block */}
            {location && (
              <div className="border border-border rounded-2xl p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-0.5">Location</p>
                  <p className="font-bold tracking-tight">{location}</p>
                </div>
              </div>
            )}

            {/* How to redeem */}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">How it works</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: BadgeCheck, title: 'Claim the deal', desc: 'Get your one-time redeem code instantly.' },
                  { icon: QrCode, title: 'Show the code', desc: 'Present it at the merchant when you visit.' },
                  { icon: CheckCircle2, title: 'They scan it', desc: 'The discount applies once the merchant records it.' },
                ].map((step, i) => (
                  <div key={i} className="border border-border rounded-2xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-3">
                      <step.icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold tracking-tight mb-1">{i + 1}. {step.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: sticky claim card ── */}
          <div className="lg:sticky lg:top-24">
            <div className="border border-border rounded-3xl p-6 shadow-sm bg-card">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-5xl font-black tracking-tighter">${deal.discountedPrice}</span>
                {deal.originalPrice > deal.discountedPrice && (
                  <span className="text-xl text-muted-foreground line-through">${deal.originalPrice}</span>
                )}
              </div>
              {deal.discountPercentage > 0 && (
                <p className="text-sm font-bold text-emerald-600 mb-5">
                  You save ${deal.originalPrice - deal.discountedPrice} ({deal.discountPercentage}% off)
                </p>
              )}

              {claim ? (
                <div className="border-2 border-emerald-500/40 bg-emerald-500/5 rounded-2xl p-5 mt-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-wider text-sm mb-4">
                    <CheckCircle2 className="w-5 h-5" /> Deal Claimed
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Show this code at the merchant:</p>
                  <button
                    onClick={copyCode}
                    className="w-full flex items-center justify-between bg-background border border-border rounded-xl px-5 py-4 mb-4 hover:border-foreground/30 transition-colors"
                  >
                    <span className="text-2xl font-black tracking-[0.25em] font-mono">{claim.redeemCode}</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                    </span>
                  </button>
                  <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-500/10 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Valid only once the merchant scans it. An un-redeemed code means the discount hasn&apos;t been applied — make sure they complete it.</span>
                  </div>
                  {claim.expiresAt && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                      <Clock className="w-3.5 h-3.5" /> Expires {new Date(claim.expiresAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <>
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
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    {customerName ? (
                      <>Claiming as <span className="font-bold text-foreground">{customerName}</span></>
                    ) : (
                      <>Claiming as guest · <Link href="/account" className="font-bold text-primary underline">Log in</Link> to save it</>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>

    {/* Mobile — content only; layout provides shell + sticky bottom claim bar */}
    <div className="md:hidden px-4 pt-5 pb-40">
      {/* Hero */}
      <div className="relative aspect-[16/10] bg-secondary rounded-2xl overflow-hidden mb-5">
        {deal.images?.[0] ? (
          <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20"><ShoppingBag className="w-12 h-12" /></div>
        )}
        {deal.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
            -{deal.discountPercentage}% OFF
          </span>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
        <Store className="w-3.5 h-3.5" /> {deal.merchantId?.name || deal.categoryId?.name || 'Deal'}
      </p>
      <h1 className="text-2xl font-black tracking-tight mb-2">{deal.title}</h1>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-black tracking-tighter">${deal.discountedPrice}</span>
        {deal.originalPrice > deal.discountedPrice && (
          <span className="text-base text-muted-foreground line-through">${deal.originalPrice}</span>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{deal.description}</p>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {chips.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 bg-secondary/60 border border-border rounded-full px-3 py-1 text-xs font-semibold capitalize">
              <c.icon className="w-3.5 h-3.5 text-muted-foreground" /> {c.label}
            </span>
          ))}
        </div>
      )}

      {location && (
        <div className="border border-border rounded-2xl p-4 flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0"><MapPin className="w-4 h-4" /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">Location</p>
            <p className="font-bold tracking-tight text-sm">{location}</p>
          </div>
        </div>
      )}

      {/* Claimed code panel (shown above the sticky bar once claimed) */}
      {claim && <div className="mb-5">{claimedPanel}</div>}

      {/* How it works */}
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">How it works</p>
      <div className="space-y-2.5">
        {[
          { icon: BadgeCheck, title: 'Claim the deal', desc: 'Get your one-time redeem code instantly.' },
          { icon: QrCode, title: 'Show the code', desc: 'Present it at the merchant when you visit.' },
          { icon: CheckCircle2, title: 'They scan it', desc: 'The discount applies once the merchant records it.' },
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3 border border-border rounded-2xl p-3.5">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"><step.icon className="w-4 h-4" /></div>
            <div>
              <p className="text-sm font-bold tracking-tight">{i + 1}. {step.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {!claim && !customerName && (
        <p className="text-xs text-muted-foreground text-center mt-5">
          Claiming as guest · <Link href="/account" className="font-bold text-primary underline">Log in</Link> to save it
        </p>
      )}
      {error && <p className="flex items-center gap-2 text-sm text-red-500 mt-4"><AlertCircle className="w-4 h-4" /> {error}</p>}
    </div>
    </>
  );
}
