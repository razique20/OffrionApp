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
  const [generating, setGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<'production' | 'sandbox'>('production');

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

  const filteredKeys = keys.filter(k => (k.environment || 'production') === environment);

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
          environment: environment 
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
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage your credentials for {environment} integrations.</p>
        </div>

        <div className="flex bg-secondary/50 p-1 rounded-2xl border border-border">
          <button
            onClick={() => setEnvironment('production')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              environment === 'production' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            Production
          </button>
          <button
            onClick={() => setEnvironment('sandbox')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              environment === 'sandbox' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            Sandbox
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Key Form */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-3xl p-6 sticky top-8">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              New {environment === 'production' ? 'Production' : 'Sandbox'} Key
            </h3>

            <form onSubmit={handleGenerateKey} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold ml-1">Key Name</label>
                <input 
                  type="text" 
                  required
                  placeholder={environment === 'production' ? "e.g. Production Mobile App" : "e.g. Test iOS App"}
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
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Generate {environment === 'production' ? 'Production' : 'Sandbox'} Key</>}
              </button>
            </form>
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

          {filteredKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-card border border-border border-dashed rounded-[40px] text-center">
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6">
                <Key className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold">No {environment === 'production' ? 'Production' : 'Sandbox'} Keys</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">Generate your first {environment} key to start your integration.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKeys.map((key) => {
                const displayId = key._id || key.id;
                const isRevealed = showKeyId === displayId;
                return (
                  <div 
                    key={displayId} 
                    className={cn("p-5 bg-card border border-border rounded-2xl transition-all hover:border-primary/30 shadow-sm", !key.isActive && "opacity-60 grayscale bg-muted/30")}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-premium-gradient flex items-center justify-center text-white shadow-md">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] truncate max-w-[140px]">{key.name}</h4>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                            environment === 'production' ? "text-primary bg-primary/5" : "text-amber-500 bg-amber-500/5"
                          )}>
                            {environment === 'production' ? 'Live Environment' : 'Sandbox Integration'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleKeyStatus(displayId, key.isActive)} className={cn("p-2 rounded-lg transition-all text-[10px] font-bold", key.isActive ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive" : "text-primary hover:bg-primary/10")} title={key.isActive ? "Deactivate" : "Activate"}>
                          {key.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDeleteKey(displayId)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-secondary/40 rounded-xl p-3 border border-border/40 flex items-center justify-between group/key">
                      <code className="text-[11px] font-mono truncate mr-2 text-muted-foreground">
                        {isRevealed ? key.key : (key.environment === 'sandbox' ? 'offrion_sandbox_' : 'offrion_live_') + '•'.repeat(16)}
                      </code>
                      <div className="flex items-center gap-1 opacity-0 group-hover/key:opacity-100 transition-all">
                        <button onClick={() => setShowKeyId(isRevealed ? null : displayId)} className="p-1.5 hover:bg-background rounded-md text-muted-foreground">
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => copyToClipboard(key.key)} className={cn("p-1.5 rounded-md", copiedKey === key.key ? "bg-premium-gradient text-white" : "hover:bg-background text-muted-foreground")}>
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
