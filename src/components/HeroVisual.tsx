"use client";

import React from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Terminal, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const HeroVisual = () => {
  return (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">
      {/* ── Background Aura ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-[100px] rounded-full animate-pulse-slow"></div>

      {/* ── Main Mockup Stack ── */}
      <div className="relative w-full max-w-md">
        
        {/* 1. Merchant Analytics Card (Top Left) */}
        <div className="absolute -top-12 -left-8 md:-top-16 md:-left-12 w-56 md:w-64 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-2xl z-20 animate-float" style={{ animationDelay: '0s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12.4%</span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Revenue</p>
            <p className="text-xl font-bold text-foreground">AED 42,890</p>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-3">
             <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-5 h-5 rounded-full border border-background bg-secondary/50"></div>
               ))}
             </div>
             <p className="text-[10px] text-muted-foreground font-medium">1.2k redemptions today</p>
          </div>
        </div>

        {/* 2. API Snippet Card (Bottom Right) */}
        <div className="absolute -bottom-10 -right-8 md:-bottom-14 md:-right-12 w-64 md:w-72 bg-[#0A0A0B] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-30 animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/5">
            <div className="w-2 h-2 rounded-full bg-red-400/50"></div>
            <div className="w-2 h-2 rounded-full bg-amber-400/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-400/50"></div>
            <span className="ml-2 text-[10px] text-white/40 font-mono italic">GET /api/deals</span>
          </div>
          <div className="p-5 font-mono text-[11px] leading-relaxed">
            <div className="flex gap-2">
              <span className="text-primary">➜</span>
              <span className="text-white/40">Searching...</span>
            </div>
            <div className="mt-3 text-emerald-400 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <p>{"{"}</p>
              <p className="pl-3">"status": "success",</p>
              <p className="pl-3">"deals": [ ... ]</p>
              <p>{"}"}</p>
            </div>
          </div>
        </div>

        {/* 3. Main Product Card (Center) */}
        <div className="relative bg-background border border-border shadow-2xl rounded-[2.5rem] p-6 overflow-hidden z-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Hot Deal Nearby</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>Downtown Dubai</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">
              VERIFIED
            </div>
          </div>

          <div className="aspect-video w-full bg-secondary/30 rounded-2xl mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold tracking-tight">50% Off Total Bill</h4>
              <span className="text-2xl font-black text-primary">AED 0</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Redeemable at 12 partner locations in the Dubai Mall area. Valid till end of week.
            </p>
            
            <button className="w-full py-3.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <ShieldCheck className="w-3.5 h-3.5" />
              View Redemption QR
            </button>
          </div>
        </div>

        {/* ── Mesh Decoration ── */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at center, var(--primary) 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }}></div>
        </div>
      </div>
    </div>
  );
};
