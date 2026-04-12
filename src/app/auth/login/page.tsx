'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { LogIn, Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const roles = data.user.roles || [data.user.role];
      const primaryRole = data.user.role;

      if (roles.includes('admin') || roles.includes('super_admin')) router.push('/admin/dashboard');
      else if (roles.includes('merchant') && roles.includes('partner')) {
        // For multi-role, we could show a switcher, but for now we'll go to the primary role 
        // AND ensure the sidebar allows easy switching.
        // If they just registered as a merchant, they might want to go there.
        if (primaryRole === 'merchant') router.push('/merchant/dashboard');
        else router.push('/partner/dashboard');
      }
      else if (roles.includes('merchant')) router.push('/merchant/dashboard');
      else router.push('/partner/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pt-20">
        <div className="flex w-full h-[calc(100vh-80px)]">
          {/* Informative Side (Hidden on Mobile) */}
          <div className="hidden lg:flex w-1/2 bg-secondary/30 border-r border-border p-8 lg:p-12 flex-col justify-between relative overflow-hidden frost-glass">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/30 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-8 max-w-lg">
              <div className="space-y-4">
                <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tighter mb-4 text-foreground hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-lg bg-premium-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-white text-lg leading-none mt-[-2px]">O</span>
                  </div>
                  Offrion.
                </Link>
                <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
                  The Ecosystem for Modern <span className="text-gradient">Redemption</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Log in to manage your deals, track unified webhooks, and oversee automated commission settlements instantly.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Real-Time Infrastructure</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Experience a strictly production-ready infrastructure to manage and scale your hyper-local deal redemptions securely.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Automated 70/30 Ledger</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Every transaction is transparently split upon redemption, guaranteeing instant partner payouts and platform revenue.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/80 rounded-2xl">
                    <ShieldCheck className="w-6 h-6 text-primary/80" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Enterprise-Grade Architecture</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Operate securely with environment isolation, scalable data structures, and continuous transaction auditing.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-4 p-4 rounded-3xl bg-card border border-border shadow-sm">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">SOC-2 Status</p>
                  <p className="text-sm font-medium">In Progress • Zero Data Leaks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 overflow-y-auto bg-background">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center lg:text-left space-y-2">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto lg:mx-0 shadow-lg shadow-primary/10">
                  <LogIn className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
                <p className="text-muted-foreground">Access your Offrion workspace.</p>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3 text-destructive text-sm animate-in zoom-in-95 duration-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
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
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                    <Link href="#" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/25 mt-4"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate & Continue'}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>

              <div className="pt-4 border-t border-border">
                <div className="text-center text-sm space-y-4">
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="text-primary font-bold hover:underline">Request Access</Link>
                  </p>
                </div>
              </div>

              {/* Development Quick Logging */}
              <div className="mt-4 grid grid-cols-2 gap-3 opacity-60 hover:opacity-100 transition-opacity">
                 <div className="p-3 bg-secondary/50 rounded-2xl border border-border/50 text-center cursor-copy group" onClick={() => setEmail('merchant@example.com')}>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1 group-hover:text-primary transition-colors">Merchant Seed</div>
                    <div className="text-xs font-mono font-medium truncate">merchant@example.com</div>
                 </div>
                 <div className="p-3 bg-secondary/50 rounded-2xl border border-border/50 text-center cursor-copy group" onClick={() => setEmail('partner@example.com')}>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1 group-hover:text-primary transition-colors">Partner Seed</div>
                    <div className="text-xs font-mono font-medium truncate">partner@example.com</div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
