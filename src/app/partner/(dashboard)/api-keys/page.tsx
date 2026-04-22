'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  Zap,
  Eye,
  EyeOff,
  Loader2,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [isSandbox, setIsSandbox] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);

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

  const filteredKeys = keys;

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
          isSandbox
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
    if (!confirm('Are you sure you want to revoke this API key? This will break any existing production integrations.')) return;
    
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

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-foreground" />
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage your credentials for integrations.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Key Form */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-3xl p-6 sticky top-8">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-foreground" />
              New API Key
            </h3>

            <form onSubmit={handleGenerateKey} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold ml-1">Key Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. My Mobile App"
                  className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between p-2.5 bg-secondary/30 border border-border rounded-md mb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Sandbox Mode</span>
                  <span className="text-[9px] text-muted-foreground font-medium">Use dummy data for testing</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSandbox(!isSandbox)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all relative",
                    isSandbox ? "bg-emerald-500" : "bg-muted"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                    isSandbox ? "left-6" : "left-1"
                  )} />
                </button>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-2.5 bg-secondary text-foreground border border-border rounded-md text-[13px] font-bold shadow-none hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Generate API Key</>}
              </button>
            </form>
          </div>
        </div>

        {/* Keys List */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-3 text-destructive text-sm">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {filteredKeys.length === 0 ? (
            <div className="relative group/tour">
              <div className="flex flex-col items-center justify-center p-20 bg-card border border-border border-dashed rounded-md text-center">
                <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6">
                  <Key className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold">No API Keys</h3>
                <p className="text-muted-foreground mt-2 max-w-xs">Generate your first key to start your integration.</p>
              </div>
              
              {/* Quick Start Tour Overlay */}
              <div className="absolute -top-12 -left-8 md:-left-12 p-6 bg-secondary text-foreground border border-border rounded-md shadow-none shadow-primary/40 max-w-[280px] animate-bounce-slow z-20 hidden group-hover/tour:block lg:block">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 fill-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Quick Start Guide</span>
                </div>
                <p className="text-xs font-bold leading-relaxed">
                  To begin your integration, use the form on the left to name and generate your first API key.
                </p>
                <div className="absolute -bottom-2 translate-x-12 w-4 h-4 bg-primary rotate-45 shadow-none"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKeys.map((key) => {
                const displayId = key._id || key.id;
                const isRevealed = showKeyId === displayId;
                return (
                  <div 
                    key={displayId} 
                    className={cn("p-5 bg-card border border-border rounded-md transition-all hover:border-primary/30 shadow-none", !key.isActive && "opacity-60 grayscale bg-muted/30")}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground shadow-none">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] truncate max-w-[140px] text-foreground">{key.name}</h4>
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full",
                            key.isSandbox ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20" : "text-foreground bg-muted border border-border"
                          )}>
                            {key.isSandbox ? "Sandbox Environment" : "Live Environment"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleKeyStatus(displayId, key.isActive)} className={cn("p-2 rounded-lg transition-all text-[10px] font-bold", key.isActive ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive" : "text-white hover:bg-secondary")} title={key.isActive ? "Deactivate" : "Activate"}>
                          {key.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDeleteKey(displayId)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-secondary/30 border border-border/50 rounded-md">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Claims Completed</p>
                         <p className="text-lg font-black text-foreground">{key.claimsCount || 0}</p>
                      </div>
                      <div className="p-3 bg-secondary/30 border border-border/50 rounded-md">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">API Usage (24h)</p>
                         <p className="text-lg font-black text-foreground">{key.usageRate || 0}</p>
                      </div>
                    </div>

                    <div className="bg-secondary/40 rounded-md p-3 border border-border/40 flex items-center justify-between group/key">
                      <code className="text-[11px] font-mono truncate mr-2 text-muted-foreground">
                        {isRevealed ? key.key : 'offrion_' + '•'.repeat(16)}
                      </code>
                      <div className="flex items-center gap-1 opacity-0 group-hover/key:opacity-100 transition-all">
                        <button onClick={() => setShowKeyId(isRevealed ? null : displayId)} className="p-1.5 hover:bg-background rounded-md text-muted-foreground">
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => copyToClipboard(key.key)} className={cn("p-1.5 rounded-md", copiedKey === key.key ? "bg-secondary text-white border border-border" : "hover:bg-background text-muted-foreground")}>
                          {copiedKey === key.key ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
  );
}
