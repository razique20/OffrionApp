'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Terminal, 
  Key as KeyIcon, 
  Search, 
  Activity, 
  List,
  AlertCircle,
  Loader2,
  ChevronDown,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface Endpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  params: string[];
  body?: any;
}

const ENDPOINTS: Endpoint[] = [
  { id: 'deals', name: 'List Deals', method: 'GET', path: '/api/deals', params: ['categoryId', 'search', 'lat', 'lng', 'radius', 'minDiscount'] },
  { id: 'categories', name: 'List Categories', method: 'GET', path: '/api/categories', params: [] },
  { id: 'track-click', name: 'Track Click', method: 'POST', path: '/api/partners/track-click', params: [], body: { dealId: '' } },
  { id: 'track-conversion', name: 'Track Conversion', method: 'POST', path: '/api/partners/track-conversion', params: [], body: { dealId: '', amount: 0 } },
];

export function ApiPlayground() {
  const [keys, setKeys] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [params, setParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingKeys, setFetchingKeys] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchKeys();
  }, []);

  useEffect(() => {
    if (selectedEndpoint.body) {
      setRequestBody(JSON.stringify(selectedEndpoint.body, null, 2));
    } else {
      setRequestBody('');
    }

    // Initialize params from URL first, then fall back to empty
    const initialParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (selectedEndpoint.params.includes(key)) {
        initialParams[key] = value;
      }
    });

    // Special case for missing radius mapper
    if (searchParams.has('radius') && selectedEndpoint.id === 'deals') {
      initialParams.radius = searchParams.get('radius') || '';
    }

    setParams(initialParams);
  }, [selectedEndpoint, searchParams]);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/partner/keys');
      if (res.ok) {
        const data = await res.json();
        const sandboxKeys = data.filter((k: any) => k.environment === 'sandbox' && k.isActive);
        setKeys(sandboxKeys);
        if (sandboxKeys.length > 0) setSelectedKey(sandboxKeys[0].key);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingKeys(false);
    }
  };

  const handleTest = async () => {
    if (!selectedKey) return;
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
          'x-api-key': selectedKey,
          'Content-Type': 'application/json',
        },
        body: selectedEndpoint.method === 'POST' ? requestBody : undefined,
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Configuration */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              Request Builder
            </h3>

            <div className="space-y-6">
              {/* API Key Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold ml-1 flex items-center gap-2">
                  <KeyIcon className="w-3 h-3" /> Sandbox Key
                </label>
                {fetchingKeys ? (
                  <div className="h-10 bg-secondary animate-pulse rounded-xl" />
                ) : keys.length === 0 ? (
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3 text-[10px] text-amber-600 italic">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Please create a Sandbox API key first.
                  </div>
                ) : (
                  <select 
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    {keys.map(k => (
                      <option key={k._id} value={k.key}>{k.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Endpoint Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold ml-1">Endpoint</label>
                <div className="space-y-1.5">
                  {ENDPOINTS.map(ep => (
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
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold font-mono",
                          ep.method === 'POST' ? "bg-blue-500/10 text-blue-500" : "bg-primary/10 text-primary"
                        )}>
                          {ep.method}
                        </span>
                        <span className="font-bold text-xs">{ep.name}</span>
                      </div>
                      <code className="text-[9px] text-muted-foreground">{ep.path}</code>
                    </button>
                  ))}
                </div>
              </div>

              {/* Params / Body */}
              {selectedEndpoint.params.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Query Parameters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEndpoint.params.map(p => (
                      <div key={p} className="space-y-1">
                        <label className="text-[10px] font-bold ml-1">{p}</label>
                        <input 
                          type="text"
                          placeholder={p}
                          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                          value={params[p] || ''}
                          onChange={(e) => setParams({...params, [p]: e.target.value})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEndpoint.method === 'POST' && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Request Body (JSON)</h4>
                  <textarea 
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full h-24 bg-slate-950 text-primary font-mono text-[10px] rounded-xl p-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              )}

              <button 
                onClick={handleTest}
                disabled={loading || !selectedKey}
                className="px-5 py-2.5 bg-premium-gradient text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                <Zap className={cn("w-4 h-4 fill-white", loading && "animate-pulse")} />
                {loading ? 'Running...' : 'Run Request'}
              </button>
            </div>
          </div>
        </div>

        {/* Response Viewer */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden flex flex-col h-full min-h-[500px] shadow-2xl">
            <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500/50"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">HTTP Response</span>
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
                  <p className="max-w-[200px]">Select an endpoint and click "Run Request" to see results.</p>
                </div>
              )}
              {loading && (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Executing...</span>
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
