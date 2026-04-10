'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Terminal, 
  Search, 
  List,
  AlertCircle,
  Loader2,
  Zap,
  Info,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const PUBLIC_ENDPOINTS = [
  { id: 'deals', name: 'List Deals', method: 'GET', path: '/api/deals', params: ['categoryId', 'search', 'minDiscount'] },
  { id: 'categories', name: 'List Categories', method: 'GET', path: '/api/categories', params: [] },
  { id: 'search', name: 'Search Deals', method: 'GET', path: '/api/deals/search', params: ['q', 'lat', 'lng', 'radius'] },
  { id: 'fomo', name: 'Recent Activity', method: 'GET', path: '/api/deals/fomo', params: ['limit'] },
];

// This is a restricted "Sandbox Demo" key used for the public playground
// In a real production environment, this would be a restricted key with limited permissions
const DEMO_KEY = 'offrion_demo_sandbox_8k92j3l4n5m6';

export function PublicApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(PUBLIC_ENDPOINTS[0]);
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [manualApiKey, setManualApiKey] = useState('');
  const [useManualKey, setUseManualKey] = useState(false);

  useEffect(() => {
    setParams({});
    setResponse(null);
  }, [selectedEndpoint]);

  const handleTest = async () => {
    const apiKey = useManualKey ? manualApiKey : DEMO_KEY;
    if (useManualKey && !manualApiKey) {
      alert("Please enter a Sandbox API key from your partner dashboard.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      let url = selectedEndpoint.path;
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) queryParams.append(k, v);
      });
      if (queryParams.toString()) url += `?${queryParams.toString()}`;

      const res = await fetch(url, {
        method: selectedEndpoint.method,
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Configuration */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              Public Request Builder
            </h3>

            <div className="space-y-6">
              {/* API Key Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold ml-1">Authentication</label>
                  <button 
                    onClick={() => setUseManualKey(!useManualKey)}
                    className="text-[10px] text-primary hover:underline font-bold"
                  >
                    {useManualKey ? "Switch to Demo Key" : "Use my own Sandbox Key"}
                  </button>
                </div>

                {useManualKey ? (
                  <div className="space-y-2">
                    <input 
                      type="password"
                      placeholder="Paste your offrion_sandbox_... key here"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                      value={manualApiKey}
                      onChange={(e) => setManualApiKey(e.target.value)}
                    />
                    <p className="text-[9px] text-muted-foreground italic px-1">
                      Taken from your <Link href="/partner/dashboard" className="text-primary hover:underline">Connectivity Dashboard</Link>.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-secondary/50 border border-border rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[11px] font-mono text-muted-foreground">Using Restricted Demo Key</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Endpoint Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold ml-1">Endpoint</label>
                <div className="space-y-1.5">
                  {PUBLIC_ENDPOINTS.map(ep => (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEndpoint(ep)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                        selectedEndpoint.id === ep.id 
                          ? "bg-primary/5 border-primary ring-1 ring-primary/20" 
                          : "bg-background border-border hover:bg-secondary"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-[4px] text-[9px] font-bold font-mono uppercase">
                          {ep.method}
                        </span>
                        <span className="font-bold text-xs">{ep.name}</span>
                      </div>
                      <code className="text-[9px] text-muted-foreground">{ep.path}</code>
                    </button>
                  ))}
                </div>
              </div>

              {/* Params */}
              {selectedEndpoint.params.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Query Parameters</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedEndpoint.params.map(p => (
                      <div key={p} className="space-y-1">
                        <label className="text-[10px] font-bold ml-1">{p}</label>
                        <input 
                          type="text"
                          placeholder={`Enter ${p}...`}
                          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                          value={params[p] || ''}
                          onChange={(e) => setParams({...params, [p]: e.target.value})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={handleTest}
                disabled={loading}
                className="px-5 py-2.5 bg-premium-gradient text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                <Zap className={cn("w-4 h-4 fill-white", loading && "animate-pulse")} />
                {loading ? 'Executing...' : 'Run Demo Request'}
              </button>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  This public sandbox is limited to discovery endpoints. <strong>Create a free Partner Account</strong> to test conversion tracking, webhooks, and payouts with your own keys.
                </p>
              </div>
            </div>
          </div>
          
          <Link 
            href="/auth/register"
            className="group block p-6 bg-premium-gradient rounded-3xl text-white shadow-xl hover:translate-y-[-2px] transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Join the Network</h4>
                <p className="text-white/70 text-[11px] mt-1">Get your own API keys and start building today.</p>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Response Viewer */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden flex flex-col h-full min-h-[450px] shadow-2xl">
            <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500/50"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Live Output</span>
              </div>
              {response && (
                <div className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold font-mono",
                  response.status >= 200 && response.status < 300 ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"
                )}>
                  {response.status} {response.statusText}
                </div>
              )}
            </div>
            <div className="flex-1 p-5 font-mono text-[10px] overflow-auto">
              {!response && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center space-y-3 px-8">
                  <Terminal className="w-10 h-10 opacity-20" />
                  <p className="max-w-[200px]">Select an endpoint and click "Run Demo Request" to see results.</p>
                </div>
              )}
              {loading && (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Executing Request...</span>
                  </div>
                </div>
              )}
              {response && (
                <pre className="text-primary leading-relaxed whitespace-pre pr-4">
                  {JSON.stringify(response.data || response.error, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
