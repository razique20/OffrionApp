"use client";

import React from 'react';
import { ShoppingBag, Smartphone, QrCode, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export const HeroVisual = () => {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center p-4">
      {/* Soft aura */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-primary/10 blur-[100px] rounded-full" />

      <div className="relative w-full max-w-md space-y-4 z-10">
        {/* Deal card */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">Olive & Thyme Café</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> 400m away
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
              LIVE
            </span>
          </div>
          <div className="rounded-2xl bg-secondary/50 border border-border/50 p-4">
            <p className="text-lg font-bold tracking-tight">2-for-1 weekend brunch</p>
            <p className="text-xs text-muted-foreground mt-1">Valid Sat &amp; Sun &middot; 47 left today</p>
          </div>
        </div>

        {/* Flow connector */}
        <div className="flex items-center justify-center gap-3 text-muted-foreground animate-in fade-in duration-1000">
          {[
            { icon: Smartphone, label: 'In the app' },
            { icon: QrCode, label: 'Scan in store' },
            { icon: Sparkles, label: 'Auto payout' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'w-10 h-10 rounded-2xl border border-border flex items-center justify-center bg-card',
                    i === 2 && 'border-emerald-500/30 text-emerald-500'
                  )}
                >
                  <s.icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-medium whitespace-nowrap">{s.label}</span>
              </div>
              {i < 2 && <ArrowRight className="w-3.5 h-3.5 -mt-4 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* Split card */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <p className="text-[11px] font-medium text-muted-foreground mb-3">Everyone gets paid, instantly</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-secondary/50 border border-border/50 p-4">
              <p className="text-2xl font-bold tracking-tight">70%</p>
              <p className="text-[11px] text-muted-foreground">to the partner app</p>
            </div>
            <div className="rounded-2xl bg-secondary/50 border border-border/50 p-4">
              <p className="text-2xl font-bold tracking-tight">+1</p>
              <p className="text-[11px] text-muted-foreground">happy customer in-store</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle dot mesh */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
};
