'use client';

import React, { useState } from 'react';
import { Car, Wallet, Plane, Layers, Terminal, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const USE_CASES = [
  {
    id: 'mobility',
    icon: Car,
    color: 'text-primary',
    darkColor: 'text-primary',
    bgColor: 'bg-primary/20',
    title: 'Ride-Sharing & Mobility',
    description: "Query the API using the rider's drop-off coordinates. Display targeted restaurant and activity discounts perfectly timed for arrival.",
    request: `GET /api/deals
  ?lat=40.7128
  &lng=-74.0060
  &radius=2000
  &tags=dining`,
    response: `{
  "page": 1,
  "count": 1,
  "deals": [
    {
      "_id": "64f3c8a9e...",
      "title": "20% OFF Joe's Pizza",
      "discountPercentage": 20,
      "validUntil": "2024-12-31"
    }
  ]
}`
  },
  {
    id: 'wallet',
    icon: Wallet,
    color: 'text-primary/80',
    darkColor: 'text-primary/70',
    bgColor: 'bg-secondary/40',
    title: 'Neo-banks & Wallets',
    description: "Embed a high-converting rewards tab. Offrion handles the merchant acquisition while you capture the transaction commission.",
    request: `POST /api/partners/track-conversion
{
  "dealId": "64f3c8a9e...",
  "amount": 45.50,
  "currency": "USD",
  "metadata": {
    "userId": "usr_7729aB"
  }
}`,
    response: `{
  "message": "Conversion tracked",
  "transactionId": "64f4d2b...",
  "redeemCode": "A7X9BN",
  "status": "pending"
}`
  },
  {
    id: 'travel',
    icon: Plane,
    color: 'text-primary/90',
    darkColor: 'text-primary/80',
    bgColor: 'bg-primary/10',
    title: 'Travel & Hospitality',
    description: "Enhance booking confirmations with local perks. Automatically fetch deals within a 2-mile radius of the booked hotel.",
    request: `GET /api/deals
  ?lat=48.8566
  &lng=2.3522
  &radius=5000
  &tags=experiences`,
    response: `{
  "page": 1,
  "count": 1,
  "deals": [
    {
      "_id": "65e2a1b...",
      "title": "Seine River Cruise",
      "dealType": "exclusive",
      "discountPercentage": 50
    }
  ]
}`
  },
  {
    id: 'superapp',
    icon: Layers,
    color: 'text-primary',
    darkColor: 'text-primary/90',
    bgColor: 'bg-secondary/30',
    title: 'Super Apps',
    description: "Create an infinite-scrolling deals marketplace powered entirely by our backend infrastructure. Leverage our global network instantly.",
    request: `GET /api/deals
  ?activeNow=true
  &limit=50`,
    response: `{
  "page": 1,
  "total": 1240,
  "count": 50,
  "deals": [
    {
      "title": "Nike Store - 30% Off",
      "originalPrice": 100,
      "discountedPrice": 70
    },
    ...49 more items
  ]
}`
  }
];

export function ApiUseCases() {
  const [activeId, setActiveId] = useState(USE_CASES[0].id);

  return (
    <div className="w-full relative mt-12">
      <div className="relative bg-transparent dark:bg-[#0A0A0B] border border-transparent dark:border-white/10 rounded-[2rem] overflow-hidden flex flex-col lg:flex-row min-h-[540px]">
        
        {/* Navigation Tabs (Sidebar) */}
        <div className="w-full lg:w-72 bg-secondary/30 dark:bg-white/5 border-b lg:border-b-0 lg:border-r border-border dark:border-white/10 p-4 lg:p-6 flex flex-row lg:flex-col gap-2 lg:gap-4 overflow-x-auto lg:overflow-visible custom-scrollbar [&::-webkit-scrollbar]:hidden shrink-0 z-20">
          {USE_CASES.map((uc) => {
            const isActive = uc.id === activeId;
            const Icon = uc.icon;
            return (
              <button
                key={uc.id}
                onClick={() => setActiveId(uc.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 lg:py-4 rounded-xl text-sm transition-all whitespace-nowrap lg:whitespace-normal text-left",
                  isActive 
                    ? `bg-background dark:bg-white/10 ${uc.color} border border-border dark:border-white/10 shadow-sm dark:shadow-none` 
                    : "text-muted-foreground dark:text-white/60 hover:bg-secondary/50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white border border-transparent"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{uc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="w-full relative flex-1 min-h-[540px] lg:min-h-0 bg-transparent dark:bg-black/40">
          
          {USE_CASES.map((uc) => {
            const isActive = uc.id === activeId;
            return (
              <div 
                key={uc.id} 
                className={cn(
                  "transition-all duration-500 absolute inset-0 p-8 flex flex-col", 
                  isActive ? "opacity-100 z-10 translate-y-0" : "opacity-0 pointer-events-none translate-y-4"
                )}
              >
                <div className="flex items-center gap-2 mb-6">
                  <uc.icon className={cn("w-5 h-5", uc.color)} />
                  <h3 className="text-xl font-bold text-foreground dark:text-white">{uc.title}</h3>
                </div>
                <p className="text-muted-foreground dark:text-white/60 mb-8 max-w-lg">
                  {uc.description}
                </p>

                {/* ALWAYS DARK TERMINAL WINDOW */}
                <div className="bg-[#0A0A0B] border border-white/10 rounded-xl overflow-hidden font-mono text-sm flex-1 flex flex-col shadow-2xl">
                  {/* Editor Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <Code2 className="w-4 h-4 ml-2 text-white/40" />
                    <div className="text-white/40 text-xs">api-integration.ts</div>
                  </div>

                  {/* Editor Body */}
                  <div className="p-6 flex flex-col flex-1 overflow-y-auto">
                    {/* Request */}
                    <div className="mb-8">
                      <div className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> Request
                      </div>
                      <div className="text-white/80 whitespace-pre font-mono text-sm">
                        <span className={cn("font-bold", uc.darkColor)}>{uc.request.split(' ')[0]}</span> {uc.request.substring(uc.request.indexOf(' ') + 1)}
                      </div>
                    </div>

                    {/* Response */}
                    <div className="flex-1 flex flex-col">
                      <div className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> Response
                      </div>
                      <div className="text-white/80 whitespace-pre flex-1 text-[13px] leading-snug">
                        {uc.response}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
