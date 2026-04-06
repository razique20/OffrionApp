'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

export const AppCTA = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="inline-block w-64 h-16 bg-white/20 animate-pulse rounded-2xl relative z-10"></div>
    );
  }

  if (user) {
    return (
      <Link 
        href={`/${user.role}/dashboard`}
        className="inline-block px-10 py-5 bg-white text-primary rounded-2xl text-lg font-bold shadow-xl hover:bg-slate-50 transition-all active:scale-95 relative z-10"
      >
        Go to Dashboard
      </Link>
    );
  }

  return (
    <Link 
      href="/auth/register" 
      className="inline-block px-10 py-5 bg-white text-primary rounded-2xl text-lg font-bold shadow-xl hover:bg-slate-50 transition-all active:scale-95 relative z-10"
    >
      Get Started for Free
    </Link>
  );
};
