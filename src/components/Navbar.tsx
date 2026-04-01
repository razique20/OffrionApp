'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold">O</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Offrion</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="/partners" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Partners</Link>
          <Link href="/partner/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">API Docs</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors pr-2">Sign In</Link>
          <Link 
            href="/auth/register?role=merchant" 
            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all"
          >
            Become Merchant
          </Link>
          <Link 
            href="/auth/register?role=partner" 
            className="px-4 py-2 bg-secondary text-foreground border border-border rounded-xl text-sm font-bold hover:bg-secondary/80 transition-all"
          >
            Become Partner
          </Link>
        </div>
      </div>
    </nav>
  );
};
