'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Building2,
  Hash,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CloudinaryUpload } from '@/components/CloudinaryUpload';

export default function KYCPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'none' | 'pending' | 'verified' | 'rejected'>('none');
  const [formData, setFormData] = useState({
    industry: '',
    taxId: '',
    registrationNumber: '',
    documents: [] as string[],
  });

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const res = await fetch('/api/merchant/kyc');
      if (res.ok) {
        const data = await res.json();
        if (data && data.status !== 'none') {
          setStatus(data.status);
          setFormData({
            industry: data.kycDetails?.industry || '',
            taxId: data.kycDetails?.taxId || '',
            registrationNumber: data.kycDetails?.registrationNumber || '',
            documents: data.documents || [],
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.documents.length === 0) {
      alert('Please upload at least one verification document.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/merchant/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('pending');
        alert('KYC submitted successfully! Our team will review it shortly.');
      }
    } catch (error) {
      console.error('KYC submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
          <p className="text-muted-foreground">Submit your business documents to unlock full platform features.</p>
        </div>
        
        <div className={cn(
          "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm",
          status === 'verified' && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
          status === 'pending' && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
          status === 'rejected' && "bg-red-500/10 text-red-500 border border-red-500/20",
          status === 'none' && "bg-secondary text-muted-foreground"
        )}>
          {status === 'verified' && <><ShieldCheck className="w-4 h-4" /> Fully Verified</>}
          {status === 'pending' && <><Clock className="w-4 h-4" /> Verification Pending</>}
          {status === 'rejected' && <><AlertCircle className="w-4 h-4" /> Verification Rejected</>}
          {status === 'none' && <><FileText className="w-4 h-4" /> Not Submitted</>}
        </div>
      </div>

      {status === 'verified' && (
        <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[32px] flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-600">You&apos;re all set!</h3>
            <p className="text-sm text-emerald-600/80 max-w-lg">Your business has been verified. You can now create unlimited deals and redeem customer vouchers without restrictions.</p>
          </div>
        </div>
      )}

      {status === 'pending' && (
        <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[32px] flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
            <Clock className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-600">Application Under Review</h3>
            <p className="text-sm text-amber-600/80 max-w-lg">Our moderation team is currently reviewing your documents. This process usually takes 24-48 hours. You will be notified once approved.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-[40px] p-8 space-y-8 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary" />
              Business Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Food & Beverage"
                      disabled={status === 'verified' || status === 'pending'}
                      className="w-full bg-secondary border-none rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary disabled:opacity-50"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tax ID / VAT Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. TRN-123456789"
                      disabled={status === 'verified' || status === 'pending'}
                      className="w-full bg-secondary border-none rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary disabled:opacity-50"
                      value={formData.taxId}
                      onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Business Registration Number</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. LICENSE-99-88-77"
                    disabled={status === 'verified' || status === 'pending'}
                    className="w-full bg-secondary border-none rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary disabled:opacity-50"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-border">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">Identity & Business Proof</h3>
                  <p className="text-xs text-muted-foreground mb-6">Upload a clear copy of your Business License and Owner Identitfication (ID/Passport).</p>
                </div>
                
                <CloudinaryUpload 
                  onUploadSuccess={(url) => setFormData(prev => ({ ...prev, documents: [...prev.documents, url] }))}
                  existingImages={formData.documents}
                  onRemoveImage={(url) => setFormData(prev => ({ ...prev, documents: prev.documents.filter(doc => doc !== url) }))}
                  maxFiles={2}
                  disabled={status === 'verified' || status === 'pending'}
                />
              </div>

              {status !== 'verified' && status !== 'pending' && (
                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-premium-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Verification Request'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-secondary/50 border border-border rounded-[32px] p-6 space-y-6">
            <h4 className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Why verify?
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground italic">Unlock active redemption features</p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground italic">Instant deal publishing instead of moderation</p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground italic">Access to wallet payouts via Stripe</p>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-[32px] p-6 text-center">
            <p className="text-xs text-muted-foreground">Need help with verification?</p>
            <button className="text-xs font-bold text-primary mt-1 hover:underline">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}
