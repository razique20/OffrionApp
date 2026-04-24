'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Store, 
  Tag, 
  Clock, 
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export default function ModerationPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [creditLimits, setCreditLimits] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, dRes] = await Promise.all([
        fetch('/api/admin/moderation/merchants'),
        fetch('/api/admin/moderation/deals')
      ]);
      const mData = await mRes.json();
      const dData = await dRes.json();
      setMerchants(Array.isArray(mData) ? mData : []);
      setDeals(Array.isArray(dData) ? dData : []);
    } catch (err) {
      console.error('Failed to fetch moderation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantAction = async (merchantId: string, status: string) => {
    setActionLoading(`merchant-${merchantId}`);
    try {
      const payload: any = { merchantId, status };
      if (status === 'verified') {
        payload.creditLimit = creditLimits[merchantId] !== undefined ? creditLimits[merchantId] : 100; // default $100
      }

      const res = await fetch('/api/admin/moderation/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMerchants(merchants.filter(m => m._id !== merchantId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDealAction = async (dealId: string, status: string) => {
    setActionLoading(`deal-${dealId}`);
    try {
      const res = await fetch('/api/admin/moderation/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, status }),
      });
      if (res.ok) {
        setDeals(deals.filter(d => d._id !== dealId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
      <Loader2 className="w-10 h-10 text-foreground animate-spin" />
      <p className="text-muted-foreground animate-pulse">Loading moderation queue...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      {/* Merchants Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center">
            <Store className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Merchant Verifications</h2>
            <p className="text-xs text-muted-foreground">{merchants.length} pending applications</p>
          </div>
        </div>

        {merchants.length === 0 ? (
          <div className="p-12 border border-dashed border-border rounded-md text-center bg-secondary/10">
            <p className="text-sm text-muted-foreground">All merchant applications have been processed.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {merchants.map((merchant) => (
                <div key={merchant._id} className="flex flex-col gap-4 p-8 bg-card border border-border rounded-md hover:shadow-none transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center overflow-hidden border border-border">
                        {merchant.logoUrl ? (
                          <img src={merchant.logoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-6 h-6 text-muted-foreground/30" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{merchant.businessName}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(merchant.createdAt).toLocaleDateString()}</span>
                          <span className="w-1 h-1 rounded-full bg-border"></span>
                          <span>{merchant.contactEmail}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="relative" title="Card-on-file Credit Limit">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold leading-none">$</span>
                        <input 
                          type="number"
                          min="0"
                          placeholder="Limit"
                          value={creditLimits[merchant._id] !== undefined ? creditLimits[merchant._id] : 100}
                          onChange={(e) => setCreditLimits({...creditLimits, [merchant._id]: parseInt(e.target.value) || 0})}
                          className="w-24 pl-7 pr-3 py-3 text-xs font-bold bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-full m-0"
                        />
                      </div>
                      <button 
                        disabled={!!actionLoading}
                        onClick={() => handleMerchantAction(merchant._id, 'rejected')}
                        className="p-3 bg-secondary text-red-500 rounded-md hover:bg-red-500/10 transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button 
                        disabled={!!actionLoading}
                        onClick={() => handleMerchantAction(merchant._id, 'verified')}
                        className="px-6 py-3 bg-secondary text-foreground border border-border text-xs font-bold rounded-md shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading === `merchant-${merchant._id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve Merchant
                      </button>
                    </div>
                  </div>

                  {/* KYC Documents Review */}
                  {(merchant.kycDetails || (merchant.documents && merchant.documents.length > 0)) && (
                    <div className="mt-4 p-5 bg-secondary/30 rounded-md border border-border/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Business Details</p>
                          <div className="space-y-1">
                            <p className="text-xs font-bold">{merchant.kycDetails?.industry || 'Unspecified Industry'}</p>
                            <p className="text-[11px] text-muted-foreground">Reg: {merchant.kycDetails?.registrationNumber || 'N/A'}</p>
                            <p className="text-[11px] text-muted-foreground">Tax ID: {merchant.kycDetails?.taxId || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">KYC Documents</p>
                          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {merchant.documents && merchant.documents.length > 0 ? (
                              merchant.documents.map((doc: string, idx: number) => (
                                <a key={idx} href={doc} target="_blank" rel="noopener noreferrer" className="relative group w-24 h-24 rounded-md overflow-hidden border border-border flex-shrink-0">
                                  <img src={doc} alt="" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink className="w-5 h-5 text-foreground" />
                                  </div>
                                </a>
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground italic">No documents uploaded.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            ))}
          </div>
        )}
      </section>

      {/* Deals Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-500/10 rounded-md flex items-center justify-center">
            <Tag className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Deal Approval Queue</h2>
            <p className="text-xs text-muted-foreground">{deals.length} deals awaiting review</p>
          </div>
        </div>

        {deals.length === 0 ? (
          <div className="p-12 border border-dashed border-border rounded-md text-center bg-secondary/10">
            <p className="text-sm text-muted-foreground">The deal queue is empty. Good job!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {deals.map((deal) => (
              <div key={deal._id} className="p-6 bg-card border border-border rounded-[28px] group hover:shadow-none transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 bg-secondary rounded-md flex items-center justify-center overflow-hidden border border-border">
                      {deal.images?.[0] ? (
                        <img src={deal.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Tag className="w-8 h-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase rounded-md tracking-widest">
                          Pending Review
                        </span>
                        <h3 className="font-bold text-lg">{deal.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-xl mb-3">{deal.description}</p>
                      <div className="flex items-center gap-6 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="text-foreground font-bold">{formatCurrency(deal.discountedPrice)}</span>
                          <span className="text-muted-foreground line-through opacity-50">{formatCurrency(deal.originalPrice)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Merchant:</span>
                          <span className="text-foreground font-bold">{deal.merchantId?.name || 'ID: ' + deal.merchantId.toString().slice(-8)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      disabled={!!actionLoading}
                      onClick={() => handleDealAction(deal._id, 'active')}
                      className="px-6 py-2.5 bg-secondary text-foreground border border-border text-[10px] font-bold rounded-md shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === `deal-${deal._id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                      Approve Deal
                    </button>
                    <button 
                      disabled={!!actionLoading}
                      onClick={() => handleDealAction(deal._id, 'rejected')}
                      className="px-6 py-2.5 bg-secondary text-[10px] font-bold rounded-md hover:bg-destructive/10 hover:text-destructive transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-3 h-3" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
