'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, Filter, AlertCircle, ArrowUpRight } from 'lucide-react';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function MerchantTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeEnv, setActiveEnv] = useState<'production' | 'sandbox'>('production');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/merchant/transactions?environment=${activeEnv}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch transactions');
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeEnv]);

  return (
    <div className="space-y-8 pb-10 transition-all duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            {activeEnv === 'production' ? (
              <>View all your live redemptions and sales.</>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                <AlertCircle className="w-4 h-4" /> Sandbox / Developer Simulation Mode
              </span>
            )}
          </p>
        </div>

        <div className="flex bg-secondary/50 p-1 rounded-2xl border border-border shrink-0">
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

      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
          <h2 className="text-lg font-bold">Transaction History</h2>
          <button 
            onClick={fetchTransactions} 
            disabled={loading}
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="p-12 text-center text-destructive">
            <AlertCircle className="w-8 h-8 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Transactions Found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              You haven't processed any {activeEnv === 'sandbox' ? 'test ' : ''}transactions yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase tracking-widest bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 font-black">Date</th>
                  <th className="px-6 py-4 font-black">Transaction ID</th>
                  <th className="px-6 py-4 font-black">Deal</th>
                  <th className="px-6 py-4 font-black text-right">Amount</th>
                  <th className="px-6 py-4 font-black text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{formatDate(tx.createdAt)}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(tx.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono bg-secondary px-2 py-1 rounded tracking-tighter cursor-copy">
                        {tx._id}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{tx.dealId?.title || 'Unknown Deal'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold">{formatCurrency(tx.amount)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full",
                        tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      )}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
