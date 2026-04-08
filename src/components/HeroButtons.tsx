'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export const HeroButtons = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
        <div className="w-full sm:w-48 h-14 bg-secondary animate-pulse rounded-2xl"></div>
        <div className="w-full sm:w-48 h-14 bg-secondary animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
        <Link 
          href={`/${user.role}/dashboard`}
          className="w-full sm:w-auto px-8 py-4 bg-premium-gradient text-white rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Go to Dashboard <LayoutDashboard className="w-5 h-5" />
        </Link>
        <Link 
          href="/partner/docs" 
          className="w-full sm:w-auto px-8 py-4 bg-card border border-border rounded-2xl text-lg font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2"
        >
          View API Docs
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
      <Link 
        href="/auth/register?role=merchant" 
        className="w-full sm:w-auto px-8 py-4 bg-premium-gradient text-white rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Start as Merchant <ArrowRight className="w-5 h-5" />
      </Link>
      <Link 
        href="/auth/register?role=partner" 
        className="w-full sm:w-auto px-8 py-4 bg-card border border-border rounded-2xl text-lg font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2"
      >
        Integrate API
      </Link>
    </div>
  );
};
