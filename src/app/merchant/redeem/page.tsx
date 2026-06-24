'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScanLine,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  RotateCcw,
  Tag,
  QrCode,
  Clock,
  TrendingUp,
  Receipt,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

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

interface RecentTxn {
  _id: string;
  status: string;
  createdAt: string;
  redeemedAt?: string;
  dealId?: { title?: string; discountedPrice?: number; originalPrice?: number };
}

export default function MerchantRedeemPage() {
  const [code, setCode] = useState('');
  const [state, setState] = useState<RedeemState>('idle');
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [kycStatus, setKycStatus] = useState<string>('loading');
  const [recent, setRecent] = useState<RecentTxn[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const loadRecent = useCallback(() => {
    fetch('/api/merchant/transactions?limit=8', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.transactions) setRecent(data.transactions); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/merchant/kyc')
      .then((res) => res.json())
      .then((data) => setKycStatus(data.status || 'none'))
      .catch(() => setKycStatus('none'));

    loadRecent();
    inputRefs.current[0]?.focus();
  }, [loadRecent]);

  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1).toUpperCase();
    if (!/^[A-Z0-9]$/.test(char) && char !== '') return;

    const newCode = code.split('');
    newCode[index] = char;
    const joined = newCode.join('').slice(0, 6);
    setCode(joined.padEnd(6, '').trimEnd());

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
      loadRecent();
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

  // ── Today's stats derived from recent transactions ──
  const isToday = (d?: string) => {
    if (!d) return false;
    const date = new Date(d);
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
  };
  const completedRecent = recent.filter((t) => t.status === 'completed');
  const todayCount = completedRecent.filter((t) => isToday(t.redeemedAt || t.createdAt)).length;
  const todayRevenue = completedRecent
    .filter((t) => isToday(t.redeemedAt || t.createdAt))
    .reduce((sum, t) => sum + (t.dealId?.discountedPrice || 0), 0);

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
          <div className="w-24 h-24 bg-secondary text-foreground rounded-md flex items-center justify-center mx-auto">
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
              onClick={() => (window.location.href = '/merchant/kyc')}
              className="w-full py-4 bg-secondary text-foreground border border-border font-bold rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all"
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
    <div className="max-w-6xl mx-auto">
      {/* Terminal header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center">
          <ScanLine className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Redemption Terminal</h1>
          <p className="text-xs text-muted-foreground">Validate customer vouchers and record redemptions.</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ── LEFT: Entry / Result panel ── */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 min-h-[480px] flex flex-col justify-center">

          {/* Idle / Loading */}
          {(state === 'idle' || state === 'loading') && (
            <div className="space-y-7 animate-[fade-in_0.4s_ease-out] max-w-md mx-auto w-full">
              <div className="text-center space-y-1.5">
                <h2 className="text-lg font-bold tracking-tight">Enter Redemption Code</h2>
                <p className="text-xs text-muted-foreground">
                  Type or paste the 6-digit code from the customer&apos;s voucher.
                </p>
              </div>

              {/* QR scan trigger */}
              <button
                onClick={() => alert('Camera access would be requested here in the next version to scan the customer QR code.')}
                className="w-full flex items-center gap-3 py-4 px-4 bg-secondary/50 border border-dashed border-border rounded-lg group hover:bg-secondary transition-all"
              >
                <div className="p-2.5 bg-background border border-border rounded-md group-hover:scale-105 transition-transform">
                  <QrCode className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Scan with Camera</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Fast contactless redeem</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em]">or enter manually</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Code grid */}
              <div className="flex justify-center gap-2 sm:gap-3">
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
                      'w-12 h-16 sm:w-14 sm:h-16 text-center text-2xl font-bold tracking-wider rounded-md border-2 bg-background outline-none transition-all duration-200',
                      'focus:border-primary focus:ring-4 focus:ring-primary/10',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      codeChars[i]?.trim() ? 'border-primary/40 text-foreground' : 'border-border text-muted-foreground'
                    )}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleRedeem}
                disabled={code.replace(/\s/g, '').length !== 6 || state === 'loading'}
                className={cn(
                  'w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-md text-sm font-bold transition-all duration-300',
                  code.replace(/\s/g, '').length === 6
                    ? 'bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                )}
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating&hellip;
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

          {/* Success */}
          {state === 'success' && result && (
            <div className="space-y-6 animate-[fade-in_0.5s_ease-out] max-w-md mx-auto w-full">
              <div className="text-center space-y-3">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                  <div className="relative w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-emerald-500">Redeemed!</h2>
                <p className="text-sm text-muted-foreground">The deal has been verified and recorded.</p>
              </div>

              <div className="bg-background border border-border rounded-xl p-5 space-y-5">
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

                <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
                  <p className="text-xs text-muted-foreground font-medium">Service fee</p>
                  <p className="text-sm font-bold text-foreground">{formatCurrency(result.commission.total)}</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-md text-sm font-bold border border-border hover:bg-secondary transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Scan Another Code
              </button>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div className="text-center space-y-6 animate-[fade-in_0.4s_ease-out] max-w-md mx-auto w-full">
              <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Redemption Failed</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">{errorMessage}</p>
              </div>
              <button
                onClick={handleReset}
                className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-bold bg-secondary text-foreground border border-border hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Live context panel ── */}
        <div className="space-y-4">
          {/* Today's stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today</p>
              </div>
              <p className="text-2xl font-bold">{todayCount}</p>
              <p className="text-[10px] text-muted-foreground">redemptions</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Revenue</p>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(todayRevenue)}</p>
              <p className="text-[10px] text-muted-foreground">today</p>
            </div>
          </div>

          {/* Recent redemptions */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</p>
            </div>
            {completedRecent.length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No redemptions yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[360px] overflow-y-auto">
                {completedRecent.map((t) => (
                  <div key={t._id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{t.dealId?.title || 'Deal'}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(t.redeemedAt || t.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {typeof t.dealId?.discountedPrice === 'number' && (
                      <span className="text-xs font-bold shrink-0">{formatCurrency(t.dealId.discountedPrice)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
