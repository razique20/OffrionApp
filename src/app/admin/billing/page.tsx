'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Wallet, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Send
} from 'lucide-react';

export default function AdminBillingPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const res = await fetch('/api/admin/billing/settlements');
      const data = await res.json();
      setMerchants(data.merchants || []);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalLiability = merchants.reduce((acc, m) => acc + (m.accruedLiability || 0), 0);
  const totalWalletBalances = merchants.reduce((acc, m) => acc + (m.balance || 0), 0);
  
  const filteredMerchants = merchants.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to determine if billing is near (demo logic: 15th and 30th)
  const isBillingNear = () => {
    const day = new Date().getDate();
    return (day >= 12 && day <= 15) || (day >= 27 && day <= 30);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-foreground" />
            Fund Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage merchant settlements and billing cycles (15-day periods).</p>
        </div>
        <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${isBillingNear() ? 'bg-amber-500/10 text-amber-500 animate-pulse' : 'bg-green-500/10 text-green-500'}`}>
                <Calendar className="w-3.5 h-3.5" />
                {isBillingNear() ? 'Billing Period Active' : 'Next Billing: 15th / 30th'}
            </div>
            <button className="px-6 py-2.5 bg-primary text-foreground rounded-md font-bold text-sm shadow-none hover:scale-105 transition-all">
                Export Reports
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-md shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
            <CreditCard className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Unbilled Liability (Opt 2)</p>
          <h2 className="text-4xl font-black tracking-tighter">${totalLiability.toLocaleString()}</h2>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-amber-500">
            <Clock className="w-3 h-3" /> Due in 15-day cycle
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-md shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Wallet className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Prepaid Funds (Opt 1)</p>
          <h2 className="text-4xl font-black tracking-tighter">${totalWalletBalances.toLocaleString()}</h2>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-green-500">
            <CheckCircle2 className="w-3 h-3" /> Funds secured in Escrow
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-md shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
            <AlertCircle className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Pending Settlements</p>
          <h2 className="text-4xl font-black tracking-tighter">{merchants.filter(m => m.accruedLiability > 0).length}</h2>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-blue-500">
            <ArrowUpRight className="w-3 h-3" /> Review required
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card border border-border rounded-md shadow-none overflow-hidden text-foreground">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/20">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Search merchant name or email..." 
                    className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2.5 bg-card border border-border rounded-md hover:bg-secondary transition-all">
                    <Filter className="w-4 h-4" />
                </button>
                <div className="h-6 w-px bg-border mx-2" />
                <button className="px-4 py-2 bg-secondary text-foreground rounded-md text-sm font-bold hover:bg-primary/20 transition-all">
                    All Merchants
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10">
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">Merchant</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border text-center">Billing Model</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border text-right">Prepaid Balance</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border text-right">Accrued Liability</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">Current Status</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={6} className="p-20 text-center text-muted-foreground font-medium animate-pulse">Loading merchant financial records...</td></tr>
              ) : filteredMerchants.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-muted-foreground font-medium">No merchants found matching your search.</td></tr>
              ) : filteredMerchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-secondary/5 transition-colors group">
                  <td className="p-6">
                    <div className="font-bold text-sm tracking-tight">{merchant.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{merchant.email}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${
                        merchant.billingPreference === 'prepaid' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : 'bg-indigo-500/10 text-indigo-500'
                        }`}>
                            {merchant.billingPreference.replace('_', ' ')}
                        </span>
                    </div>
                  </td>
                  <td className="p-6 text-right font-bold text-sm">
                    <span className={merchant.balance < 10 && merchant.billingPreference === 'prepaid' ? 'text-destructive' : 'text-foreground'}>
                        ${merchant.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-6 text-right font-bold text-sm tracking-tight">
                    <span className={merchant.accruedLiability > 0 ? 'text-amber-600' : 'text-muted-foreground/30'}>
                        ${merchant.accruedLiability.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${merchant.status === 'verified' ? 'bg-green-500 shadow-none shadow-green-500/50' : 'bg-amber-500'}`} />
                      <span className="text-[11px] font-bold capitalize ">{merchant.status}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {merchant.accruedLiability > 0 && (
                        <button className="p-2 bg-primary text-foreground rounded-lg hover:scale-105 transition-all shadow-none">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button className="p-2 bg-secondary text-muted-foreground rounded-lg hover:bg-secondary/10 hover:text-foreground transition-all">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-2 bg-secondary text-muted-foreground rounded-lg hover:bg-secondary/10 hover:text-foreground transition-all">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
