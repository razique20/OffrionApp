'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Key, 
  Copy, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  Code,
  Terminal,
  Activity,
  Zap
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export default function PartnerDashboard() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/partner/keys')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch keys');
        return json;
      })
      .then(json => {
        if (Array.isArray(json)) {
          setKeys(json);
        } else {
          console.error('Expected array of keys, got:', json);
          setKeys([]);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const generateKey = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/partner/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Key_${Date.now()}` }),
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || 'Generation failed');
      
      if (json.apiKey) {
        setKeys([json.apiKey, ...keys]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">API Requests (24h)</p>
            <h3 className="text-2xl font-bold">12,482</h3>
          </div>
        </div>
        <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Avg Latency</p>
            <h3 className="text-2xl font-bold">42ms</h3>
          </div>
        </div>
        <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Success Rate</p>
            <h3 className="text-2xl font-bold">99.9%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Keys */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Keys
            </h2>
            <button 
              onClick={generateKey}
              disabled={generating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate New Key'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {keys.length === 0 ? (
              <div className="p-12 text-center bg-secondary/50 border border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground italic">No API keys generated yet.</p>
              </div>
            ) : (
              keys.map((k) => (
                <div key={k.id || k._id} className="p-5 bg-card border border-border rounded-2xl group hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold">{k.name}</h4>
                      <p className="text-xs text-muted-foreground">Created on {formatDate(k.createdAt)}</p>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary p-3 rounded-xl">
                    <code className="text-xs font-mono flex-1 overflow-hidden truncate">
                      {k.key}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(k.key)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      {copied === k.key ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Integration */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Quick Start
          </h2>
          
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border-b border-slate-800">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-mono text-slate-300">Fetch Deals API</span>
            </div>
            <div className="p-6">
              <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
                {`curl -X GET "https://api.offrion.com/api/deals?lat=40.7128&lng=-74.0060" \\
  -H "x-api-key: YOUR_API_KEY"`}
              </pre>
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Security Note
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your API keys carry significant privileges. Ensure they are stored securely and never exposed in client-side code without appropriate proxying.
            </p>
            <Link href="/partner/docs" className="inline-block mt-4 text-primary font-bold text-sm hover:underline">
              Read Governance Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
