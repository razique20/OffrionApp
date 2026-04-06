'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

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

      // Store token (client-side simple storage for now, middleware handles cookies if set)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      const role = data.user.role;
      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'merchant') router.push('/merchant/dashboard');
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
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-6">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-[32px] p-8 md:p-10 shadow-2xl">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Access your Offrion dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold">Password</label>
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-premium-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?</span>{' '}
              <Link href="/auth/register" className="text-primary font-bold hover:underline">Create one</Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="p-4 bg-secondary/30 rounded-2xl border border-border/50 text-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Merchant Seed</div>
                <div className="text-xs font-mono truncate">merchant@example.com</div>
             </div>
             <div className="p-4 bg-secondary/30 rounded-2xl border border-border/50 text-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Partner Seed</div>
                <div className="text-xs font-mono truncate">partner@example.com</div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
