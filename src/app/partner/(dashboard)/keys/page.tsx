'use client';

import React, { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export default function PartnerKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
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

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    
    setGenerating(true);
    try {
      const res = await fetch('/api/partner/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to generate key');
      
      setKeys([data.apiKey, ...keys]);
      setNewKeyName('');
      // Automatically show the new key
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
        setKeys(keys.filter(k => k._id !== id));
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
        setKeys(keys.map(k => k._id === id ? { ...k, isActive: !currentStatus } : k));
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
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Key Management</h1>
        <p className="text-muted-foreground mt-1">Generate and manage secure keys for your Deals-as-a-Service integration.</p>
      </div>

      {/* Hero Warning/Banner */}
      <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-[32px] flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
          <Shield className="w-8 h-8" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold">Security Best Practices</h3>
          <p className="text-sm text-muted-foreground mt-1">Never share your secret keys in public repositories or client-side code. Use environment variables on your server to keep them secure.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Key Form */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-[32px] p-8 sticky top-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              New API Key
            </h3>
            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Key Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Production Mobile App"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={generating}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Generate Key</>}
              </button>
            </form>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Unlimited testing keys</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>1,000 requests / hour / key</span>
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

          {keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-card border border-border border-dashed rounded-[40px] text-center">
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6">
                <Key className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold">No API Keys Yet</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">Generate your first key to start integrating Offrion Deals into your platform.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {keys.map((key) => {
                const isRevealed = showKeyId === (key._id || key.id);
                const displayId = key._id || key.id;
                
                return (
                  <div 
                    key={displayId} 
                    className={cn(
                      "group p-6 bg-card border border-border rounded-[32px] transition-all hover:shadow-xl hover:shadow-primary/5",
                      !key.isActive && "opacity-60 grayscale"
                    )}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                          <Key className={cn("w-6 h-6", key.isActive ? "text-primary" : "text-muted-foreground")} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{key.name}</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(key.createdAt)}</span>
                            <span className={cn(
                              "flex items-center gap-1 font-bold",
                              key.isActive ? "text-emerald-500" : "text-destructive"
                            )}>
                              <div className={cn("w-1.5 h-1.5 rounded-full", key.isActive ? "bg-emerald-500 animate-pulse" : "bg-destructive")} />
                              {key.isActive ? 'Active' : 'Revoked'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleKeyStatus(displayId, key.isActive)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                            key.isActive 
                              ? "bg-secondary text-foreground hover:bg-destructive/10 hover:text-destructive" 
                              : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          )}
                        >
                          {key.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteKey(displayId)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-3 p-4 bg-secondary/80 rounded-2xl border border-border/50 font-mono text-sm overflow-hidden group-hover:bg-secondary transition-all">
                        <div className="flex-1 truncate pr-20">
                          {isRevealed ? key.key : 'offrion_' + '•'.repeat(24)}
                        </div>
                        <div className="absolute right-4 flex items-center gap-2">
                          <button 
                            onClick={() => setShowKeyId(isRevealed ? null : displayId)}
                            className="p-2 hover:bg-background rounded-xl transition-all text-muted-foreground hover:text-foreground"
                          >
                            {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => copyToClipboard(key.key)}
                            className={cn(
                              "p-2 rounded-xl transition-all flex items-center gap-2",
                              copiedKey === key.key ? "bg-emerald-500 text-white" : "hover:bg-background text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {copiedKey === key.key ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
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
