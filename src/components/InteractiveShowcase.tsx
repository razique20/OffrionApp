"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, CreditCard, PieChart, Code2, Globe, ShieldCheck, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export const InteractiveShowcase = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'merchant' | 'partner'>('api');
  const [typedText, setTypedText] = useState('');
  
  const fullText = `curl -X GET "https://api.offrion.com/v1/deals" \\
  -H "x-api-key: offr_live_8k2l9..." \\
  -d "radius=5000&lat=40.71&lng=-74.00"`;

  useEffect(() => {
    if (activeTab === 'api') {
      setTypedText('');
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  return (
    <div className="w-full relative">
      {/* Decorative elements */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[2.5rem] blur-xl opacity-50 dark:opacity-0 transition-opacity"></div>
      
      <div className="relative bg-[#0A0A0B] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl dark:shadow-none flex flex-col">
        
        {/* Navigation Tabs */}
        <div className="w-full bg-white/5 border-b border-white/10 p-3 sm:p-4 flex flex-row gap-2 overflow-x-auto custom-scrollbar [&::-webkit-scrollbar]:hidden">
          
          <button 
            onClick={() => setActiveTab('api')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap",
              activeTab === 'api' ? "bg-primary/20 text-primary" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Code2 className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">API Integration</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('merchant')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap",
              activeTab === 'merchant' ? "bg-blue-500/20 text-blue-400" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <CreditCard className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Merchant Tools</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('partner')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap",
              activeTab === 'partner' ? "bg-emerald-500/20 text-emerald-400" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <PieChart className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Partner Dashboard</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full h-[540px] p-8 relative">
          
          {/* API Tab Content */}
          <div className={cn("transition-all duration-500 absolute inset-0 p-8", activeTab === 'api' ? "opacity-100 z-10 translate-y-0" : "opacity-0 pointer-events-none translate-y-4")}>
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-white">Developer Experience</h3>
            </div>
            <p className="text-white/60 mb-8 max-w-lg">
              Fetch hyper-local deals effortlessly. Our global Edge network ensures &lt;80ms latency anywhere in the world.
            </p>
            
            <div className="bg-black/50 border border-white/10 rounded-xl overflow-hidden font-mono text-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-2 text-white/40 text-xs">bash</div>
              </div>
              <div className="p-6 text-white/80 whitespace-pre-wrap">
                <span className="text-primary">➜ </span>
                {typedText}
                <span className="animate-pulse">_</span>
                
                {typedText === fullText && (
                  <div className="mt-6 text-emerald-400/90 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div>{"{"}</div>
                    <div className="pl-4">"status": "success",</div>
                    <div className="pl-4">"latency_ms": 42,</div>
                    <div className="pl-4">"data": [</div>
                    <div className="pl-8 text-blue-300">{"{"} "id": "d_123", "title": "50% OFF Coffee", "distance": "0.4km" {"}"}</div>
                    <div className="pl-4">]</div>
                    <div>{"}"}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Merchant Tab Content */}
          <div className={cn("transition-all duration-500 absolute inset-0 p-8", activeTab === 'merchant' ? "opacity-100 z-10 translate-y-0" : "opacity-0 pointer-events-none translate-y-4")}>
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Merchant Control Center</h3>
            </div>
            <p className="text-white/60 mb-8 max-w-lg">
              Publish campaigns in 60 seconds. Track scans, monitor redemptions, and measure ROI with unparalleled granularity.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-white/40 text-xs uppercase mb-1">Active Deals</div>
                <div className="text-3xl font-bold text-white mb-2">24</div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <span>+3 this week</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-white/40 text-xs uppercase mb-1">Total Scans</div>
                <div className="text-3xl font-bold text-white mb-2">1,492</div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <span>+12.4% vs last week</span>
                </div>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-5 mt-2 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium mb-1">QR Scanning Terminal</div>
                  <div className="text-white/60 text-sm">Validates deals instantly with cryptographic security.</div>
                </div>
                <ShieldCheck className="w-10 h-10 text-blue-400 opacity-50" />
              </div>
            </div>
          </div>

          {/* Partner Tab Content */}
          <div className={cn("transition-all duration-500 absolute inset-0 p-8", activeTab === 'partner' ? "opacity-100 z-10 translate-y-0" : "opacity-0 pointer-events-none translate-y-4")}>
             <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Partner Monetization</h3>
            </div>
            <p className="text-white/60 mb-8 max-w-lg">
              Embed deals into your product and earn 70% of the commission on every successful redemption. Fully automated payouts.
            </p>
            
            <div className="relative bg-black/40 border border-white/10 rounded-xl p-6 overflow-hidden">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <div className="text-white/40 text-sm mb-1">Unbilled Earnings</div>
                  <div className="text-4xl font-bold text-emerald-400">$4,289.50</div>
                </div>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition">
                  Withdraw
                </button>
              </div>
              
              <div className="w-full h-24 flex items-end gap-2">
                {[40, 70, 45, 90, 65, 110, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500/40 transition-colors group relative" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      +${h * 2}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
