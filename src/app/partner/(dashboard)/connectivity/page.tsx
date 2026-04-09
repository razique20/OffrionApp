'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Shield, 
  Zap,
  MoreVertical,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  Terminal,
  Lightbulb
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { ApiPlayground } from '@/components/ApiPlayground';
import { GeoDiscoveryMap } from '@/components/partner/GeoDiscoveryMap';
import { WebhookManagement } from '@/components/partner/WebhookManagement';

type TabType = 'keys' | 'playground' | 'discovery' | 'webhooks';

function ConnectivityContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get('tab') as TabType) || 'keys';
  const envParam = searchParams.get('env') === 'sandbox' ? 'sandbox' : 'production';
  
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<'production' | 'sandbox'>(envParam);
  const [generating, setGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);

  // Update environment when search params change
  useEffect(() => {
    setNewKeyEnvironment(envParam);
  }, [envParam]);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/partner/keys', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch keys');
      setKeys(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    
    setGenerating(true);
    try {
      const res = await fetch('/api/partner/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          name: newKeyName,
          environment: newKeyEnvironment 
        }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to generate key');
      
      setKeys([data.apiKey, ...keys]);
      setNewKeyName('');
      setShowKeyId(data.apiKey.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone and will break any existing integrations using this key.')) return;
    
    try {
      const res = await fetch(`/api/partner/keys/${id}`, { 
        method: 'DELETE' ,
        credentials: 'include'
      });
      if (res.ok) {
        setKeys(keys.filter(k => (k._id || k.id) !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleKeyStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/partner/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setKeys(keys.map(k => (k._id || k.id) === id ? { ...k, isActive: !currentStatus } : k));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const setTab = (tab: TabType) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
  };

  const setEnv = (env: 'production' | 'sandbox') => {
    const params = new URLSearchParams(searchParams);
    params.set('env', env);
    router.push(`?${params.toString()}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Connectivity</h1>
          <p className="text-muted-foreground">Manage your API keys and test integrations in the playground.</p>
        </div>

        <div className="flex bg-secondary/50 p-1 rounded-2xl border border-border w-fit">
          <button
            onClick={() => setTab('keys')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === 'keys' 
                ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            API Keys
          </button>
          <button
            onClick={() => setTab('playground')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === 'playground' 
                ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Playground
          </button>
          <button
            onClick={() => setTab('discovery')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === 'discovery' 
                ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Discovery Map
          </button>
          <button
            onClick={() => setTab('webhooks')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === 'webhooks' 
                ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Webhooks
          </button>
        </div>
      </div>

      {activeTab === 'keys' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl border border-border w-fit mb-4">
            <button
              onClick={() => setEnv('production')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                envParam === 'production' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Production
            </button>
            <button
              onClick={() => setEnv('sandbox')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                envParam === 'sandbox' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sandbox
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Key Form */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-3xl p-6 sticky top-8">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  New {envParam === 'sandbox' ? 'Sandbox' : 'Production'} Key
                </h3>
                <form onSubmit={handleGenerateKey} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold ml-1">Key Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mobile App"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={generating}
                    className="w-full py-2.5 bg-premium-gradient text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Generate New Key</>}
                  </button>
                </form>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Unlimited {envParam} keys</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Keys List */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              )}

              {keys.filter(k => (k.environment || 'production') === envParam).length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 bg-card border border-border border-dashed rounded-[40px] text-center">
                  <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6">
                    <Key className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-xl font-bold">No {envParam === 'sandbox' ? 'Sandbox' : 'Production'} Keys</h3>
                  <p className="text-muted-foreground mt-2 max-w-xs">Generate your first {envParam} key to start your integration.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {keys.filter(k => (k.environment || 'production') === envParam).map((key) => {
                    const displayId = key._id || key.id;
                    const isRevealed = showKeyId === displayId;
                    return (
                      <div 
                        key={displayId} 
                        className={cn("p-4 bg-card border border-border rounded-2xl transition-all hover:border-primary/30", !key.isActive && "opacity-60 grayscale bg-muted/30")}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", key.environment === 'sandbox' ? "bg-amber-500/10 text-amber-500" : "bg-premium-gradient shadow-sm")}>
                              <Zap className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-[13px] truncate max-w-[120px]">{key.name}</h4>
                              <span className={cn("text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md", key.environment === 'sandbox' ? "text-amber-500 bg-amber-500/5" : "text-white bg-premium-gradient shadow-sm")}>
                                {key.environment || 'production'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <button onClick={() => toggleKeyStatus(displayId, key.isActive)} className={cn("p-1.5 rounded-lg transition-all text-[10px] font-bold", key.isActive ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive" : "text-primary hover:bg-primary/10")} title={key.isActive ? "Deactivate" : "Activate"}>
                              {key.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => handleDeleteKey(displayId)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-secondary/30 rounded-xl p-2.5 border border-border/40 flex items-center justify-between group/key">
                          <code className="text-[10px] font-mono truncate mr-2 text-muted-foreground">{isRevealed ? key.key : 'offrion_' + '•'.repeat(12)}</code>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover/key:opacity-100 transition-all">
                            <button onClick={() => setShowKeyId(isRevealed ? null : displayId)} className="p-1 hover:bg-background rounded-md text-muted-foreground">
                              {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button onClick={() => copyToClipboard(key.key)} className={cn("p-1 rounded-md", copiedKey === key.key ? "bg-premium-gradient text-white" : "hover:bg-background text-muted-foreground")}>
                              {copiedKey === key.key ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'playground' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Intro Banner */}
           <div className="p-6 bg-primary/5 border border-primary/20 rounded-[32px] flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
              <Terminal className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold">Interactive Sandbox Environment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Test your integration using Sandbox keys. All data generated here is isolated from your production environment.
              </p>
            </div>
          </div>

          <ApiPlayground />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            <div className="p-8 bg-card border border-border rounded-[32px] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="font-bold text-lg">Pro Tip: Use Real IDs</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When testing tracking endpoints, try fetching real Deal IDs from the "List Deals" endpoint first. This ensures your analytics will be correctly mapped.
              </p>
            </div>
            
            <div className="p-8 bg-card border border-border rounded-[32px] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-blue-500" />
              </div>
              <h4 className="font-bold text-lg">Ready for Production?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once you're satisfied with your integration logic, simply swap your Sandbox Key for a Production Key in your environment variables.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'discovery' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
           <GeoDiscoveryMap trackingKey={keys.find(k => k.isActive)?.key} />
        </div>
      )}

      {activeTab === 'webhooks' && <WebhookManagement />}
    </div>
  );
}

export default function ConnectivityPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ConnectivityContent />
    </Suspense>
  );
}
