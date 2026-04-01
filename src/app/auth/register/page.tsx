'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { UserPlus, Mail, Lock, User, Briefcase, Handshake, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Suspense } from 'react';

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
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
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

  return (
    <div className="bg-card border border-border rounded-[32px] p-8 md:p-10 shadow-2xl">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UserPlus className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Join Offrion</h1>
        <p className="text-muted-foreground">Choose your path and start growing</p>
      </div>

      {success ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
          <p className="text-muted-foreground">Redirecting you to login...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              type="button"
              onClick={() => setRole('merchant')}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                role === 'merchant' 
                  ? 'border-primary bg-primary/5 shadow-inner' 
                  : 'border-border bg-secondary/30 hover:border-border/80'
              }`}
            >
              <Briefcase className={`w-6 h-6 ${role === 'merchant' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm font-bold">Merchant</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('partner')}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                role === 'partner' 
                  ? 'border-primary bg-primary/5 shadow-inner' 
                  : 'border-border bg-secondary/30 hover:border-border/80'
              }`}
            >
              <Handshake className={`w-6 h-6 ${role === 'partner' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm font-bold">Partner</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
              <label className="text-sm font-semibold ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Min. 8 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Already have an account?</span>{' '}
            <Link href="/auth/login" className="text-primary font-bold hover:underline">Log in</Link>
          </div>
        </>
      )}
    </div>
  );
}

const LoadingForm = () => (
   <div className="bg-card border border-border rounded-[32px] p-8 md:p-10 shadow-2xl flex items-center justify-center min-h-[400px]">
     <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
   </div>
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-6">
        <div className="w-full max-w-lg">
          <Suspense fallback={<LoadingForm />}>
            <RegisterForm />
          </Suspense>
          
          <p className="mt-8 text-center text-xs text-muted-foreground max-w-sm mx-auto">
            By creating an account, you agree to Offrion's{' '}
            <Link href="#" className="underline">Terms of Service</Link> and{' '}
            <Link href="#" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
