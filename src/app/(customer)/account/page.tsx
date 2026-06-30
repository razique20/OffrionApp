'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, LogOut, Ticket, CheckCircle2, Clock, XCircle, Plus, Copy, ArrowLeft, Tag, Coins, Sparkles, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notifyCustomerSessionChange } from '@/hooks/useCustomer';
import { useSetMobileChrome } from '@/components/customer/MobileChromeContext';
import QrCodeModal from '@/components/customer/QrCodeModal';

type Customer = { id: string; name: string; email: string };
type Claim = {
  id: string;
  status: string;
  redeemCode: string;
  redeemedAt: string | null;
  expiresAt: string | null;
  channel: string;
  tokensAwarded: number;
  createdAt: string;
  deal: { id: string; title: string; image: string | null; originalPrice: number; discountedPrice: number; discountPercentage: number } | null;
};

export default function AccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  // The claim whose QR is currently shown (null = modal closed).
  const [qrClaim, setQrClaim] = useState<Claim | null>(null);
  // Ticks every second so the expiry countdown on pending claims stays live.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 1500);
  };

  // Time-left label: countdown when < 24h, otherwise a short date.
  const expiryLabel = (expiresAt: string): { text: string; urgent: boolean } => {
    const ms = new Date(expiresAt).getTime() - now;
    if (ms <= 0) return { text: 'Expired', urgent: true };
    const h = Math.floor(ms / 3_600_000);
    const mIn = Math.floor((ms % 3_600_000) / 60_000);
    const s = Math.floor((ms % 60_000) / 1000);
    if (h >= 24) {
      return { text: `Expires ${new Date(expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`, urgent: false };
    }
    if (h >= 1) return { text: `Expires in ${h}h ${mIn}m`, urgent: h < 6 };
    return { text: `Expires in ${mIn}m ${s}s`, urgent: true };
  };

  // Link a coupon code (e.g. one received from a partner app)
  const [linkCode, setLinkCode] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const loadClaims = useCallback(async () => {
    const claimsRes = await fetch('/api/customer/claims');
    if (claimsRes.ok) {
      const json = await claimsRes.json();
      setClaims(json.claims || []);
      setTokens(json.tokens || 0);
    }
  }, []);

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch('/api/customer/auth/me');
      if (res.ok) {
        const json = await res.json();
        setCustomer(json.customer);
        await loadClaims();
      } else {
        setCustomer(null);
      }
    } finally {
      setLoading(false);
    }
  }, [loadClaims]);

  const linkCouponCode = useCallback(async (code: string) => {
    if (!code.trim()) return;
    setLinking(true);
    setLinkMsg(null);
    try {
      const res = await fetch('/api/customer/claims/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLinkMsg({ text: typeof json.error === 'string' ? json.error : 'Could not link that code.', ok: false });
        return;
      }
      setLinkMsg({ text: json.message || 'Coupon linked.', ok: true });
      setLinkCode('');
      await loadClaims();
    } catch {
      setLinkMsg({ text: 'Network error. Please try again.', ok: false });
    } finally {
      setLinking(false);
    }
  }, [loadClaims]);

  const handleLinkCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    linkCouponCode(linkCode);
  };

  useEffect(() => { loadSession(); }, [loadSession]);

  // Deep link from a partner app: /account?link=CODE. Once the customer is
  // logged in, auto-link the coupon; if logged out, prefill the box so it's
  // ready (and auto-links right after they log in). Runs once per code.
  const [autoLinked, setAutoLinked] = useState(false);
  useEffect(() => {
    if (autoLinked) return;
    const code = new URLSearchParams(window.location.search).get('link');
    if (!code) return;
    if (customer) {
      setAutoLinked(true);
      linkCouponCode(code);
    } else if (!loading) {
      setLinkCode(code.toUpperCase());
    }
  }, [customer, loading, autoLinked, linkCouponCode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const endpoint = mode === 'login' ? '/api/customer/auth/login' : '/api/customer/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Something went wrong');
        return;
      }
      await loadSession();
      notifyCustomerSessionChange();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    await fetch('/api/customer/auth/logout', { method: 'POST' });
    setCustomer(null);
    setClaims([]);
    setTokens(0);
    notifyCustomerSessionChange();
  };

  // Keep the app shell (tabs) visible while loading and when logged in, so the
  // shell doesn't flash away on navigation to /account. Only the settled
  // logged-out auth screen hides the tabs (it has its own back-to-home bar).
  const loggedOut = !loading && !customer;
  useSetMobileChrome(
    { title: 'My Account', showShell: !loggedOut },
    [loggedOut]
  );

  if (loading) {
    return (
      <>
        {/* Desktop spinner */}
        <main className="hidden md:flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </main>
        {/* Mobile spinner — content only, shell stays mounted from the layout */}
        <div className="md:hidden flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  // Logged out — show auth form
  if (!customer) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        {/* Mobile-only top bar so the customer can leave the auth screen back to the landing page */}
        <header className="md:hidden sticky top-0 z-40 h-14 flex items-center border-b border-border bg-background/90 backdrop-blur-md px-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-bold" aria-label="Back to home">
            <ArrowLeft className="w-5 h-5" /> Home
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-3">Offrion</p>
            <h1 className="text-3xl font-black tracking-tighter">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
            <p className="text-sm text-muted-foreground mt-2">Save your claimed deals and codes in one place.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            )}
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <input
              required
              type="password"
              placeholder="Password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            {error && (
              <p className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground font-black uppercase tracking-wider text-sm rounded-xl py-3.5 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Log in' : 'Sign up'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="font-bold text-primary"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        </div>
      </main>
    );
  }

  // Logged in — show account + claim history.
  // Shared body (link-coupon + claims), reused by the desktop layout and the
  // mobile app chrome below.
  // Single claim card — shared by the mobile stack and the desktop grid.
  const renderClaim = (c: Claim) => {
    const redeemed = c.status === 'completed';
    const expired = !redeemed && !!c.expiresAt && new Date(c.expiresAt).getTime() < now;
    return (
      <div key={c.id} className="flex items-center gap-4 border border-border rounded-2xl p-4 bg-card">
        <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
          {c.deal?.image ? (
            <img src={c.deal.image} alt="" className="w-full h-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold tracking-tight truncate">{c.deal?.title || 'Deal'}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">
              Code <span className="font-mono font-bold tracking-widest text-foreground">{c.redeemCode}</span>
            </span>
            {!redeemed && !expired && (
              <>
                <button
                  onClick={() => copyCode(c.redeemCode)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy code"
                >
                  {copiedCode === c.redeemCode
                    ? <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Copied</>
                    : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
                <button
                  onClick={() => setQrClaim(c)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                  title="Show QR code"
                >
                  <QrCode className="w-3 h-3" /> QR
                </button>
              </>
            )}
          </div>
          {!redeemed && c.expiresAt && (() => {
            const e = expiryLabel(c.expiresAt);
            return (
              <p className={cn('flex items-center gap-1 text-[11px] mt-1', e.urgent ? 'text-red-500 font-semibold' : 'text-muted-foreground')}>
                <Clock className="w-3 h-3" /> {e.text}
              </p>
            );
          })()}
          {c.deal && c.deal.originalPrice > c.deal.discountedPrice && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
              <Tag className="w-3 h-3" />
              {redeemed ? 'You saved' : "You'll save"} ${c.deal.originalPrice - c.deal.discountedPrice}
              {c.deal.discountPercentage > 0 && <span className="text-emerald-600/70 font-semibold"> ({c.deal.discountPercentage}% off)</span>}
            </p>
          )}
          {redeemed && c.tokensAwarded > 0 && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-[#F97316] mt-1">
              <Coins className="w-3 h-3" /> +{c.tokensAwarded} tokens earned
            </p>
          )}
          {!redeemed && !expired && (
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
              <Coins className="w-3 h-3" /> Redeem in store to earn tokens
            </p>
          )}
        </div>
        <div className={cn(
          'flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shrink-0',
          redeemed ? 'bg-emerald-500/10 text-emerald-600'
            : expired ? 'bg-red-500/10 text-red-500'
            : 'bg-amber-500/10 text-amber-600'
        )}>
          {redeemed ? <><CheckCircle2 className="w-3.5 h-3.5" /> Redeemed</>
            : expired ? <><XCircle className="w-3.5 h-3.5" /> Expired</>
            : <><Clock className="w-3.5 h-3.5" /> Pending</>}
        </div>
      </div>
    );
  };

  const emptyClaims = (
    <div className="text-center py-20 border border-dashed border-border rounded-2xl text-muted-foreground">
      <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="font-semibold">No claims yet</p>
      <Link href="/deals" className="text-sm font-bold text-primary mt-2 inline-block">Browse deals</Link>
    </div>
  );

  // Token balance card — `compact` trims it for the desktop sidebar.
  const tokenCard = (compact = false) => (
    <div className="relative overflow-hidden border border-border rounded-2xl p-5 bg-card">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F97316] opacity-[0.08] blur-[60px]" />
      <div className={cn('relative', compact ? '' : 'flex items-center justify-between gap-4')}>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Coins className="w-3.5 h-3.5 text-[#F97316]" />
            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground">Offrion Tokens</p>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground rounded-full px-1.5 py-0.5">Beta</span>
          </div>
          <p className={cn('font-black tracking-tighter tabular-nums', compact ? 'text-4xl' : 'text-3xl')}>{tokens.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Earned when you redeem a deal in store.
          </p>
        </div>
        {!compact && (
          <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6 text-background" />
          </div>
        )}
      </div>
    </div>
  );

  // Link-a-coupon card.
  const linkCard = (
    <div className="border border-border rounded-2xl p-5 bg-card">
      <div className="flex items-center gap-2 mb-1.5">
        <Plus className="w-4 h-4" />
        <h2 className="text-sm font-black uppercase tracking-wider">Link a coupon</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Got a code from a partner app? Add it here to track it in your account. Your discount is unaffected.
      </p>
      <form onSubmit={handleLinkCoupon} className="flex gap-2">
        <input
          value={linkCode}
          onChange={(e) => { setLinkCode(e.target.value.toUpperCase()); setLinkMsg(null); }}
          placeholder="Enter code (e.g. OFFRION-BL6XHT)"
          maxLength={40}
          className="flex-1 min-w-0 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
        <button
          type="submit"
          disabled={linking || !linkCode.trim()}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2 shrink-0"
        >
          {linking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Link'}
        </button>
      </form>
      {linkMsg && (
        <p className={cn('flex items-center gap-2 text-xs mt-3', linkMsg.ok ? 'text-emerald-600' : 'text-red-500')}>
          {linkMsg.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />} {linkMsg.text}
        </p>
      )}
    </div>
  );

  // Mobile body — single-column stack (unchanged layout).
  const accountBody = (
    <>
        <div className="mb-6">{tokenCard()}</div>
        <div className="mb-10">{linkCard}</div>

        <div className="flex items-center gap-2 mb-6">
          <Ticket className="w-5 h-5" />
          <h2 className="text-lg font-black tracking-tight">My Claims</h2>
        </div>

        {claims.length === 0 ? emptyClaims : (
          <div className="space-y-3">{claims.map(renderClaim)}</div>
        )}
    </>
  );

  return (
    <>
      {qrClaim && (
        <QrCodeModal
          code={qrClaim.redeemCode}
          title={qrClaim.deal?.title}
          onClose={() => setQrClaim(null)}
        />
      )}

      {/* Desktop / web — two-column dashboard: account sidebar + claims */}
      <main className="hidden md:block min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-28 pb-16">
          <div className="flex items-start justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center text-xl font-black uppercase shrink-0">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">My Account</p>
                <h1 className="text-3xl font-black tracking-tighter leading-none">{customer.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{customer.email}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
            {/* Left: account widgets (sticky on tall viewports) */}
            <aside className="space-y-5 lg:sticky lg:top-28">
              {tokenCard(true)}
              {linkCard}
            </aside>

            {/* Right: claims */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  <h2 className="text-lg font-black tracking-tight">My Claims</h2>
                </div>
                {claims.length > 0 && (
                  <span className="text-xs font-bold text-muted-foreground">{claims.length} total</span>
                )}
              </div>
              {claims.length === 0 ? emptyClaims : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">{claims.map(renderClaim)}</div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Mobile — content only; layout provides the persistent shell */}
      <div className="md:hidden px-4 pt-5 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight truncate">{customer.name}</h2>
            <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground shrink-0">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
        {accountBody}
      </div>
    </>
  );
}
