'use client';

import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Building2, Rocket, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Code2,
    price: 'Free',
    fee: 15, // 15% platform fee
    retention: 85,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    features: ['Geo-Spatial Search API', 'Up to 10 Active Deals', 'Basic Partner Dashboard', 'Standard Support'],
    description: "Perfect for indie hackers and local marketplaces testing the waters."
  },
  {
    id: 'growth',
    name: 'Growth',
    icon: Rocket,
    price: '$49/mo',
    fee: 10, // 10% platform fee
    retention: 90,
    color: 'text-white',
    bg: 'bg-primary',
    features: ['Unlimited Active Deals', 'Global Network Distribution', 'Advanced Real-time Analytics', 'Priority API Support'],
    description: "For scaling platforms and ambitious merchants ready to expand their reach."
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    fee: 5, // 5% platform fee
    retention: 95,
    color: 'text-white/70',
    bg: 'bg-primary/70',
    features: ['White-label Merchant Portal', 'Dedicated Node Cluster', 'Custom SLA Guarantee', 'On-premise Database Sync'],
    description: "Mission-critical deals infrastructure for globally massive Super Apps."
  }
];

export function InteractivePricing() {
  const [activeTierIndex, setActiveTierIndex] = useState(1); // Default to Growth
  const activeTier = TIERS[activeTierIndex];

  return (
    <div className="w-full relative max-w-5xl mx-auto mt-12 bg-card rounded-[2.5rem] p-4 lg:p-8 flex flex-col items-center shadow-none">
      
      {/* Tier Selector Toggle */}
      <div className="inline-flex items-center p-1.5 bg-secondary/30 rounded-md mb-12 w-full lg:w-auto overflow-x-auto ring-1 ring-border/50">
        {TIERS.map((tier, idx) => {
          const isActive = idx === activeTierIndex;
          const Icon = tier.icon;
          return (
            <button
              key={tier.id}
              onClick={() => setActiveTierIndex(idx)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-md text-sm font-bold transition-all whitespace-nowrap",
                isActive 
                  ? "bg-background shadow-none text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? tier.color : "opacity-50")} />
              {tier.name}
            </button>
          );
        })}
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Side: Dynamic Visualization */}
        <div className="order-2 lg:order-1 flex flex-col items-center justify-center p-8 bg-secondary/20 rounded-[2rem]">
          <div className="text-center mb-8">
            <div className="text-5xl font-black mb-2 animate-in slide-in-from-bottom-4 duration-500 fade-in" key={activeTier.price}>
              {activeTier.price}
            </div>
            <div className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Base Cost</div>
          </div>

          {/* Revenue Split Bar */}
          <div className="w-full max-w-xs relative h-16 rounded-full overflow-hidden flex bg-secondary shadow-inner ring-1 ring-black/5 dark:ring-white/5">
            {/* User Retention */}
            <div 
              className={cn("h-full flex items-center justify-center font-bold text-white transition-all duration-700 ease-out", activeTier.bg)}
              style={{ width: `${activeTier.retention}%` }}
            >
              <span className="opacity-0 lg:opacity-100">{activeTier.retention}% You</span>
              <span className="lg:hidden">{activeTier.retention}%</span>
            </div>
            
            {/* Platform Fee */}
            <div 
              className="h-full flex items-center justify-center bg-black/80 dark:bg-white/10 text-white font-bold transition-all duration-700 ease-out"
              style={{ width: `${activeTier.fee}%` }}
            >
               {activeTier.fee}% fee
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-muted-foreground max-w-xs leading-relaxed animate-in fade-in duration-500" key={activeTier.description}>
            {activeTier.description}
          </p>
        </div>

        {/* Right Side: Features */}
        <div className="order-1 lg:order-2 flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Everything in <span className={activeTier.color}>{activeTier.name}</span>
          </h3>
          
          <ul className="space-y-4">
            {activeTier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                <CheckCircle2 className={cn("w-5 h-5 flex-shrink-0 mt-0.5", activeTier.color)} />
                <span className="text-foreground leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-8 border-t border-border/50">
            <button className={cn(
              "w-full lg:w-auto px-8 py-4 rounded-md text-white font-bold shadow-none transition-transform hover:scale-105 flex items-center justify-center gap-2",
              activeTier.bg,
              activeTier.id === 'growth' && 'bg-secondary border border-border'
            )}>
              {activeTier.id === 'enterprise' ? 'Contact Sales' : 'Start Building Now'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
