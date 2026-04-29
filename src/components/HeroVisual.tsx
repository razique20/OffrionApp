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
        <div className="absolute -top-12 -left-8 md:-top-16 md:-left-12 w-56 md:w-64 bg-card border border-border/50 rounded-md p-5 shadow-none z-20 animate-float" style={{ animationDelay: '0s' }}>
          <div className="absolute -top-2.5 -right-2 bg-emerald-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-xl z-40 border border-white/10">
            Active Promo
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary border border-border shrink-0">
              <img src="/images/merchant-owner.png" alt="Merchant" className="w-full h-full object-cover" />
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
        <div className="absolute -bottom-10 -right-8 md:-bottom-14 md:-right-12 w-64 md:w-72 bg-card border border-border rounded-md shadow-none z-30 animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="absolute -top-2.5 -right-2 bg-blue-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-xl z-40 border border-white/10">
            25% API Bonus
          </div>
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-secondary/50">
            <div className="w-2 h-2 rounded-full bg-red-400/50"></div>
            <div className="w-2 h-2 rounded-full bg-amber-400/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-400/50"></div>
            <span className="ml-2 text-[10px] text-foreground/40 font-mono italic">GET /api/deals</span>
          </div>
          <div className="p-5 font-mono text-[11px] leading-relaxed">
            <div className="flex gap-2 text-emerald-500 font-bold mb-3">
              <Zap className="w-3 h-3" />
              <span>25 Exclusive Discounts Found</span>
            </div>
            <div className="flex gap-3 items-center mb-3 p-2 bg-secondary/30 rounded border border-border/50">
              <div className="w-8 h-8 rounded bg-background overflow-hidden shrink-0">
                <img src="/images/dashboard-hero.png" alt="Deal" className="w-full h-full object-cover" />
              </div>
              <span className="text-[9px] text-muted-foreground">Nearby: Armani Hotel - 30% OFF</span>
            </div>
            <div className="flex gap-2">
              <span className="text-foreground">➜</span>
              <span className="text-muted-foreground">Searching...</span>
            </div>
          </div>
        </div>

        {/* 3. Main Product Card (Center) */}
        <div className="relative bg-background border border-border shadow-none rounded-[2.5rem] p-6 overflow-hidden z-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-primary-foreground shadow-none">
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
            <div className="px-3 py-1 rounded-full bg-secondary border border-border text-foreground text-[10px] font-bold">
              VERIFIED
            </div>
          </div>

          <div className="aspect-video w-full bg-secondary/30 rounded-md mb-6 relative overflow-hidden group">
            <img 
              src="/images/hero_multi_deal.png" 
              alt="Exclusive Lifestyle Deals"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Discount Badge Overlay */}
            <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5 animate-in fade-in zoom-in duration-700 delay-500">
              <div className="bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest shadow-xl border border-white/10">
                70% OFF
              </div>
              <div className="bg-background/80 backdrop-blur-md text-foreground text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter border border-border/50">
                Limited Offer
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60"></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h4 className="text-xl font-bold tracking-tight">Multi-Category Discovery</h4>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Extra 15% Cashback</span>
              </div>
              <span className="text-sm font-black text-foreground uppercase tracking-widest">Instant</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore premium offers across Hotels, Automotive, Wellness, and more. One API, infinite possibilities.
            </p>
            
            <button className="w-full py-3.5 bg-primary text-primary-foreground rounded-md text-xs font-bold shadow-none flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <ShieldCheck className="w-3.5 h-3.5" />
              View Redemption QR
            </button>
          </div>
        </div>

        {/* 4. Partner Payout Card (Bottom Left) */}
        <div className="absolute -bottom-12 -left-10 md:-bottom-16 md:-left-14 w-48 md:w-56 bg-card border border-border/50 rounded-md p-4 shadow-none z-20 animate-float" style={{ animationDelay: '2.5s' }}>
           <div className="absolute -top-2.5 -right-2 bg-orange-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-xl z-40 border border-white/10">
             Flash Deal
           </div>
           <div className="aspect-[4/3] w-full bg-secondary/30 rounded-md mb-3 overflow-hidden">
              <img src="/images/hero_deal.png" alt="Deal" className="w-full h-full object-cover" />
           </div>
           <div className="space-y-1">
             <div className="flex items-center justify-between">
               <p className="text-[9px] font-bold text-muted-foreground uppercase">Instant Payout</p>
               <span className="text-[9px] font-bold text-orange-500">50% Split</span>
             </div>
             <p className="text-base font-black tracking-tight">AED 1,240.00</p>
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
