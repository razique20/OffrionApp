'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Briefcase, Handshake, Loader2, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/constants/locations';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'merchant' | 'partner'>('partner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [country, setCountry] = useState('United Arab Emirates');
  const [accessCountries, setAccessCountries] = useState<string[]>(['United Arab Emirates']);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'merchant' || roleParam === 'partner') {
      setRole(roleParam);
    }
  }, [searchParams]);

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

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pt-20">
        <div className="flex flex-col lg:flex-row w-full min-h-[calc(100svh-80px)]">

          {/* ── Left: Form ── */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-12 sm:px-8 overflow-y-auto">
            <Suspense fallback={<LoadingForm />}>
              <RegisterForm />
            </Suspense>
          </div>
          
          {/* ── Right: Atmospheric Brand Panel ── */}
          <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-card border-l border-border">
            {/* Gradient orbs */}
            <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-secondary rounded-full blur-[160px] pointer-events-none" />
            
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ 
              backgroundImage: 'radial-gradient(circle, var(--foreground) 1px, transparent 1px)', 
              backgroundSize: '32px 32px' 
            }} />

            {/* Content */}
            <div className="relative z-10 max-w-md px-12 text-center">
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] text-foreground mb-5">
                Start earning<br />from day one.
              </h1>
              <p className="text-muted-foreground leading-relaxed text-base mb-12">
                Merchants publish deals. Partners distribute them. Everyone earns — automatically.
              </p>

              {/* Two mini cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-md bg-secondary/50 border border-border/50 backdrop-blur-sm text-left">
                  <Briefcase className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground font-medium">Merchants</p>
                  <p className="text-sm text-foreground font-semibold">Zero upfront cost</p>
                </div>
                <div className="p-4 rounded-md bg-secondary/50 border border-border/50 backdrop-blur-sm text-left">
                  <Handshake className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground font-medium">Partners</p>
                  <p className="text-sm text-foreground font-semibold">70% commission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
