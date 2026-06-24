'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, LogOut, Ticket, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notifyCustomerSessionChange } from '@/hooks/useCustomer';

type Customer = { id: string; name: string; email: string };
type Claim = {
  id: string;
  status: string;
  redeemCode: string;
  redeemedAt: string | null;
  expiresAt: string | null;
  channel: string;
  createdAt: string;
  deal: { id: string; title: string; image: string | null; discountedPrice: number; discountPercentage: number } | null;
};

export default function AccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch('/api/customer/auth/me');
      if (res.ok) {
        const json = await res.json();
        setCustomer(json.customer);
        const claimsRes = await fetch('/api/customer/claims');
        if (claimsRes.ok) setClaims((await claimsRes.json()).claims || []);
      } else {
        setCustomer(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSession(); }, [loadSession]);

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
    notifyCustomerSessionChange();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  // Logged out — show auth form
  if (!customer) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6">
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
          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link href="/deals" className="underline">Browse deals as guest</Link>
          </p>
        </div>
      </main>
    );
  }

  // Logged in — show account + claim history
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">My Account</p>
            <h1 className="text-4xl font-black tracking-tighter">{customer.name}</h1>
            <p className="text-muted-foreground mt-1">{customer.email}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Ticket className="w-5 h-5" />
          <h2 className="text-lg font-black tracking-tight">My Claims</h2>
        </div>

        {claims.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl text-muted-foreground">
            <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No claims yet</p>
            <Link href="/deals" className="text-sm font-bold text-primary mt-2 inline-block">Browse deals</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((c) => {
              const redeemed = c.status === 'completed';
              const expired = !redeemed && c.expiresAt && new Date(c.expiresAt) < new Date();
              return (
                <div key={c.id} className="flex items-center gap-4 border border-border rounded-2xl p-4 bg-card">
                  <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                    {c.deal?.image ? (
                      <img src={c.deal.image} alt="" className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold tracking-tight truncate">{c.deal?.title || 'Deal'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Code <span className="font-mono font-bold tracking-widest text-foreground">{c.redeemCode}</span>
                    </p>
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
            })}
          </div>
        )}
      </div>
    </main>
  );
}
