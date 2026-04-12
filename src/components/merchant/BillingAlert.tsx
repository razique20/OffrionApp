'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

export default function BillingAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const checkBillingStatus = () => {
      const day = new Date().getDate();
      
      // Target dates are 15th and 30th/31st
      if (day >= 12 && day <= 15) {
        setIsVisible(true);
        setDaysRemaining(15 - day);
      } else if (day >= 27 && day <= 30) {
        setIsVisible(true);
        // Simplified logic for end of month
        setDaysRemaining(Math.max(0, 30 - day));
      } else {
        setIsVisible(false);
      }
    };

    checkBillingStatus();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mb-8 relative overflow-hidden bg-amber-500/10 border border-amber-500/20 rounded-[32px] p-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-start md:items-center gap-6">
        <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
          <Calendar className="w-7 h-7" />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black tracking-tight text-amber-900 dark:text-amber-100">Billing Cycle Settlement Near</h3>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
               {daysRemaining === 0 ? 'Due Today' : `${daysRemaining} Days Left`}
            </span>
          </div>
          <p className="text-sm font-medium text-amber-800/70 dark:text-amber-200/50 max-w-2xl">
            Our 15-day fund settlement period is active. Please ensure your payment method is valid or top up your wallet to avoid service interruption during the next settlement cycle.
          </p>
        </div>

        <div className="hidden md:flex gap-3">
            <Link href="/merchant/wallet">
                <button className="px-6 py-2.5 bg-amber-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                    Manage Funds <ArrowRight className="w-4 h-4" />
                </button>
            </Link>
            <button 
                onClick={() => setIsVisible(false)}
                className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl hover:bg-amber-500/20 transition-all"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
}
