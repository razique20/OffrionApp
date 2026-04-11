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
  FlaskConical
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

export default function MerchantSandboxRedeemPage() {
  const [code, setCode] = useState('');
  const [state, setState] = useState<RedeemState>('idle');
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
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
      const res = await fetch('/api/merchant/redeem-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ redeemCode: cleanCode }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to redeem sandbox deal');
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] space-y-8">
      {/* Sandbox Warning Banner */}
      <div className="w-full max-w-lg bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
        <FlaskConical className="w-5 h-5 text-amber-500" />
        <p className="text-xs font-medium text-amber-700">
          <strong>Sandbox Mode</strong>: This terminal is strictly for testing. No real payouts are triggered.
        </p>
      </div>

      <div className="w-full max-w-lg">
        {/* ── Idle / Loading State ── */}
        {(state === 'idle' || state === 'loading') && (
          <div className="text-center space-y-8 animate-[fade-in_0.4s_ease-out]">
            {/* Header */}
            <div className="space-y-3">
              <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <ScanLine className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Sandbox Terminal</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Enter the 6-digit sandbox code to simulate a customer redemption.
              </p>
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
                    "w-14 h-16 text-center text-2xl font-bold tracking-wider rounded-2xl border-2 bg-card outline-none transition-all duration-200",
                    "focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    codeChars[i]?.trim()
                      ? "border-amber-500/40 text-foreground"
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
                "w-full max-w-xs mx-auto flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-sm font-bold transition-all duration-300",
                code.replace(/\s/g, '').length === 6
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {state === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  Redeem (Sandbox)
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Success State ── */}
        {state === 'success' && result && (
          <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-emerald-600">Simulated Success!</h2>
              <p className="text-sm text-muted-foreground">The sandbox transaction has been completed and webhooks triggered.</p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 space-y-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Tag className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg tracking-tight">{result.transaction.dealTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 uppercase">Sandbox Mode</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/50 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Partner Share</p>
                    <p className="text-md font-bold text-blue-600">{formatCurrency(result.commission.partnerShare)}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Platform Share</p>
                    <p className="text-md font-bold text-primary">{formatCurrency(result.commission.platformShare)}</p>
                  </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-4 text-sm font-bold border-2 border-border rounded-2xl hover:bg-secondary transition-all"
            >
              Test Another Code
            </button>
          </div>
        )}

        {/* ── Error State ── */}
        {state === 'error' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Redemption Failed</h2>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="w-full max-w-xs mx-auto py-3 bg-amber-500 text-white rounded-2xl font-bold"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
