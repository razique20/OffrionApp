'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Shield, 
  Zap, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // New Webhook Form
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    environment: 'production',
    events: ['deal.redeemed', 'commission.earned']
  });

  const [showSecretId, setShowSecretId] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/partner/webhooks');
      if (!res.ok) throw new Error('Failed to fetch webhooks');
      const data = await res.json();
      setWebhooks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const res = await fetch('/api/partner/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWebhook)
      });
      if (!res.ok) throw new Error('Failed to create webhook');
      
      setSuccess('Webhook configured successfully');
      setNewWebhook({ url: '', environment: 'production', events: ['deal.redeemed', 'commission.earned'] });
      fetchWebhooks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;
    try {
      const res = await fetch(`/api/partner/webhooks?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete webhook');
      fetchWebhooks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-3xl p-6 sticky top-8">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Add Webhook Endpoint
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold ml-1">Payload URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://your-api.com/webhooks/offrion"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold ml-1">Environment</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewWebhook({ ...newWebhook, environment: 'production' })}
                    className={cn(
                      "py-2 rounded-lg text-[10px] font-bold border transition-all",
                      newWebhook.environment === 'production' ? "bg-primary text-white border-primary" : "bg-secondary/30 border-border text-muted-foreground"
                    )}
                  >
                    Production
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewWebhook({ ...newWebhook, environment: 'sandbox' })}
                    className={cn(
                      "py-2 rounded-lg text-[10px] font-bold border transition-all",
                      newWebhook.environment === 'sandbox' ? "bg-amber-500 text-white border-amber-500" : "bg-secondary/30 border-border text-muted-foreground"
                    )}
                  >
                    Sandbox
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-premium-gradient text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Endpoint"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border space-y-3">
               <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>Payloads signed with HMAC-SHA256</span>
               </div>
               <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span>Instant delivery (sub-100ms)</span>
               </div>
            </div>
          </div>
        </div>

        {/* Webhooks List */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <p>{success}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
            </div>
          ) : webhooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-card border border-border border-dashed rounded-[40px] text-center">
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6">
                <Globe className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold">No Webhooks Found</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">Configure where Offrion should send real-time event notifications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook._id} className="p-6 bg-card border border-border rounded-3xl hover:border-primary/30 transition-all relative overflow-hidden group">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        webhook.environment === 'sandbox' ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                      )}>
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-base truncate max-w-[300px]">{webhook.url}</h4>
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                            webhook.environment === 'sandbox' ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                          )}>
                            {webhook.environment}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Active
                          </span>
                          <span>•</span>
                          <span>{webhook.enabledEvents?.length} events subscribed</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleDelete(webhook._id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Webhook Secret</label>
                         <button 
                          onClick={() => setShowSecretId(showSecretId === webhook._id ? null : webhook._id)}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                         >
                            {showSecretId === webhook._id ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Reveal</>}
                         </button>
                      </div>
                      <div className="bg-secondary/50 rounded-xl px-3 py-2 border border-border flex items-center justify-between font-mono text-[10px]">
                        <span className="truncate mr-2">
                          {showSecretId === webhook._id ? webhook.secret : 'whsec_' + '•'.repeat(24)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end">
                       <button className="w-full py-2 bg-secondary hover:bg-primary/5 text-[11px] font-bold rounded-xl border border-border transition-all flex items-center justify-center gap-2 group/btn">
                          View Delivery Logs 
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-all" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
