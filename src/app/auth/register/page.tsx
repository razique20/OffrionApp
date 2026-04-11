'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { UserPlus, Mail, Lock, User, Briefcase, Handshake, Loader2, AlertCircle, ArrowRight, CheckCircle2, TrendingUp, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'merchant' | 'partner'>('partner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        body: JSON.stringify({ name, email, password, role, mergeExisting: !!searchParams.get('merge') }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'ROLE_CONFLICT') {
          if (confirm(`Account already exists as a ${data.existingRoles.join(', ')}. Would you like to add the ${role} role to your existing account?`)) {
            router.push(`/auth/register?role=${role}&merge=true`);
            // The useEffect or a direct call could handle this, but for simplicity we'll trigger another submit logic or just change the UI
            setError(`Account found. Please click "Initialize Account" again to confirm adding the ${role} role.`);
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
      <div className="w-full max-w-md text-center py-12 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Account Verified!</h2>
        <p className="text-muted-foreground text-lg">Your Offrion identity has been created. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center lg:text-left space-y-2">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto lg:mx-0 shadow-lg shadow-primary/10">
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Join the Ecosystem</h2>
        <p className="text-muted-foreground">Select your operational role to begin.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setRole('merchant')}
          className={cn(
            "p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2",
            role === 'merchant'
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]'
              : 'border-border bg-secondary/30 hover:bg-secondary/60 hover:border-border/80'
          )}
        >
          <div className={cn("p-3 rounded-2xl", role === 'merchant' ? 'bg-primary text-white shadow-md' : 'bg-secondary text-muted-foreground')}>
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold tracking-tight">Merchant</span>
        </button>
        <button
          type="button"
          onClick={() => setRole('partner')}
          className={cn(
            "p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2",
            role === 'partner'
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]'
              : 'border-border bg-secondary/30 hover:bg-secondary/60 hover:border-border/80'
          )}
        >
          <div className={cn("p-3 rounded-2xl", role === 'partner' ? 'bg-primary text-white shadow-md' : 'bg-secondary text-muted-foreground')}>
            <Handshake className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold tracking-tight">Partner</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3 text-destructive text-sm animate-in zoom-in-95 duration-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Legal Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary/30 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Operational Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary/30 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Secure Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/30 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              placeholder="Min. 8 characters"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/25 mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Initialize Account'}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>

      <div className="pt-6 border-t border-border">
        <div className="text-center text-sm space-y-4">
          <p className="text-muted-foreground">
            Already registered?{' '}
            <Link href="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const LoadingForm = () => (
  <div className="w-full max-w-md flex flex-col items-center justify-center min-h-[400px]">
    <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
    <p className="text-sm font-bold text-muted-foreground mt-4 tracking-widest uppercase">Loading Gateway...</p>
  </div>
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pt-20">
        <div className="flex w-full h-[calc(100vh-80px)]">
          {/* Form Side */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 overflow-y-auto bg-background">
            <Suspense fallback={<LoadingForm />}>
              <RegisterForm />
            </Suspense>
          </div>
          
          {/* Informative Side (Hidden on Mobile) */}
          <div className="hidden lg:flex w-1/2 bg-secondary/30 border-l border-border p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-8 max-w-lg">
              <div className="space-y-4">
                <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
                  Unlock the <span className="text-gradient">Potential</span> of Hyper-Local Commerce
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Join a verified network of premier merchants and distribution partners powering real-time deal discovery and automated redemptions.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">For Merchants</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Boost offline foot traffic securely. Create dynamic deals distributed instantly across our partner network with zero upfront marketing costs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl">
                    <Layers className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">For Partners</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Monetize your audience immediately. Integrate our high-converting API and earn an automatic 70% revenue share on every verified redemption.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
               <p className="text-xs text-muted-foreground max-w-sm">
                 By initializing your account, you strictly agree to Offrion's{' '}
                 <Link href="#" className="font-bold text-primary hover:underline">Terms of Service</Link> and{' '}
                 <Link href="#" className="font-bold text-primary hover:underline">Privacy Policy</Link>. 
                 Accounts are subject to admin moderation.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
