'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut, 
  User, 
  Settings, 
  LifeBuoy,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [me, setMe] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setMe(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const initials = me?.name ? me.name.charAt(0).toUpperCase() : me?.email?.charAt(0).toUpperCase() || '?';
  const role = me?.role || 'user';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center gap-2 p-1 rounded-full border border-border bg-card hover:bg-secondary transition-all cursor-pointer outline-none",
          isOpen && "ring-2 ring-primary/20 bg-secondary"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-foreground text-xs transition-transform group-hover:scale-105">
          {initials}
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl py-2 z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-1">
              <p className="text-sm font-bold text-foreground truncate">{me?.name || 'My Account'}</p>
              {me?.roles?.includes('super_admin') && (
                <div className="p-1 bg-primary/10 rounded-md">
                   <Sparkles className="w-3 h-3 text-primary" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-[0.15em] font-medium opacity-70">
              {me?.email}
            </p>
          </div>
          
          <div className="p-1.5 space-y-0.5">
            <button 
              onClick={() => { setIsOpen(false); router.push(`/${role}/settings`); }}
              className="w-full text-left px-3 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg flex items-center gap-3 transition-all"
            >
              <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                <Settings className="w-3.5 h-3.5" />
              </div>
              Account Configuration
            </button>
            <button 
              onClick={() => { setIsOpen(false); router.push(`/${role}/support`); }}
              className="w-full text-left px-3 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg flex items-center gap-3 transition-all"
            >
              <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                <LifeBuoy className="w-3.5 h-3.5" />
              </div>
              Concierge & Support
            </button>
          </div>

          <div className="p-1.5 border-t border-border/50 bg-secondary/20">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-all"
            >
              <div className="w-7 h-7 rounded-md bg-red-500/10 flex items-center justify-center">
                <LogOut className="w-3.5 h-3.5 text-red-500" />
              </div>
              Terminate Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
