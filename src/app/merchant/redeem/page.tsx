'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ScanLine, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Loader2,
  RotateCcw,
  Sparkles,
  DollarSign,
  Users,
  Tag,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

type RedeemState = 'idle' | 'loading' | 'success' | 'error';

interface RedeemResult {
  transaction: {
    id: string;
    redeemedAt: string;
    dealTitle: string;
    originalPrice: number;
    discountedPrice: number;
  };
  commission: {
    id: string;
    total: number;
    partnerShare: number;
    platformShare: number;
  };
}

export default function MerchantRedeemPage() {
  const [code, setCode] = useState('');
  const [state, setState] = useState<RedeemState>('idle');
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [kycStatus, setKycStatus] = useState<string>('loading');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    fetch('/api/merchant/kyc')
      .then(res => res.json())
      .then(data => setKycStatus(data.status || 'none'))
      .catch(() => setKycStatus('none'));

    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1).toUpperCase();
    if (!/^[A-Z0-9]$/.test(char) && char !== '') return;

    const newCode = code.split('');
    newCode[index] = char;
    const joined = newCode.join('').slice(0, 6);
    setCode(joined.padEnd(6, '').trimEnd());

    // Auto-advance to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = code.split('');
      newCode[index - 1] = '';
      setCode(newCode.join('').trimEnd());
    }
    if (e.key === 'Enter' && code.replace(/\s/g, '').length === 6) {
      handleRedeem();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setCode(pasted);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleRedeem = async () => {
    const cleanCode = code.replace(/\s/g, '');
    if (cleanCode.length !== 6) return;

    setState('loading');
    setErrorMessage('');
    setResult(null);

    try {
      const res = await fetch('/api/merchant/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ redeemCode: cleanCode }),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = typeof json.error === 'string' 
          ? json.error 
          : json.error?.[0]?.message || 'An unknown error occurred';
        throw new Error(msg);
      }

      setResult(json);
      setState('success');
    } catch (err: any) {
      setErrorMessage(err.message);
      setState('error');
    }
  };

  const handleReset = () => {
    setCode('');
    setState('idle');
    setResult(null);
    setErrorMessage('');
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const codeChars = code.padEnd(6, ' ').split('');

  if (kycStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (kycStatus !== 'verified') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <div className="w-full max-w-lg bg-card border border-border rounded-md p-12 text-center space-y-8 shadow-none">
          <div className="w-24 h-24 bg-secondary text-foreground rounded-md flex items-center justify-center mx-auto shadow-none shadow-primary/5">
            <ScanLine className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Access Restricted</h2>
            <p className="text-muted-foreground">
              You must complete your KYC verification to scan vouchers and redeem deals.
            </p>
          </div>
          <div className="flex flex-col gap-3">
             <button 
                onClick={() => window.location.href = '/merchant/kyc'}
                className="w-full py-4 bg-secondary text-foreground border border-border font-bold rounded-md shadow-none shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
                Verify Business Account
             </button>
             <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-50">Secure Merchant Terminal</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-lg">

        {/* ── Idle / Loading State ── */}
        {(state === 'idle' || state === 'loading') && (
          <div className="text-center space-y-8 animate-[fade-in_0.4s_ease-out]">
            {/* Header */}
            <div className="space-y-3">
              <div className="w-20 h-20 bg-secondary border border-border rounded-3xl flex items-center justify-center mx-auto shadow-none">
                <ScanLine className="w-10 h-10 text-foreground" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Scan & Redeem</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Enter the 6-digit redemption code from the customer&apos;s deal voucher.
              </p>
            </div>
            {/* QR Scanner Trigger Placeholder */}
            <div className="max-w-xs mx-auto mb-10">
               <button 
                  onClick={() => alert('Camera access would be requested here in the next version to scan the customer QR code.')}
                  className="w-full flex items-center justify-center gap-3 py-6 px-4 bg-primary/10 text-foreground border-2 border-dashed border-primary/30 rounded-3xl group hover:bg-primary/20 transition-all duration-300"
               >
                  <div className="p-3 bg-primary/20 rounded-xl group-hover:scale-110 transition-transform">
                     <QrCode className="w-8 h-8 text-foreground" />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-bold">Scan with Camera</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Fast Contactless Sync</p>
                  </div>
               </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
               <div className="flex-1 h-px bg-border/50"></div>
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">OR ENTER MANUALLY</span>
               <div className="flex-1 h-px bg-border/50"></div>
            </div>

            {/* Code Input Grid */}
            <div className="flex justify-center gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  value={codeChars[i]?.trim() || ''}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  disabled={state === 'loading'}
                  className={cn(
                    "w-14 h-16 text-center text-2xl font-bold tracking-wider rounded-md border-2 bg-card outline-none transition-all duration-200",
                    "focus:border-primary focus:ring-4 focus:ring-primary/10",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    codeChars[i]?.trim()
                      ? "border-primary/40 text-foreground"
                      : "border-border text-muted-foreground"
                  )}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            {/* Redeem Button */}
            <button
              onClick={handleRedeem}
              disabled={code.replace(/\s/g, '').length !== 6 || state === 'loading'}
              className={cn(
                "w-full max-w-xs mx-auto flex items-center justify-center gap-3 py-4 px-6 rounded-md text-sm font-bold transition-all duration-300",
                code.replace(/\s/g, '').length === 6
                  ? "bg-secondary text-white border border-border shadow-none hover:shadow-none hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {state === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  Redeem Deal
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Success State ── */}
        {state === 'success' && result && (
          <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
            {/* Success Header */}
            <div className="text-center space-y-3">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-none shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 text-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-emerald-600">Redeemed!</h2>
              <p className="text-sm text-muted-foreground">The deal has been successfully verified and completed.</p>
            </div>

            {/* Deal Card */}
            <div className="bg-card border border-border rounded-3xl p-6 space-y-5 shadow-none">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center flex-shrink-0">
                  <Tag className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg tracking-tight">{result.transaction.dealTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Code: <span className="font-mono font-bold text-foreground">{code.toUpperCase()}</span>
                  </p>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-md">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Original Price</p>
                  <p className="text-lg font-bold line-through opacity-50">{formatCurrency(result.transaction.originalPrice)}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-medium">Customer Paid</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(result.transaction.discountedPrice)}</p>
                </div>
              </div>

              {/* Commission Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Commission Breakdown</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-md text-center">
                    <DollarSign className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-sm font-bold">{formatCurrency(result.commission.total)}</p>
                  </div>
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-md text-center">
                    <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Partner</p>
                    <p className="text-sm font-bold text-blue-600">{formatCurrency(result.commission.partnerShare)}</p>
                  </div>
                  <div className="p-3 bg-muted border border-primary/10 rounded-md text-center">
                    <ShieldCheck className="w-4 h-4 text-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Platform</p>
                    <p className="text-sm font-bold text-foreground">{formatCurrency(result.commission.platformShare)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* New Scan Button */}
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-md text-sm font-bold border-2 border-border hover:bg-secondary transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Scan Another Code
            </button>
          </div>
        )}

        {/* ── Error State ── */}
        {state === 'error' && (
          <div className="text-center space-y-6 animate-[fade-in_0.4s_ease-out]">
            <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Redemption Failed</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{errorMessage}</p>
            </div>
            <div className="flex gap-3 max-w-xs mx-auto">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-bold bg-secondary text-foreground border border-border shadow-none hover:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
