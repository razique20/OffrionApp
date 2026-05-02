"use client";

import React from 'react';
import { 
  ShieldCheck,
  TrendingUp,
  Zap,
  Users,
  Terminal,
  Code2,
  Wallet,
  Sparkles,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const HeroVisual = () => {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center p-4">
      {/* ── Background Aura ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-[100px] rounded-full animate-pulse-slow"></div>

      {/* ── Informative API Console (Borderless) ── */}
      <div className="relative w-full max-w-2xl bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Console Body: Dual Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">
          {/* Left Pane: Code Snippet */}
          <div className="p-8 font-mono text-xs leading-relaxed">
            <div className="flex items-center gap-2 mb-8 opacity-40">
              <Terminal className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-widest">Protocol v2.4</span>
            </div>

            <p className="text-purple-400 mb-2">// 1. Authenticate with secure key</p>
            <p className="text-blue-400">const <span className="text-white">response</span> = await fetch(<span className="text-emerald-400">'https://api.offrion.com/v1/deals'</span>, {"{"}</p>
            <p className="pl-4 text-white">headers: {"{"} <span className="text-emerald-400">'x-api-key'</span>: <span className="text-emerald-400">'off_prod_82x...'</span> {"}"}</p>
            <p className="text-white">{"}"});</p>
            
            <p className="text-purple-400 mt-6 mb-2">// 2. Parse localized deal stream</p>
            <p className="text-blue-400">const {"{"} <span className="text-white">deals</span> {"}"} = await <span className="text-white">response</span>.json();</p>
            
            <p className="text-purple-400 mt-6 mb-2">// 3. Initialize high-conversion loop</p>
            <p className="text-white">console.log(<span className="text-emerald-400">`Active deals: ${"{"}deals.length{"}"}`</span>);</p>
            <p className="text-white"><span className="text-blue-400">renderDeals</span>(deals);</p>
          </div>

          {/* Right Pane: Live Performance Metrics */}
          <div className="p-8 bg-white/[0.03] space-y-8">
            <div className="space-y-4">
              <h5 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Network Performance</h5>
              <div className="space-y-6">
                {[
                  { label: 'Global Latency', val: '42ms', progress: 92, color: 'bg-emerald-500' },
                  { label: 'API Throughput', val: '18k req/s', progress: 78, color: 'bg-blue-500' },
                  { label: 'Cache Hit Rate', val: '94.2%', progress: 94, color: 'bg-purple-500' },
                ].map((m, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/60">{m.label}</span>
                      <span className="text-white font-mono">{m.val}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-1000", m.color)} style={{ width: `${m.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h5 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Active Nodes</h5>
              <div className="flex flex-wrap gap-2">
                {['Dubai', 'London', 'Singapore', 'New York', 'Mumbai'].map((city) => (
                  <div key={city} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-white/60">
                    {city}
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* ── Background Mesh ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', 
        backgroundSize: '32px 32px' 
      }}></div>
    </div>
  );
};
