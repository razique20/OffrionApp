'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Map as MapIcon, 
  Activity, 
  Clock, 
  Navigation,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface PulseItem {
  id: string;
  title: string;
  merchantName: string;
  amount: number;
  location: [number, number];
  timestamp: string;
}

export function RedemptionPulse() {
  const [items, setItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pulseKey, setPulseKey] = useState(0);

  const fetchPulse = async () => {
    try {
      const res = await fetch('/api/admin/pulse');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
        setPulseKey(prev => prev + 1);
      }
    } catch (err) {
      console.error('Pulse fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPulse();
    const interval = setInterval(fetchPulse, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full bg-card border border-border rounded-md overflow-hidden shadow-none">
      {/* Visual Pulse Section */}
      <div className="lg:col-span-2 relative min-h-[400px] bg-[#0A0A0B] overflow-hidden group">
        {/* Abstract Map Background (SVG Mesh) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Abstract City Paths */}
            <path d="M0,100 Q400,120 800,80" stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none" />
            <path d="M200,0 Q220,250 180,500" stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none" />
            <path d="M600,0 Q580,250 620,500" stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Pulse Overlay */}
        <div className="absolute inset-0 z-10 p-12 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center border border-primary/30">
                <Activity className="w-5 h-5 text-foreground animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">Ecosystem Pulse</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Real-time Redemptions</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live Hub</span>
            </div>
          </div>

          <div className="flex-1 relative mt-12">
            {/* Transaction Nodes (Visual Simulation) */}
            {!loading && items.map((item, index) => {
              // Deterministic but "random-looking" positions based on coordinate hash
              const xPos = Math.abs(item.location[0] * 1000) % 80; 
              const yPos = Math.abs(item.location[1] * 1000) % 70;
              
              return (
                <div 
                  key={item.id}
                  className="absolute animate-[ping-slow_4s_infinite]"
                  style={{ 
                    left: `${10 + xPos}%`, 
                    top: `${15 + yPos}%`,
                    animationDelay: `${index * 0.5}s`
                  }}
                >
                  <div className="relative group">
                    <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(255,75,38,0.8)]" />
                    <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                    
                    {/* Tooltip on hover simulation */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border px-3 py-1.5 rounded-lg whitespace-nowrap z-50 pointer-events-none">
                      <p className="text-[10px] font-bold text-foreground">{item.merchantName}</p>
                      <p className="text-[9px] text-muted-foreground">{item.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
             <div className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>Geospatial Engine Active</span>
             </div>
             <div className="w-1 h-1 bg-border rounded-full" />
             <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>8s Refresh Interval</span>
             </div>
          </div>
        </div>

        {/* Diagonal Light Beam Effect */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-[45deg] pointer-events-none blur-3xl opacity-50" />
      </div>

      {/* Activity Feed Section */}
      <div className="p-8 border-l border-border bg-card/50">
        <div className="flex items-center justify-between mb-8">
           <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Activity Stream</h4>
           <div className="p-2 bg-secondary rounded-lg">
              <Sparkles className="w-4 h-4 text-foreground" />
           </div>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[450px] no-scrollbar pr-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-md bg-secondary flex-shrink-0" />
                <div className="flex-1 space-y-2 mt-1">
                  <div className="h-3 w-2/3 bg-secondary rounded" />
                  <div className="h-2 w-1/2 bg-secondary rounded" />
                </div>
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground italic text-xs">
              Waiting for first redemptions...
            </div>
          ) : (
            items.map((item, idx) => (
              <div 
                key={item.id} 
                className="flex gap-4 group cursor-default transition-all hover:translate-x-1"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-md bg-secondary/50 border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 transition-colors">
                  <Zap className={cn("w-5 h-5", idx === 0 ? "text-white animate-pulse" : "text-muted-foreground opacity-50")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold truncate group-hover:text-foreground transition-colors">{item.merchantName}</p>
                    <span className="text-[10px] font-mono text-muted-foreground opacity-60">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate font-medium mt-0.5">{item.title}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                     <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">{formatCurrency(item.amount)}</span>
                     <ChevronRight className="w-3 h-3 text-muted-foreground opacity-30" />
                     <span className="text-[9px] text-muted-foreground opacity-50 hover:opacity-100 flex items-center gap-1 cursor-pointer">
                        Audit <ExternalLink className="w-2.5 h-2.5" />
                     </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button className="w-full mt-12 py-3 bg-secondary border border-border rounded-md text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all">
          View Full Marketplace Ledger
        </button>
      </div>

      <style jsx global>{`
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
