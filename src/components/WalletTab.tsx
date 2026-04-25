'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  History, 
  Download, 
  Plus, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Wallet
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('@/components/partner/AnalyticsChart'), { 
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-secondary/20 animate-pulse rounded-md" />
});

export default function WalletTab({ role }: { role: 'partner' | 'merchant' }) {
  const [stats, setStats] = useState<any>(null);
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [topupAmount, setTopupAmount] = useState('100');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankStatus, setBankStatus] = useState<any>(null);

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [statsRes, ledgerRes, bankRes] = await Promise.all([
        fetch('/api/wallet/stats'),
        fetch('/api/wallet/transactions'),
        fetch('/api/wallet/bank')
      ]);
      
      const statsJson = await statsRes.json();
      const ledgerJson = await ledgerRes.json();
      const bankJson = await bankRes.json();
      
      if (!statsRes.ok) throw new Error(statsJson.error || 'Failed to fetch stats');
      if (!ledgerRes.ok) throw new Error(ledgerJson.error || 'Failed to fetch ledger');
      
      setStats(statsJson);
      setLedger(ledgerJson.ledger);
      setBankStatus(bankJson);
    } catch (err: any) {
      if (!silent) setError(err.message);
      else console.error('Silent Refresh Error:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleOnboard = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wallet/onboard', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Onboarding failed');
      
      // Redirect to Stripe
      window.location.href = json.url;
    } catch (err: any) {
      alert(err.message);
      setIsSubmitting(false);
    }
  };

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankStatus?.payoutsEnabled) {
      alert('Please complete your bank account setup in Stripe first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wallet/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(payoutAmount) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Payout failed');
      
      setIsPayoutModalOpen(false);
      setPayoutAmount('');
      // Use silent refresh to avoid global layout blink
      fetchData(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(topupAmount) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Top-up initialization failed');
      
      // Redirect to Stripe Checkout
      window.location.href = json.url;
    } catch (err: any) {
      alert(err.message);
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-foreground animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse">Accessing Secure Vault...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-destructive/5 border border-destructive/10 rounded-md text-center max-w-lg mx-auto mt-10">
      <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">Wallet Offline</h3>
      <p className="text-muted-foreground mb-6">{error}</p>
      <button onClick={() => fetchData()} className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-bold">Retry Connection</button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Treasury</h2>
          <p className="text-muted-foreground text-sm">Manage your balances and withdrawal settings.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={bankStatus?.isConnected ? () => setIsBankModalOpen(true) : handleOnboard}
            className="px-5 py-2.5 bg-secondary text-xs font-bold rounded-md hover:bg-secondary/80 transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> {bankStatus?.isConnected ? 'Manage Bank' : 'Link Bank Account'}
          </button>
          {role === 'merchant' && stats?.billingPreference === 'prepaid' ? (
            <button 
              onClick={() => setIsTopupModalOpen(true)}
              className="px-6 py-2.5 bg-secondary text-foreground border border-border text-xs font-bold rounded-md shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Credits
            </button>
          ) : role === 'merchant' && stats?.billingPreference === 'card_on_file' ? (
            <button 
              onClick={handleOnboard}
              className="px-6 py-2.5 bg-secondary text-foreground border border-border text-xs font-bold rounded-md shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Manage Card
            </button>
          ) : (
            <button 
              onClick={() => setIsPayoutModalOpen(true)}
              className="px-6 py-2.5 bg-secondary text-foreground border border-border text-xs font-bold rounded-md shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Withdraw Funds
            </button>
          )}
        </div>
      </div>

      {/* Balance Cards */}
      <div className={cn(
        "grid gap-6",
        role === 'partner' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      )}>
        {role === 'partner' ? (
          <>
            <StatCard 
              title="Cleared Balance" 
              value={formatCurrency(stats.withdrawableBalance)} 
              label="Available for withdrawal"
              icon={Wallet}
              color="text-white"
              bg="bg-secondary"
              primary
            />
            <StatCard 
              title="Pending Review" 
              value={formatCurrency(stats.pendingBalance)} 
              label="Incoming referrals"
              icon={Clock}
              color="text-amber-500"
              bg="bg-amber-500/10"
            />
            <StatCard 
              title="Total Earned" 
              value={formatCurrency(stats.totalEarned)} 
              label="All-time revenue"
              icon={TrendingUp}
              color="text-blue-500"
              bg="bg-blue-500/10"
            />
            <StatCard 
              title="Amount Withdrawn" 
              value={formatCurrency(stats.totalWithdrawn)} 
              label="Successful payouts"
              icon={Download}
              color="text-emerald-500"
              bg="bg-emerald-500/10"
            />
          </>
        ) : (
          <>
            <StatCard 
              title="Wallet Balance" 
              value={formatCurrency(stats?.balance || 0)} 
              label="Available for redemptions"
              icon={Wallet}
              color="text-white"
              bg="bg-secondary"
              primary
            />
            <StatCard 
              title="Total Sales" 
              value={formatCurrency(stats.totalSales)} 
              label="Gross volume"
              icon={DollarSign}
              color="text-blue-500"
              bg="bg-blue-500/10"
            />
            <StatCard 
              title="Commission Paid" 
              value={formatCurrency(stats.paidCommission)} 
              label="All-time fees"
              icon={History}
              color="text-emerald-500"
              bg="bg-emerald-500/10"
            />
            <StatCard 
              title="Accrued Liability" 
              value={formatCurrency(stats.accruedLiability || 0)} 
              label={stats?.creditLimit > 0 ? `Credit Limit: ${formatCurrency(stats.creditLimit)} max` : 'To be cleared manually'}
              icon={AlertCircle}
              color="text-amber-500"
              bg="bg-amber-500/10"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 p-8 bg-card border border-border rounded-md shadow-none">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Revenue Growth</h3>
              <div className="p-2 bg-secondary rounded-lg"><TrendingUp className="w-5 h-5 text-foreground" /></div>
           </div>
           <div className="w-full">
               <AnalyticsChart 
                  data={stats?.chartData || []} 
                  series={[{ key: 'val', name: 'Revenue', color: 'oklch(0.646 0.222 41.116)', gradient: true }]}
                  height={300}
               />
           </div>
        </div>

        {/* Security & Settings Card */}
        <div className="p-8 bg-card border border-border rounded-md shadow-none flex flex-col justify-between overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <CreditCard className="w-32 h-32" />
           </div>
           <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Payout Method</h3>
              <div className="p-4 bg-secondary/50 rounded-md border border-border mb-6">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center border border-border shadow-none">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-3" />
                    </div>
                    <span className="text-sm font-bold">{bankStatus?.bankInfo ? `${bankStatus.bankInfo.bankName} (**** ${bankStatus.bankInfo.last4})` : 'Stripe Connect'}</span>
                 </div>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Status: <span className={bankStatus?.payoutsEnabled ? "text-emerald-500" : "text-amber-500"}>{bankStatus?.payoutsEnabled ? 'Active' : 'Pending Setup'}</span></p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                  {bankStatus?.payoutsEnabled 
                    ? "Your bank is linked. Funds can be withdrawn to your account instantly."
                    : "Complete your onboarding on Stripe to enable payouts to your bank account."}
              </p>
           </div>
           <button 
            onClick={handleOnboard}
            className="w-full py-4 mt-8 bg-secondary text-xs font-bold rounded-md hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
           >
              {bankStatus?.isConnected ? 'Identity Verification' : 'Link Bank Account'} <ExternalLink className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Ledger */}
      <div className="p-8 bg-card border border-border rounded-md shadow-none">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Transaction Ledger</h3>
            <button className="p-2.5 bg-secondary rounded-md hover:bg-secondary/80 transition-all"><Download className="w-5 h-5 text-muted-foreground" /></button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                     <th className="pb-4 px-4">Description</th>
                     <th className="pb-4 px-4">Amount</th>
                     <th className="pb-4 px-4">Date</th>
                     <th className="pb-4 px-4 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  {ledger.map((item) => (
                     <tr key={item.id} className="border-b border-border/50 group hover:bg-secondary/20 transition-colors">
                        <td className="py-5 px-4">
                           <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-md flex items-center justify-center",
                                item.type === 'commission' ? "bg-secondary text-white" : "bg-red-500/10 text-red-500"
                              )}>
                                 {item.type === 'commission' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                              </div>
                              <div>
                                 <h4 className="font-bold">{item.description}</h4>
                                 <p className="text-[10px] text-muted-foreground uppercase">ID: {item.id.slice(-8)}</p>
                              </div>
                           </div>
                        </td>
                        <td className={cn("py-5 px-4 font-bold font-mono", item.amount > 0 ? "text-white" : "text-red-500")}>
                           {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                        </td>
                        <td className="py-5 px-4 text-xs text-muted-foreground">
                           {formatDate(item.date)}
                        </td>
                        <td className="py-5 px-4 text-right">
                           <span className={cn(
                             "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                             item.status === 'paid' || item.status === 'completed' || item.status === 'cleared' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                           )}>
                              {item.status}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Top-up Modal */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsTopupModalOpen(false)} />
           <div className="bg-card w-full max-w-sm border border-border rounded-md shadow-none relative z-10 p-8 space-y-6 animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                 <div className="w-10 h-10 bg-secondary border border-border rounded-md flex items-center justify-center"><Plus className="text-foreground w-5 h-5" /></div>
                 Add Credits
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Choose an amount to add to your pre-paid wallet balance. Funds are available instantly after payment.</p>
              
              <div className="grid grid-cols-3 gap-2">
                 {['50', '100', '500'].map(amt => (
                    <button 
                       key={amt}
                       onClick={() => setTopupAmount(amt)}
                       className={cn(
                          "py-2 text-xs font-bold rounded-lg border transition-all",
                          topupAmount === amt ? "bg-secondary border-primary text-white" : "bg-secondary/50 border-border text-muted-foreground hover:bg-secondary"
                       )}
                    >
                       ${amt}
                    </button>
                 ))}
              </div>

              <form onSubmit={handleTopup} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Custom Amount (USD)</label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <input 
                         type="number" 
                         required
                         min="10"
                         placeholder="100.00"
                         className="w-full bg-secondary/50 border border-border rounded-md pl-10 pr-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                         value={topupAmount}
                         onChange={(e) => setTopupAmount(e.target.value)}
                       />
                    </div>
                 </div>
                 <button 
                   disabled={isSubmitting || !topupAmount || Number(topupAmount) < 10}
                   className="w-full py-4 bg-secondary text-foreground border border-border font-bold rounded-md shadow-none shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Secure Checkout</>}
                 </button>
                 <p className="text-[10px] text-center text-muted-foreground">Secure payment via Stripe</p>
              </form>
           </div>
        </div>
      )}

      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsPayoutModalOpen(false)} />
           <div className="bg-card w-full max-w-sm border border-border rounded-md shadow-none relative z-10 p-8 space-y-6 animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                 <div className="w-10 h-10 bg-secondary border border-border rounded-md flex items-center justify-center"><Download className="text-foreground w-5 h-5" /></div>
                 Withdrawal
              </h3>
              <p className="text-xs text-muted-foreground">Available: <span className="font-bold text-foreground">{formatCurrency(stats?.withdrawableBalance || 0)}</span></p>
              <form onSubmit={handlePayout} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Amount (USD)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 50.00"
                      className="w-full bg-secondary/50 border border-border rounded-md px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                    />
                 </div>
                 <button 
                   disabled={isSubmitting || !payoutAmount || Number(payoutAmount) > stats?.withdrawableBalance}
                   className="w-full py-4 bg-secondary text-foreground border border-border font-bold rounded-md shadow-none shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                 >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Withdrawal'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Bank Link Modal (Mock) */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsBankModalOpen(false)} />
           <div className="bg-card w-full max-w-md border border-border rounded-md shadow-none relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-center">
              <div className="p-10 space-y-6">
                 <div className="w-20 h-20 bg-secondary rounded-md flex items-center justify-center mx-auto">
                    <CreditCard className="w-10 h-10 text-foreground" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-2">{bankStatus?.isConnected ? 'Account Status' : 'Connect Stripe'}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed px-4">
                       {bankStatus?.isConnected 
                         ? "Your Stripe account is created. Please ensure all requirements are met to enable payouts."
                         : "Link your bank account via Stripe Connect to receive secure payouts directly to your registry contact."}
                    </p>
                 </div>
                 <button 
                   onClick={handleOnboard}
                   className="w-full py-4 bg-primary text-foreground font-bold rounded-md shadow-none shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                 >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> {bankStatus?.isConnected ? 'Update Info on Stripe' : 'Start Stripe Onboarding'}</>}
                 </button>
                 <p className="text-[10px] text-muted-foreground">Offrion uses Stripe for secure, PCI-compliant payment processing.</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, label, icon: Icon, color, bg, primary }: any) {
  return (
    <div className={cn(
      "p-8 rounded-[36px] border border-border shadow-none group hover:shadow-none transition-all relative overflow-hidden",
      primary ? "bg-card ring-2 ring-primary/5" : "bg-card"
    )}>
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-4 rounded-md transition-transform group-hover:scale-110 duration-500", bg)}>
          <Icon className={cn("w-7 h-7", color)} />
        </div>
        {primary && <span className="px-2 py-1 bg-secondary text-foreground text-[8px] font-black uppercase tracking-widest rounded-full">Primary Asset</span>}
      </div>
      <div>
        <h3 className="text-3xl font-black tracking-tighter mb-1">{value}</h3>
        <p className="text-sm font-bold opacity-80">{title}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">{label}</p>
      </div>
    </div>
  );
}
