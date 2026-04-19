'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="flex flex-col lg:flex-row w-full min-h-[calc(100svh-80px)]">
          
          {/* ── Left: Atmospheric Brand Panel ── */}
          <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-card border-r border-border">
            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary rounded-full blur-[160px] pointer-events-none" />
            
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ 
              backgroundImage: 'radial-gradient(circle, var(--foreground) 1px, transparent 1px)', 
              backgroundSize: '32px 32px' 
            }} />

            {/* Content */}
            <div className="relative z-10 max-w-md px-12 text-center">
             
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] text-foreground mb-5">
                Your deals,<br />one dashboard.
              </h1>
              <p className="text-muted-foreground leading-relaxed text-base">
                Manage, distribute, and track redemptions across your entire partner network.
              </p>

              {/* Floating stat */}
              <div className="mt-12 inline-flex items-center gap-6 px-6 py-4 rounded-md bg-secondary/50 border border-border/50 backdrop-blur-sm">
                <div className="text-left">
                  <p className="text-xs text-muted-foreground font-medium">Active partners</p>
                  <p className="text-xl font-bold text-foreground">140+</p>
                </div>
                <div className="w-px h-8 bg-border/50" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground font-medium">Uptime</p>
                  <p className="text-xl font-bold text-foreground">99.9%</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-12 sm:px-8">
            <div className="w-full max-w-sm space-y-8">

              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
                <p className="text-sm text-muted-foreground">Enter your credentials to continue.</p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2.5 text-destructive text-sm animate-in zoom-in-95 duration-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <Link href="#" className="text-xs text-foreground hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border border-border rounded-lg py-2.5 px-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                      placeholder="••••••••"
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
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground/60">or</span></div>
              </div>

              {/* Footer */}
              <p className="text-center text-sm text-muted-foreground">
                No account yet?{' '}
                <Link href="/auth/register" className="text-foreground font-semibold hover:underline">Create one</Link>
              </p>

              {/* Dev Quick Login — subtle */}
              <div className="grid grid-cols-2 gap-2 opacity-40 hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={() => { setEmail('merchant@example.com'); setPassword('password123'); }}
                  className="py-2 px-3 bg-secondary/50 rounded-lg border border-border/30 text-[10px] text-muted-foreground font-mono hover:border-primary/30 transition-colors truncate"
                >
                  merchant@example.com
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('partner@example.com'); setPassword('password123'); }}
                  className="py-2 px-3 bg-secondary/50 rounded-lg border border-border/30 text-[10px] text-muted-foreground font-mono hover:border-primary/30 transition-colors truncate"
                >
                  partner@example.com
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
