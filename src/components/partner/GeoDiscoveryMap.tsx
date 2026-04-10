'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Map as MapIcon, 
  Crosshair, 
  ChevronRight,
  Zap,
  Flame,
  MousePointer2,
  CheckCircle2,
  Loader2,
  X,
  FlaskConical
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

// Stylized Points of Interest in Dubai
const POI = [
  { id: 'dt', name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744, x: 70, y: 40 },
  { id: 'dm', name: 'Dubai Marina', lat: 25.0819, lng: 55.1367, x: 30, y: 75 },
  { id: 'pj', name: 'Palm Jumeirah', lat: 25.1124, lng: 55.1390, x: 25, y: 55 },
  { id: 'jbr', name: 'JBR', lat: 25.0763, lng: 55.1311, x: 20, y: 85 },
];

export function GeoDiscoveryMap({ trackingKey }: { trackingKey?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userLocation, setUserLocation] = useState(POI[0]);
  const [radius, setRadius] = useState(5); // km
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  
  // Real Tracking State
  const [claiming, setClaiming] = useState<string | null>(null);
  const [redeemCode, setRedeemCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNearbyDeals();
  }, [userLocation, radius]);

  const fetchNearbyDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/search?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radius}`);
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdvancedSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'playground');
    params.set('lat', userLocation.lat.toString());
    params.set('lng', userLocation.lng.toString());
    router.push(`?${params.toString()}`);
  };

  const handleDealClick = async (dealId: string) => {
    if (!trackingKey) {
      alert("Please generate an API Key first to enable live tracking simulation.");
      return;
    }

    setClaiming(dealId);
    setError(null);
    setRedeemCode(null);

    try {
      const res = await fetch('/api/partners/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': trackingKey
        },
        body: JSON.stringify({
          dealId,
          metadata: { source: 'playground_map' }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate transaction');

      setRedeemCode(data.redeemCode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sandbox Simulation Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Developer Simulation Mode</p>
            <p className="text-[10px] text-muted-foreground">Transactions created here use your Sandbox API key and will not trigger production payouts.</p>
          </div>
        </div>
        {!trackingKey && (
          <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-bold text-amber-600 uppercase tracking-widest animate-pulse">
            Sandbox Key Required
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 bg-card border border-border rounded-[40px] shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
      
      {/* Map Visualization (Left 2/3) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-primary" /> Geo-Discovery
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Simulate user location to discover hyper-local rewards.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Search Radius</p>
                <p className="text-sm font-bold text-primary">{radius} km</p>
             </div>
             <input 
              type="range" 
              min="1" 
              max="20" 
              value={radius} 
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-24 accent-primary"
             />
          </div>
        </div>

        {/* The "Map" SVG */}
        <div className="relative aspect-[16/10] bg-slate-950 rounded-[32px] border border-slate-800 overflow-hidden shadow-inner">
           {/* Grid Pattern */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Proximity Circle */}
              <circle 
                cx={userLocation.x} 
                cy={userLocation.y} 
                r={radius * 1.5} 
                className="fill-primary/5 stroke-primary/30 stroke-1 stroke-dasharray-[4,2] transition-all duration-700 ease-out"
              />
              <circle 
                cx={userLocation.x} 
                cy={userLocation.y} 
                r={2} 
                className="fill-primary animate-pulse shadow-lg"
              />
              
              {/* Point of Interest Markers */}
              {POI.map(p => (
                <g 
                  key={p.id} 
                  className="cursor-pointer group/poi" 
                  onClick={() => setUserLocation(p)}
                >
                  <circle cx={p.x} cy={p.y} r={1.5} className={cn("transition-colors", userLocation.id === p.id ? "fill-primary" : "fill-slate-700 hover:fill-slate-500")} />
                  <text x={p.x} y={p.y - 4} className="text-[2.5px] fill-slate-500 font-bold text-center uppercase tracking-tighter invisible group-hover/poi:visible" textAnchor="middle">{p.name}</text>
                </g>
              ))}

              {/* Deal Nodes */}
              {deals.map((deal) => {
                const dLng = deal.location.coordinates[0];
                const dLat = deal.location.coordinates[1];
                const dx = (dLng - 55.27) * 400 + 70; 
                const dy = (25.20 - dLat) * 400 + 40;

                return (
                  <g 
                    key={deal._id} 
                    className="cursor-pointer group/deal"
                    onMouseEnter={() => setActiveDealId(deal._id)}
                    onMouseLeave={() => setActiveDealId(null)}
                  >
                    <circle 
                      cx={dx} 
                      cy={dy} 
                      r={0.8} 
                      className={cn(
                        "transition-all duration-300",
                        activeDealId === deal._id ? "fill-primary r-1.5" : "fill-emerald-500"
                      )} 
                    />
                    <circle 
                      cx={dx} 
                      cy={dy} 
                      r={4} 
                      className="fill-emerald-500/10 opacity-0 group-hover/deal:opacity-100 transition-opacity" 
                    />
                  </g>
                );
              })}
           </svg>

           {/* Location Tags */}
           <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {POI.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setUserLocation(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                    userLocation.id === p.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                  )}
                >
                  {p.name}
                </button>
              ))}
           </div>

           {/* Map Legend */}
           <div className="absolute bottom-4 left-6 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Pin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Reward</span>
              </div>
           </div>
        </div>
      </div>

      {/* Discovery Feed (Right 1/3) */}
      <div className="flex flex-col h-full space-y-6 border-l border-border pl-8">
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Nearby Matches
          </h4>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Sorted by Proximity</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[60vh] custom-scrollbar">
          {loading && deals.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-secondary/50 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-secondary/20 rounded-3xl">
              <Search className="w-8 h-8 text-muted-foreground opacity-20 mb-3" />
              <p className="text-xs text-muted-foreground">No rewards within {radius}km of this location.</p>
            </div>
          ) : (
            deals.map((deal) => (
              <div 
                key={deal._id}
                onMouseEnter={() => setActiveDealId(deal._id)}
                onMouseLeave={() => setActiveDealId(null)}
                onClick={() => handleDealClick(deal._id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all group/card cursor-pointer",
                  activeDealId === deal._id 
                    ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" 
                    : "bg-card border-border hover:border-primary/30"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{deal.categoryId?.name}</span>
                  {deal.eventType === 'flash' && <Flame className="w-3.5 h-3.5 text-orange-500" />}
                </div>
                <h5 className="text-[13px] font-bold truncate pr-4">{deal.title}</h5>
                <p className="text-[11px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter opacity-80">{deal.merchantId?.name}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm font-bold text-foreground">{formatCurrency(deal.discountedPrice)}</p>
                  <div className="p-1.5 bg-secondary rounded-lg group-hover/card:bg-primary group-hover/card:text-white transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 mt-auto">
          <button 
            onClick={handleOpenAdvancedSearch}
            className="w-full py-3 bg-secondary rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
            Open Advanced Search
          </button>
        </div>
      </div>

      {/* Redemption Success Overlay */}
      {redeemCode && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
          <div className="bg-card border border-primary/30 rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl relative">
            <button 
              onClick={() => setRedeemCode(null)}
              className="absolute top-6 right-8 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h4 className="text-2xl font-bold mb-3 tracking-tight">Sandbox Claim Initialized!</h4>
            <p className="text-sm text-muted-foreground mb-10 leading-relaxed">A <strong>Sandbox Transaction</strong> has been created in your account. Use the code below in the Merchant Terminal to complete the testing loop.</p>
            
            <div className="bg-secondary/50 rounded-[32px] p-8 border border-border/50 shadow-inner">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Merchant Verify Code</p>
              <p className="text-5xl font-black tracking-[0.25em] text-primary">{redeemCode}</p>
            </div>
            
            <div className="mt-10 p-5 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4 text-left">
              <Zap className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Test the Webhook</strong>: Copy this code and use it in the <span className="text-primary font-bold">Merchant Redemption Terminal</span> to trigger your real-time webhook notification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Claiming Loader */}
      {claiming && (
        <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-[10px] font-extrabold text-white uppercase tracking-widest">Generating Transaction...</p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
