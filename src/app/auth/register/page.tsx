'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Briefcase, Handshake, Loader2, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/constants/locations';

function RegisterForm({ role, setRole }: { role: 'merchant' | 'partner'; setRole: (r: 'merchant' | 'partner') => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [country, setCountry] = useState('United Arab Emirates');
  const [accessCountries, setAccessCountries] = useState<string[]>(['United Arab Emirates']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          role, 
          country, 
          accessCountries,
          mergeExisting: !!searchParams.get('merge') 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'ROLE_CONFLICT') {
          if (confirm(`Account already exists as a ${data.existingRoles.join(', ')}. Would you like to add the ${role} role to your existing account?`)) {
            router.push(`/auth/register?role=${role}&merge=true`);
            setError(`Account found. Please click "Create account" again to confirm adding the ${role} role.`);
            return;
          }
        }
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-sm text-center py-16 animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">You're in.</h2>
        <p className="text-sm text-muted-foreground">Redirecting you to sign in...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground">Pick your role and get started in 30 seconds.</p>
      </div>

      {/* Role Toggle */}
      <div className="p-1 bg-secondary/50 rounded-lg flex gap-1">
        <button
          type="button"
          onClick={() => setRole('merchant')}
          className={cn(
            "flex-1 py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2",
            role === 'merchant'
              ? 'bg-background text-foreground shadow-none'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Merchant
        </button>
        <button
          type="button"
          onClick={() => setRole('partner')}
          className={cn(
            "flex-1 py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2",
            role === 'partner'
              ? 'bg-background text-foreground shadow-none'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Handshake className="w-3.5 h-3.5" />
          Partner
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2.5 text-destructive text-sm animate-in zoom-in-95 duration-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Full name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border border-border rounded-lg py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-border rounded-lg py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
            placeholder="name@company.com"
          />
        </div>
        
        {role === 'merchant' && (
          <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-medium text-foreground">Business Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-transparent border border-border rounded-lg py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name} className="bg-background">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {role === 'partner' && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <div>
              <label className="text-sm font-medium text-foreground">Access Regions</label>
              <p className="text-[10px] text-muted-foreground mb-2 text-balance leading-tight">Select which markets you want to distribute deals for.</p>
            </div>
            <div className="flex flex-wrap gap-2 p-3.5 bg-secondary/50 border border-border rounded-md">
              {COUNTRIES.map((c) => {
                const isSelected = accessCountries.includes(c.name);
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setAccessCountries(accessCountries.filter(a => a !== c.name));
                      } else {
                        setAccessCountries([...accessCountries, c.name]);
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border",
                      isSelected 
                        ? "bg-primary/20 text-white border-primary/30" 
                        : "bg-background text-muted-foreground border-border hover:border-muted-foreground/30"
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
            {accessCountries.length === 0 && (
              <p className="text-[10px] text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Select at least one region
              </p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-border rounded-lg py-2.5 px-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create account'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Footer */}
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-foreground font-semibold hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-[11px] text-muted-foreground/50 leading-relaxed">
          By creating an account you agree to the{' '}
          <Link href="#" className="underline hover:text-muted-foreground">Terms</Link> and{' '}
          <Link href="#" className="underline hover:text-muted-foreground">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

const LoadingForm = () => (
  <div className="w-full max-w-sm flex flex-col items-center justify-center min-h-[400px]">
    <Loader2 className="w-6 h-6 animate-spin text-foreground/30" />
  </div>
);

// Role-specific background image for the register panel (reads the same ?role=
// param the form uses, so the image matches the selected role).
const ROLE_IMAGES: Record<'merchant' | 'partner', string> = {
  merchant: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  partner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
};

// Role-specific copy shown over the image.
const ROLE_COPY: Record<'merchant' | 'partner', {
  heading: React.ReactNode;
  sub: string;
  stats: { label: string; value: string }[];
}> = {
  merchant: {
    heading: <>Bring customers<br />through your door.</>,
    sub: 'List a deal once and reach people across dozens of apps. Only pay when someone actually shows up.',
    stats: [
      { label: 'Upfront cost', value: 'Zero' },
      { label: 'You pay', value: 'Per visit' },
    ],
  },
  partner: {
    heading: <>Reward users.<br />Earn on every visit.</>,
    sub: 'Drop in one API to offer your users real local deals — and earn the lion’s share on every redemption.',
    stats: [
      { label: 'Commission', value: '70%' },
      { label: 'Settlement', value: 'Automatic' },
    ],
  },
};

// Initializes the shared role from the ?role= URL param (must be under Suspense).
function RoleParamInit({ onRole }: { onRole: (r: 'merchant' | 'partner') => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'merchant' || r === 'partner') onRole(r);
  }, [searchParams, onRole]);
  return null;
}

export default function RegisterPage() {
  // Shared role: drives both the form and the side image, so toggling the role
  // in the form switches the image too. Initialize from the URL on the client to
  // avoid a flash of the wrong image when arriving via ?role=merchant.
  const [role, setRole] = useState<'merchant' | 'partner'>(() => {
    if (typeof window !== 'undefined') {
      const r = new URLSearchParams(window.location.search).get('role');
      if (r === 'merchant' || r === 'partner') return r;
    }
    return 'partner';
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <Suspense fallback={null}>
        <RoleParamInit onRole={setRole} />
      </Suspense>

      <main className="flex-1 w-full pt-20">
        <div className="flex flex-col lg:flex-row w-full min-h-[calc(100svh-80px)]">

          {/* ── Left: Form ── */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-12 sm:px-8 overflow-y-auto">
            <Suspense fallback={<LoadingForm />}>
              <RegisterForm role={role} setRole={setRole} />
            </Suspense>
          </div>

          {/* ── Right: Role-specific image panel ── */}
          <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center border-l border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ROLE_IMAGES[role]} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" />
            {/* Readability overlay */}
            <div className="absolute inset-0 bg-background/72 backdrop-blur-[1px]" />

            {/* Content — role-specific */}
            <div className="relative z-10 max-w-md px-12 text-center">
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-secondary/60 border border-border/50 backdrop-blur-sm">
                {role === 'merchant'
                  ? <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  : <Handshake className="w-3.5 h-3.5 text-muted-foreground" />}
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground capitalize">{role}</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] text-foreground mb-5">
                {ROLE_COPY[role].heading}
              </h1>
              <p className="text-muted-foreground leading-relaxed text-base mb-12">
                {ROLE_COPY[role].sub}
              </p>

              {/* Role stats */}
              <div className="grid grid-cols-2 gap-3">
                {ROLE_COPY[role].stats.map((s) => (
                  <div key={s.label} className="p-4 rounded-md bg-secondary/50 border border-border/50 backdrop-blur-sm text-left">
                    <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                    <p className="text-sm text-foreground font-semibold">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
