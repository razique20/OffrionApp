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
  Zap,
  DollarSign,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn, formatDate, formatCurrency } from '@/lib/utils';

export default function PartnerDashboard() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiRequests, setApiRequests] = useState<number | null>(null);
  const [avgLatency, setAvgLatency] = useState<string>('—');
  const [successRate, setSuccessRate] = useState<string>('—');
  const [earnings, setEarnings] = useState<any>({ pending: 0, paid: 0 });
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transLoading, setTransLoading] = useState(true);
  const [activeEnv, setActiveEnv] = useState<'production' | 'sandbox'>('production');

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

  // Fetch analytics stats
  useEffect(() => {
    fetch(`/api/partner/analytics?period=7d&environment=${activeEnv}`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        const { impressions = 0, clicks = 0, conversions = 0 } = data.summary || {};
        setApiRequests(impressions + clicks + conversions);
        if (impressions + clicks + conversions > 0) {
          setSuccessRate(data.summary.conversionRate || '—');
        }
        if (data.summary.earnings) {
          setEarnings(data.summary.earnings);
          setTotalEarned(data.summary.lifetimeEarned || data.summary.totalEarned || 0);
        }
      })
      .catch(() => {});
  }, [activeEnv]);

  // Fetch transactions
  useEffect(() => {
    setTransLoading(true);
    fetch(`/api/partner/transactions?limit=5&environment=${activeEnv}`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setTransactions(data.transactions || []);
      })
      .catch(console.error)
      .finally(() => setTransLoading(false));
  }, [activeEnv]);

  const generateKey = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/partner/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: `Key_${Date.now()}`,
          environment: activeEnv 
        }),
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

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse font-bold tracking-tight">Initializing Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner Dashboard</h1>
          <p className="text-muted-foreground italic flex items-center gap-1.5">
            {activeEnv === 'production' ? 'Live Production Environment' : (
              <span className="flex items-center gap-1.5 text-amber-500 font-bold not-italic">
                <AlertCircle className="w-3.5 h-3.5" /> Dev-Simulation Mode
              </span>
            )}
          </p>
        </div>

        <div className="flex bg-secondary/50 p-1 rounded-2xl border border-border shadow-inner shrink-0">
          <button
            onClick={() => setActiveEnv('production')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              activeEnv === 'production' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full", activeEnv === 'production' ? "bg-primary" : "bg-muted-foreground/30")} />
            Production
          </button>
          <button
            onClick={() => setActiveEnv('sandbox')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              activeEnv === 'sandbox' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full", activeEnv === 'sandbox' ? "bg-amber-500" : "bg-muted-foreground/30")} />
            Sandbox
          </button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Earned</p>
            <h3 className="text-2xl font-bold">{formatCurrency(totalEarned)}</h3>
          </div>
        </div>
        <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Pending Payout</p>
            <h3 className="text-2xl font-bold">{formatCurrency(earnings.pending)}</h3>
          </div>
        </div>
        <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Conversion Rate</p>
            <h3 className="text-2xl font-bold">{successRate}</h3>
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
              className="px-4 py-2 bg-premium-gradient text-primary-foreground rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
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
            {keys.filter(k => (k.environment || 'production') === activeEnv).length === 0 ? (
              <div className="p-12 text-center bg-secondary/50 border border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground italic">No {activeEnv} keys generated yet.</p>
              </div>
            ) : (
              keys.filter(k => (k.environment || 'production') === activeEnv).map((k) => (
                <div key={k.id || k._id} className="p-5 bg-card border border-border rounded-2xl group hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold">{k.name}</h4>
                      <p className="text-xs text-muted-foreground">Created on {formatDate(k.createdAt)}</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
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
                      {copied === k.key ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
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

      {/* Recent Deal Claims */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Recent Deal Claims</h3>
            <p className="text-sm text-muted-foreground">Track your referred customer redemptions.</p>
          </div>
          <Link href="/partner/analytics" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View All Analytics <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30">
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Deal</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Code</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Date</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Status</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6 h-16 bg-secondary/10"></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-muted-foreground italic">
                    No transactions found yet. Try tracking a conversion via API.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t._id} className="group hover:bg-secondary/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{t.dealId?.title || 'Unknown Deal'}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">ID: {t._id.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs font-bold bg-secondary px-2 py-1 rounded text-primary">
                        {t.qrCode || 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-muted-foreground">
                      {formatDate(t.createdAt)}
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        t.status === 'completed' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                      )}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-sm text-primary">
                      {formatCurrency((t.amount * (t.dealId?.commissionPercentage || 10)) / 100 * 0.7)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
