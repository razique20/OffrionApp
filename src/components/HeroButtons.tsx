'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export const HeroButtons = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="w-full sm:w-48 h-14 bg-secondary animate-pulse rounded-2xl"></div>
        <div className="w-full sm:w-48 h-14 bg-secondary animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <Link 
          href={`/${user.role}/dashboard`}
          className="w-full sm:w-auto px-10 py-5 bg-[#245F73] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[#245F73]/20 hover:bg-[#1a4a5a] transition-all flex items-center justify-center gap-2"
        >
          Go to Dashboard <LayoutDashboard className="w-5 h-5" />
        </Link>
        <Link 
          href="/partner/docs" 
          className="group text-[#245F73] font-bold text-lg flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          View API Docs <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <Link 
        href="/auth/register" 
        className="w-full sm:w-auto px-10 py-5 bg-[#245F73] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[#245F73]/20 hover:bg-[#1a4a5a] transition-all flex items-center justify-center gap-2"
      >
        Get Started Now <ArrowRight className="w-5 h-5" />
      </Link>
      <Link 
        href="/docs" 
        className="group text-[#245F73] font-bold text-lg flex items-center gap-2 hover:opacity-70 transition-opacity"
      >
        Read the Docs <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};
