'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FomoDeal {
  id: string;
  title: string;
  merchantName: string;
  urgencyReason: string;
  urgencyLevel: number;
  hoursLeft: number;
  remainingUsage: number | null;
}

export function FomoTicker() {
  const [deals, setDeals] = useState<FomoDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFomo = async () => {
      try {
        const res = await fetch('/api/deals/fomo');
        if (res.ok) {
          const data = await res.json();
          setDeals(data);
        }
      } catch (err) {
        console.error('FOMO Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFomo();
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(deals.length, 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [deals.length]);

  if (loading || deals.length === 0) return null;

  const currentDeal = deals[currentIndex];

  return (
    <div className="w-full bg-primary/5 border-y border-primary/20 backdrop-blur-sm overflow-hidden h-10 flex items-center relative z-40">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-4 animate-in slide-in-from-right duration-500">
           <div className={cn(
             "flex items-center gap-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
             currentDeal.urgencyLevel >= 9 ? "bg-red-500 text-white animate-pulse" : "bg-primary text-white"
           )}>
             {currentDeal.urgencyLevel >= 9 ? <Flame className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
             {currentDeal.urgencyLevel >= 9 ? 'Hot Deal' : 'Trending'}
           </div>
           
           <p className="text-xs font-medium text-foreground truncate max-w-[200px] sm:max-w-md">
             <span className="font-bold">{currentDeal.merchantName}:</span> {currentDeal.title} — 
             <span className={cn(
               "ml-2 font-bold",
               currentDeal.urgencyLevel >= 9 ? "text-red-500" : "text-primary"
             )}>{currentDeal.urgencyReason}</span>
           </p>
        </div>

        <Link 
          href={`/deals/${currentDeal.id}`}
          className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
        >
          Claim Now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      {/* Progress Bar for the auto-switch */}
      <div 
        key={currentIndex}
        className="absolute bottom-0 left-0 h-0.5 bg-primary/30 animate-[progress_5s_linear]" 
      />

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
