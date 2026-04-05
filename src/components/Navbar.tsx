'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShoppingBag, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const { user, loading, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#process" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
          <Link href="/#ecosystem" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Ecosystem</Link>
          <Link href="/partner/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">API Docs</Link>
        </div>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-8 bg-secondary animate-pulse rounded-xl"></div>
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl hover:bg-secondary transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-premium-gradient flex items-center justify-center text-white border border-white/20">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-none">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showDropdown && "rotate-180")} />
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <Link 
                      href={`/${user.role}/dashboard`}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium hover:text-emerald-600 transition-colors pr-2">Sign In</Link>
              <Link 
                href="/auth/register" 
                className="px-4 py-2 bg-premium-gradient text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
