'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Grid3X3,
  List,
  Flame,
  MapPin,
  Smartphone,
  Code2,
  Copy,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  ShoppingBag,
  Zap,
  ArrowRight,
  Star,
  Coffee,
  Layers,
  Wifi,
  WifiOff,
  Loader2,
  X,
  Tag,
  Clock,
  CheckCheck,
  Sparkles,
  ChevronDown,
  Globe,
  Search,
  Lock,
  Plane,
  Wallet,
  Users,
  Store,
  Building2,
  Webhook,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SANDBOX_KEY = 'sk_sandbox_demo';
const BASE = '/api';

type Deal = {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  emirate?: string;
  landmark?: string;
  tags?: string[];
  isHot?: boolean;
  isFeatured?: boolean;
  validUntil?: string;
  dealType?: string;
  eventType?: string;
  usageLimit?: number;
  currentUsage?: number;
  commissionPercentage?: number;
  categoryId?: { name: string; slug: string };
};

type ClaimStep = 'idle' | 'loading' | 'claimed';

type ShowcaseVariant = 'card-grid' | 'list-feed' | 'hot-only' | 'location' | 'mobile-strip';

const VARIANTS: { id: ShowcaseVariant; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'card-grid', label: 'Card Grid', icon: Grid3X3, desc: 'Classic grid — great for deal discovery pages' },
  { id: 'list-feed', label: 'List Feed', icon: List, desc: 'Compact feed — ideal for sidebars or activity streams' },
  { id: 'hot-only', label: 'Hot Deals', icon: Flame, desc: 'Only isHot=true — for flash/featured banners' },
  { id: 'location', label: 'Geo Search', icon: MapPin, desc: 'Near a coordinate — for maps and local apps' },
  { id: 'mobile-strip', label: 'Mobile Strip', icon: Smartphone, desc: 'Horizontal scroll — perfect for mobile apps' },
];

function buildUrl(variant: ShowcaseVariant): string {
  const params = new URLSearchParams();
  switch (variant) {
    case 'card-grid':   params.set('limit', '6'); break;
    case 'list-feed':   params.set('limit', '5'); break;
    case 'hot-only':    params.set('isHot', 'true'); params.set('limit', '4'); break;
    case 'location':    params.set('lat', '25.2048'); params.set('lng', '55.2708'); params.set('radius', '15000'); params.set('limit', '4'); break;
    case 'mobile-strip':params.set('limit', '6'); params.set('isFeatured', 'true'); break;
  }
  return `${BASE}/deals?${params.toString()}`;
}

function buildCode(variant: ShowcaseVariant, lang: 'js' | 'python' | 'curl'): string {
  const url = buildUrl(variant).replace('/api', 'https://offrion-app-kx5c-git-main-raziquemks-projects.vercel.app/api');
  if (lang === 'curl') {
    return `curl -H "x-api-key: YOUR_API_KEY" \\
  "${url}"`;
  }
  if (lang === 'python') {
    return `import requests

response = requests.get(
    "${url}",
    headers={"x-api-key": "YOUR_API_KEY"}
)

deals = response.json()["deals"]
for deal in deals:
    print(f"{deal['title']} — {deal['discountPercentage']}% off")`;
  }
  return `const response = await fetch(
  "${url}",
  { headers: { "x-api-key": "YOUR_API_KEY" } }
);

const { deals } = await response.json();
deals.forEach(deal => {
  console.log(\`\${deal.title} — \${deal.discountPercentage}% off\`);
});`;
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ── Deal Claim Modal ──
function DealModal({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const [step, setStep] = useState<ClaimStep>('idle');
  const [redeemCode, setRedeemCode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState<'code' | 'id' | null>(null);
  const [showCodeBlock, setShowCodeBlock] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleClaim = async () => {
    setStep('loading');
    // Simulate network latency for realism
    await new Promise(r => setTimeout(r, 1200));
    const code = generateCode();
    const txId = generateCode() + generateCode() + generateCode();
    setRedeemCode(code);
    setTransactionId(txId.toLowerCase());
    setStep('claimed');
  };

  const copyText = (text: string, key: 'code' | 'id') => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeExample = `// After user clicks "Claim", call track-click
const res = await fetch('/api/partners/track-click', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY',
  },
  body: JSON.stringify({ dealId: '${deal._id}' }),
});

const { redeemCode, transactionId } = await res.json();
// redeemCode → "${redeemCode || 'ABC123'}"
// Show QR + code to user. Merchant scans at point of sale.`;

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center">
              <Tag className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {deal.categoryId?.name ?? 'Deal'} · {deal.emirate}
              </p>
              <h2 className="font-bold text-base leading-tight">{deal.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Deal image + details */}
        <div className="p-5 space-y-4">
          <div className="relative rounded-lg overflow-hidden h-44">
            <DealImage src={deal.images?.[0]} alt={deal.title} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                {deal.discountPercentage}% OFF
              </span>
              {deal.isHot && (
                <span className="bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" /> HOT
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{deal.description}</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary rounded-lg p-3 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">You Pay</p>
              <p className="text-lg font-bold">AED {deal.discountedPrice}</p>
              <p className="text-[10px] text-muted-foreground line-through">AED {deal.originalPrice}</p>
            </div>
            <div className="bg-secondary rounded-lg p-3 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Partner Earns</p>
              <p className="text-lg font-bold text-emerald-500">
                {deal.commissionPercentage ?? 10}%
              </p>
              <p className="text-[10px] text-muted-foreground">commission</p>
            </div>
            <div className="bg-secondary rounded-lg p-3 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Valid</p>
              <p className="text-xs font-bold">
                {deal.validUntil
                  ? new Date(deal.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                  : '7 days'}
              </p>
              <div className="flex items-center gap-0.5 mt-0.5">
                <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground">48h after claim</p>
              </div>
            </div>
          </div>

          {/* Claim flow */}
          {step === 'idle' && (
            <button
              onClick={handleClaim}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" />
              Claim Deal — Get Redeem Code
            </button>
          )}

          {step === 'loading' && (
            <div className="w-full bg-secondary border border-border py-3 rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Generating redeem code…</span>
            </div>
          )}

          {step === 'claimed' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              {/* Success banner */}
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg">
                <CheckCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Deal claimed! Show this code to the merchant.</p>
              </div>

              {/* Code card */}
              <div className="p-5 bg-secondary border border-border rounded-lg space-y-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Redeem Code</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black tracking-[0.2em] font-mono">{redeemCode}</span>
                    <button
                      onClick={() => copyText(redeemCode, 'code')}
                      className="p-1.5 rounded-md hover:bg-border transition-colors"
                    >
                      {copied === 'code' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Read this code aloud or show the screen to the merchant.</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Transaction ID</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground">{transactionId}</span>
                    <button
                      onClick={() => copyText(transactionId, 'id')}
                      className="p-1 rounded hover:bg-border transition-colors shrink-0"
                    >
                      {copied === 'id' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Expires in 48 hours
                </div>
              </div>

              {/* Flow steps */}
              <div className="space-y-1.5">
                {[
                  { label: 'Partner fetched deal via API', done: true },
                  { label: 'User clicked "Claim" → POST /partners/track-click', done: true },
                  { label: 'Redeem code generated & returned', done: true },
                  { label: 'User shows code to merchant', done: false },
                  { label: 'Merchant enters code → commission credited', done: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center shrink-0',
                      s.done ? 'bg-emerald-500' : 'bg-secondary border border-border'
                    )}>
                      {s.done && <CheckCheck className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <p className={cn('text-xs', s.done ? 'text-foreground' : 'text-muted-foreground')}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Code toggle */}
              <button
                onClick={() => setShowCodeBlock(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-secondary border border-border rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors"
              >
                <span className="flex items-center gap-2"><Code2 className="w-3.5 h-3.5" /> See the API call that did this</span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showCodeBlock && 'rotate-180')} />
              </button>
              {showCodeBlock && (
                <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden animate-in fade-in duration-200">
                  <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">javascript</span>
                  </div>
                  <pre className="p-4 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
                    {codeExample}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──
export default function ShowcasePage() {
  const [active, setActive] = useState<ShowcaseVariant>('card-grid');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeLang, setCodeLang] = useState<'js' | 'python' | 'curl'>('js');
  const [copied, setCopied] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const fetchDeals = useCallback(async (variant: ShowcaseVariant) => {
    setLoading(true);
    setError(null);
    setDeals([]);
    try {
      const res = await fetch(buildUrl(variant), { headers: { 'x-api-key': SANDBOX_KEY } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setDeals(data.deals || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDeals(active); }, [active, fetchDeals]);

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCode(active, codeLang));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentVariant = VARIANTS.find(v => v.id === active)!;

  return (
    <div className="min-h-screen bg-background">
      {selectedDeal && <DealModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />}

      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-6">
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Interactive API Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            See what you can build.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Live sandbox data. Click any deal to go through the full claim flow — QR code, redeem code, and the exact API call that powers it.
          </p>
        </div>

        {/* Variant tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {VARIANTS.map(v => (
            <button
              key={v.id}
              onClick={() => setActive(v.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium border transition-all',
                active === v.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-foreground/20'
              )}
            >
              <v.icon className="w-4 h-4" />
              {v.label}
            </button>
          ))}
        </div>

        {/* Preview + code */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

          {/* Left: live preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">{currentVariant.label}</h2>
                <p className="text-sm text-muted-foreground">{currentVariant.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {loading
                  ? <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />Fetching…</span>
                  : error
                    ? <span className="flex items-center gap-1.5 text-xs text-destructive"><WifiOff className="w-3.5 h-3.5" />Error</span>
                    : <span className="flex items-center gap-1.5 text-xs text-emerald-500"><Wifi className="w-3.5 h-3.5" />Live sandbox</span>
                }
                <button onClick={() => fetchDeals(active)} className="p-1.5 rounded-md border border-border hover:bg-secondary transition-colors">
                  <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden bg-card min-h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
                  <WifiOff className="w-8 h-8" /><p className="text-sm">{error}</p>
                </div>
              ) : (
                <PreviewRenderer variant={active} deals={deals} onDealClick={setSelectedDeal} />
              )}
            </div>

            {!loading && !error && deals.length > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Click any deal to see the full claim flow →
              </p>
            )}
          </div>

          {/* Right: generated code */}
          <div className="space-y-4 sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Generated Code</h2>
              <div className="flex items-center gap-1 bg-secondary rounded-md p-1 border border-border">
                {(['js', 'python', 'curl'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setCodeLang(l)}
                    className={cn(
                      'px-3 py-1 rounded text-xs font-mono font-medium transition-all',
                      codeLang === l ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {l === 'js' ? 'JavaScript' : l === 'python' ? 'Python' : 'cURL'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-[12px] font-mono text-slate-300 leading-relaxed whitespace-pre">{buildCode(active, codeLang)}</pre>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Endpoint</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-primary/10 text-foreground">GET</span>
                <code className="text-xs font-mono text-foreground">/api/deals</code>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-1">Parameters used</h3>
              <ParamChips variant={active} />
            </div>

            <div className="bg-secondary border border-border rounded-lg p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold mb-1">Ready to build?</p>
                <p className="text-xs text-muted-foreground mb-3">Get your API key from the partner dashboard and start with the sandbox.</p>
                <a href="/auth/register" className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline">
                  Create partner account <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* How the system works */}
        <HowItWorks />

        {/* Partner website mockups */}
        <PartnerSiteMockups />

        {/* Integration ideas */}
        <div className="mt-24 border-t border-border pt-16">
          <h2 className="text-2xl font-bold mb-2">What partners are building</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Real integration patterns used in production. Each one is the same{' '}
            <code className="text-xs font-mono px-1 py-0.5 bg-secondary rounded">/api/deals</code> call, shaped by a few
            query params into a completely different experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTEGRATION_IDEAS.map(idea => (
              <div key={idea.title} className="border border-border rounded-xl p-5 bg-card hover:border-foreground/20 hover:-translate-y-0.5 transition-all">
                {/* Visual preview of the integration */}
                <IdeaVisual idea={idea} />

                <div className="flex items-center gap-2.5 mt-4 mb-2">
                  <div className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0">
                    <idea.icon className={cn('w-4 h-4', idea.accent)} />
                  </div>
                  <h3 className="font-bold text-sm">{idea.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{idea.desc}</p>

                <code className="block px-2.5 py-1.5 bg-slate-950 rounded text-[10px] font-mono text-emerald-300 overflow-x-auto mb-3">
                  {idea.endpoint}
                </code>

                <div className="flex flex-wrap gap-1.5">
                  {idea.params.map(p => (
                    <span key={p} className="px-2 py-0.5 bg-secondary border border-border rounded text-[10px] font-mono text-muted-foreground">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Preview renderers ──

function PreviewRenderer({ variant, deals, onDealClick }: { variant: ShowcaseVariant; deals: Deal[]; onDealClick: (d: Deal) => void }) {
  if (!deals.length) return <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">No deals returned</div>;
  switch (variant) {
    case 'card-grid':    return <CardGrid deals={deals} onDealClick={onDealClick} />;
    case 'list-feed':    return <ListFeed deals={deals} onDealClick={onDealClick} />;
    case 'hot-only':     return <HotDeals deals={deals} onDealClick={onDealClick} />;
    case 'location':     return <LocationDeals deals={deals} onDealClick={onDealClick} />;
    case 'mobile-strip': return <MobileStrip deals={deals} onDealClick={onDealClick} />;
  }
}

// Guaranteed-to-render fallback so every deal card always shows a picture,
// even when the API returns a deal with no image or a broken URL.
const FALLBACK_DEAL_IMG = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=70';

function DealImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const resolved = !src || failed ? FALLBACK_DEAL_IMG : src;
  return (
    <img
      src={resolved}
      alt={alt}
      onError={() => { if (!failed) setFailed(true); }}
      className={cn('object-cover bg-secondary', className)}
    />
  );
}

function CardGrid({ deals, onDealClick }: { deals: Deal[]; onDealClick: (d: Deal) => void }) {
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {deals.slice(0, 6).map(deal => (
        <button
          key={deal._id}
          onClick={() => onDealClick(deal)}
          className="rounded-md border border-border overflow-hidden bg-background hover:border-foreground/30 hover:shadow-md transition-all text-left group"
        >
          <div className="relative">
            <DealImage src={deal.images?.[0]} alt={deal.title} className="w-full h-24" />
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{deal.discountPercentage}%
            </span>
            {deal.isHot && (
              <span className="absolute top-2 left-2 bg-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5" /> HOT
              </span>
            )}
          </div>
          <div className="p-2.5">
            <p className="text-xs font-bold truncate">{deal.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{deal.emirate}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold">AED {deal.discountedPrice}</span>
              <span className="text-[10px] text-muted-foreground line-through">AED {deal.originalPrice}</span>
            </div>
            <div className="mt-2 w-full bg-primary text-primary-foreground text-[10px] font-bold py-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
              Claim Deal
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ListFeed({ deals, onDealClick }: { deals: Deal[]; onDealClick: (d: Deal) => void }) {
  return (
    <div className="divide-y divide-border">
      {deals.slice(0, 5).map(deal => (
        <button
          key={deal._id}
          onClick={() => onDealClick(deal)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors group text-left"
        >
          <DealImage src={deal.images?.[0]} alt={deal.title} className="w-10 h-10 rounded-md shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{deal.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {deal.emirate && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{deal.emirate}</span>}
              {deal.categoryId && <span className="text-[10px] text-muted-foreground">{deal.categoryId.name}</span>}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold">AED {deal.discountedPrice}</p>
            <span className="text-[10px] bg-primary/10 text-foreground px-1.5 py-0.5 rounded font-mono">-{deal.discountPercentage}%</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </button>
      ))}
    </div>
  );
}

function HotDeals({ deals, onDealClick }: { deals: Deal[]; onDealClick: (d: Deal) => void }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-foreground" />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">Flash Deals</span>
        <span className="ml-auto text-[10px] text-muted-foreground animate-pulse">Ending soon</span>
      </div>
      {deals.slice(0, 4).map((deal, i) => (
        <button
          key={deal._id}
          onClick={() => onDealClick(deal)}
          className="w-full flex items-center gap-3 p-3 rounded-md bg-secondary border border-border hover:border-border hover:bg-secondary transition-all text-left group"
        >
          <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
          <DealImage src={deal.images?.[0]} alt={deal.title} className="w-10 h-10 rounded-md shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{deal.title}</p>
            <p className="text-[10px] text-muted-foreground">{deal.emirate}</p>
          </div>
          <div className="shrink-0 bg-secondary text-white text-xs font-bold px-2 py-1 rounded group-hover:bg-secondary transition-colors">
            {deal.discountPercentage}% OFF
          </div>
        </button>
      ))}
    </div>
  );
}

function LocationDeals({ deals, onDealClick }: { deals: Deal[]; onDealClick: (d: Deal) => void }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-md bg-secondary border border-border mb-4">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="text-xs font-bold">Near: Burj Khalifa, Dubai</p>
          <p className="text-[10px] text-muted-foreground">25.2048° N, 55.2708° E · 15km radius</p>
        </div>
      </div>
      {deals.slice(0, 4).map(deal => (
        <button
          key={deal._id}
          onClick={() => onDealClick(deal)}
          className="w-full flex items-center gap-3 p-3 rounded-md border border-border hover:bg-secondary/50 hover:border-foreground/20 transition-all text-left"
        >
          <DealImage src={deal.images?.[0]} alt={deal.title} className="w-12 h-12 rounded-md shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{deal.title}</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-2.5 h-2.5" /> {deal.emirate}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs font-bold">AED {deal.discountedPrice}</p>
            <p className="text-[10px] text-muted-foreground line-through">AED {deal.originalPrice}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function MobileStrip({ deals, onDealClick }: { deals: Deal[]; onDealClick: (d: Deal) => void }) {
  return (
    <div className="p-4 flex justify-center">
      <div className="border border-border rounded-xl overflow-hidden bg-background w-full max-w-xs">
        <div className="bg-secondary px-4 py-3 flex items-center justify-between border-b border-border">
          <span className="text-xs font-bold">Deals for You</span>
          <span className="text-[10px] text-muted-foreground">See all</span>
        </div>
        <div className="flex gap-3 overflow-x-auto p-3" style={{ scrollSnapType: 'x mandatory' }}>
          {deals.map(deal => (
            <button
              key={deal._id}
              onClick={() => onDealClick(deal)}
              className="shrink-0 w-32 rounded-lg border border-border overflow-hidden hover:border-foreground/30 hover:shadow-md transition-all text-left group"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative">
                <DealImage src={deal.images?.[0]} alt={deal.title} className="w-full h-20" />
                <span className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-[9px] font-bold px-1 py-0.5 rounded">-{deal.discountPercentage}%</span>
              </div>
              <div className="p-2">
                <p className="text-[10px] font-bold truncate">{deal.title}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{deal.emirate}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold">AED {deal.discountedPrice}</span>
                </div>
                <div className="mt-1.5 w-full bg-primary text-primary-foreground text-[9px] font-bold py-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Claim
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-border bg-secondary/50">
          <p className="text-[9px] text-muted-foreground text-center">Powered by Offrion API</p>
        </div>
      </div>
    </div>
  );
}

function ParamChips({ variant }: { variant: ShowcaseVariant }) {
  const map: Record<ShowcaseVariant, { key: string; val: string }[]> = {
    'card-grid':    [{ key: 'limit', val: '6' }],
    'list-feed':    [{ key: 'limit', val: '5' }],
    'hot-only':     [{ key: 'isHot', val: 'true' }, { key: 'limit', val: '4' }],
    'location':     [{ key: 'lat', val: '25.2048' }, { key: 'lng', val: '55.2708' }, { key: 'radius', val: '15000' }],
    'mobile-strip': [{ key: 'isFeatured', val: 'true' }, { key: 'limit', val: '6' }],
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {map[variant].map(({ key, val }) => (
        <span key={key} className="px-2 py-0.5 bg-secondary border border-border rounded text-[10px] font-mono text-foreground">
          {key}=<span className="text-muted-foreground">{val}</span>
        </span>
      ))}
    </div>
  );
}

// ── How the system works (member ⇄ partner ⇄ merchant) ──

const FLOW_STEPS = [
  {
    icon: Globe,
    role: 'Partner',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Embeds the API',
    desc: 'A partner site or app calls GET /api/deals with their key and renders live, hyper-local deals inside their own UI.',
    code: 'GET /api/deals?lat=…&lng=…',
  },
  {
    icon: Users,
    role: 'Member',
    color: 'text-foreground',
    bg: 'bg-secondary border-border',
    title: 'Claims a deal',
    desc: 'A member browsing the partner site taps "Claim". The partner posts to track-click and receives a unique redeem code.',
    code: 'POST /api/partners/track-click',
  },
  {
    icon: Store,
    role: 'Merchant',
    color: 'text-foreground',
    bg: 'bg-secondary border-border',
    title: 'Redeems in-store',
    desc: 'The member shows the code; the merchant validates it at the point of sale. The redemption is recorded against the deal.',
    code: 'POST /api/redeem',
  },
  {
    icon: Wallet,
    role: 'Partner',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Earns commission',
    desc: 'On every confirmed redemption the partner earns commission, credited automatically and paid out from the dashboard.',
    code: 'webhook: redemption.confirmed',
  },
];

function HowItWorks() {
  return (
    <div className="mt-24 border-t border-border pt-16">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-6">
        <Webhook className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">How the system actually works</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">One API, three players, one loop</h2>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Every deal flows from a partner&apos;s integration to a member&apos;s pocket to a merchant&apos;s till — and the
        commission flows back. Here&apos;s the full round trip.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {FLOW_STEPS.map((s, i) => (
          <div key={i} className="relative">
            <div className={cn('h-full rounded-xl border p-5 bg-card', s.bg)}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-md bg-background border border-border flex items-center justify-center">
                  <s.icon className={cn('w-4 h-4', s.color)} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <p className={cn('text-[10px] font-bold uppercase tracking-wider mb-1', s.color)}>{s.role}</p>
              <h3 className="font-bold text-sm mb-2">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
              <code className="inline-block px-2 py-1 bg-background border border-border rounded text-[10px] font-mono text-foreground">
                {s.code}
              </code>
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-background border border-border items-center justify-center">
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Partner website mockups (browser-chrome frames) ──

function BrowserFrame({ url, accent, children }: { url: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="flex-1 flex items-center gap-1.5 mx-2 px-2.5 py-1 rounded-md bg-background border border-border min-w-0">
          <Lock className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
          <span className="text-[10px] font-mono text-muted-foreground truncate">{url}</span>
        </div>
        <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0', accent)}>
          Powered by Offrion
        </span>
      </div>
      {children}
    </div>
  );
}

const MOCK_DEALS = [
  { title: '50% OFF Specialty Coffee', place: 'Downtown Dubai', pay: 18, was: 36, pct: 50, hot: true, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=70' },
  { title: 'Buy 1 Get 1 Brunch', place: 'JBR Walk', pay: 99, was: 198, pct: 50, hot: false, img: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=70' },
  { title: '30% OFF Spa Day', place: 'Palm Jumeirah', pay: 210, was: 300, pct: 30, hot: false, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=70' },
  { title: 'Free Dessert w/ Mains', place: 'City Walk', pay: 0, was: 45, pct: 100, hot: true, img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=70' },
];

function MiniDeal({ d, compact }: { d: typeof MOCK_DEALS[number]; compact?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-background overflow-hidden group hover:border-foreground/30 transition-colors">
      <div className="relative h-16">
        <DealImage src={d.img} alt={d.title} className="w-full h-16" />
        <span className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
          -{d.pct}%
        </span>
        {d.hot && !compact && (
          <span className="absolute top-1.5 left-1.5 bg-secondary text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Flame className="w-2 h-2" /> HOT
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="text-[10px] font-bold truncate">{d.title}</p>
        <p className="text-[9px] text-muted-foreground mt-0.5 flex items-center gap-0.5">
          <MapPin className="w-2 h-2" /> {d.place}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] font-bold">AED {d.pay}</span>
          <span className="text-[9px] text-muted-foreground line-through">AED {d.was}</span>
        </div>
      </div>
    </div>
  );
}

const PARTNER_SITES = [
  {
    id: 'travel',
    name: 'WanderUAE — Travel Guide',
    url: 'wanderuae.com/dubai/deals',
    icon: Plane,
    accent: 'bg-blue-500/10 text-blue-500',
    tagline: 'A city-guide app embeds geo-search to surface deals near the traveller.',
    endpoint: '/api/deals?lat=25.20&lng=55.27&radius=15000',
    render: () => (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Plane className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold">Near you in Dubai</span>
          <span className="ml-auto text-[9px] text-muted-foreground flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" /> 15km radius
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MOCK_DEALS.slice(0, 3).map((d, i) => <MiniDeal key={i} d={d} />)}
        </div>
      </div>
    ),
  },
  {
    id: 'bank',
    name: 'NeoBank — Rewards Tab',
    url: 'app.neobank.ae/rewards',
    icon: Wallet,
    accent: 'bg-emerald-500/10 text-emerald-500',
    tagline: 'A fintech app turns deals into cashback offers inside its rewards tab.',
    endpoint: '/api/deals?categoryId=dining&limit=4',
    render: () => (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Available cashback</p>
            <p className="text-lg font-black text-emerald-500">AED 340 in offers</p>
          </div>
          <Wallet className="w-6 h-6 text-emerald-500/60" />
        </div>
        <div className="space-y-1.5">
          {MOCK_DEALS.slice(0, 3).map((d, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-md border border-border bg-background">
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0">
                <Tag className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate">{d.title}</p>
                <p className="text-[9px] text-muted-foreground">{d.place}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 shrink-0">{d.pct}% back</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'extension',
    name: 'SaverPop — Browser Extension',
    url: 'chrome-extension://saverpop/popup',
    icon: Search,
    accent: 'bg-secondary text-foreground',
    tagline: 'A coupon extension pops local deals while members browse the web.',
    endpoint: '/api/deals?isHot=true&limit=4',
    render: () => (
      <div className="p-4 flex justify-center">
        <div className="w-48 rounded-lg border border-border bg-background overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-secondary">
            <Search className="w-3 h-3 text-foreground" />
            <span className="text-[10px] font-bold">SaverPop found 4 deals</span>
          </div>
          <div className="p-2 space-y-1.5">
            {MOCK_DEALS.slice(0, 2).map((d, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold truncate">{d.title}</p>
                  <p className="text-[8px] text-muted-foreground">{d.place}</p>
                </div>
                <span className="text-[8px] font-bold bg-secondary text-white px-1.5 py-0.5 rounded shrink-0">
                  -{d.pct}%
                </span>
              </div>
            ))}
            <button className="w-full bg-secondary text-white text-[9px] font-bold py-1.5 rounded">
              Apply at checkout
            </button>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'superapp',
    name: 'CityGo — SuperApp Deals Tab',
    url: 'citygo.app/deals',
    icon: Building2,
    accent: 'bg-foreground/10 text-foreground',
    tagline: 'A super-app gives the full deal browser its own tab with categories.',
    endpoint: '/api/deals?search=&minDiscount=20&page=1',
    render: () => (
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
          {['All', 'Dining', 'Spa', 'Coffee'].map((c, i) => (
            <span
              key={c}
              className={cn(
                'text-[9px] font-bold px-2 py-1 rounded-full shrink-0',
                i === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border'
              )}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {MOCK_DEALS.map((d, i) => <MiniDeal key={i} d={d} compact />)}
        </div>
      </div>
    ),
  },
];

function PartnerSiteMockups() {
  return (
    <div className="mt-24 border-t border-border pt-16">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-6">
        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Live in the wild</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">The same API, four very different products</h2>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Partners drop one endpoint into their own UI. Members never leave the partner&apos;s product — they just see
        deals that feel native. Here&apos;s how the same <code className="text-xs font-mono px-1 py-0.5 bg-secondary rounded">/api/deals</code> call looks across real-world integrations.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PARTNER_SITES.map(site => (
          <div key={site.id} className="space-y-3">
            <BrowserFrame url={site.url} accent={site.accent}>
              {site.render()}
            </BrowserFrame>
            <div className="px-1">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0">
                  <site.icon className="w-3 h-3 text-foreground" />
                </div>
                <h3 className="font-bold text-sm">{site.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">{site.tagline}</p>
              <code className="inline-block px-2 py-1 bg-slate-950 rounded text-[10px] font-mono text-emerald-300 overflow-x-auto max-w-full">
                {site.endpoint}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const INTEGRATION_IDEAS = [
  { title: 'Loyalty App Rewards Feed', icon: Star, accent: 'text-amber-500', visual: 'feed', desc: 'Surface relevant local deals inside a points or cashback app.', endpoint: '/api/deals?categoryId=dining&audience=members&limit=3', params: ['categoryId', 'audience', 'limit'] },
  { title: 'Travel / City Guide App', icon: MapPin, accent: 'text-blue-500', visual: 'map', desc: "Show deals near the user's GPS coordinates.", endpoint: '/api/deals?lat=25.2&lng=55.27&radius=15000', params: ['lat', 'lng', 'radius', 'activeNow'] },
  { title: 'Flash Sale Banner', icon: Flame, accent: 'text-foreground', visual: 'banner', desc: 'Highlight only the most urgent, time-limited deals.', endpoint: '/api/deals?isHot=true&activeNow=true&limit=1', params: ['isHot=true', 'activeNow', 'limit'] },
  { title: 'E-commerce Checkout Upsell', icon: ShoppingBag, accent: 'text-emerald-500', visual: 'checkout', desc: 'Show deals from a matching category at checkout.', endpoint: '/api/deals?categoryId=fashion&dealType=bogo&limit=2', params: ['categoryId', 'dealType', 'limit'] },
  { title: 'Newsletter Personalisation', icon: Coffee, accent: 'text-rose-500', visual: 'email', desc: 'Pull deals by tag or audience for weekly email digests.', endpoint: '/api/deals?tags=coffee&audience=subscribers', params: ['tags', 'audience', 'from', 'to'] },
  { title: 'SuperApp Deals Tab', icon: Layers, accent: 'text-foreground', visual: 'grid', desc: 'Full deal browser with category, discount range, event type.', endpoint: '/api/deals?search=&minDiscount=20&page=1', params: ['search', 'minDiscount', 'eventType', 'page'] },
];

type IntegrationIdea = (typeof INTEGRATION_IDEAS)[number];

// Tiny illustrative preview rendered at the top of each integration card,
// so the section reads visually instead of as a wall of text.
function IdeaVisual({ idea }: { idea: IntegrationIdea }) {
  const Icon = idea.icon;
  const wrap = 'h-28 rounded-md border border-border bg-background/60 overflow-hidden p-3';

  switch (idea.visual) {
    case 'feed':
      return (
        <div className={cn(wrap, 'flex flex-col gap-1.5 justify-center')}>
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-2 rounded bg-secondary/70 border border-border px-2 py-1.5">
              <div className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center shrink-0">
                <Tag className="w-2.5 h-2.5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-1.5 rounded-full bg-muted-foreground/30" style={{ width: `${70 - i * 12}%` }} />
              </div>
              <span className={cn('text-[8px] font-bold', idea.accent)}>{40 - i * 10}%</span>
            </div>
          ))}
        </div>
      );
    case 'map':
      return (
        <div className={cn(wrap, 'relative')} style={{ backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
          {[{ t: '20%', l: '25%' }, { t: '55%', l: '60%' }, { t: '35%', l: '75%' }].map((p, i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.t, left: p.l }}>
              <MapPin className={cn('w-4 h-4', idea.accent)} fill="currentColor" />
            </div>
          ))}
          <div className="absolute bottom-2 left-2 right-2 rounded bg-background/90 border border-border px-2 py-1 flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-muted-foreground" />
            <span className="text-[8px] text-muted-foreground">3 deals within 15km</span>
          </div>
        </div>
      );
    case 'banner':
      return (
        <div className={cn(wrap, 'flex items-center')}>
          <div className="w-full rounded-md bg-secondary border border-border px-3 py-2.5 flex items-center gap-2">
            <Flame className="w-4 h-4 text-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-foreground">Flash Sale — 50% OFF</p>
              <p className="text-[8px] text-muted-foreground">Ends in 02:14:09</p>
            </div>
            <span className="text-[8px] font-bold bg-secondary text-white px-1.5 py-0.5 rounded shrink-0">CLAIM</span>
          </div>
        </div>
      );
    case 'checkout':
      return (
        <div className={cn(wrap, 'flex flex-col justify-center gap-1.5')}>
          <div className="flex items-center justify-between text-[8px] text-muted-foreground">
            <span>Subtotal</span><span>AED 240</span>
          </div>
          <div className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-1.5 flex items-center gap-1.5">
            <ShoppingBag className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="text-[8px] font-bold text-foreground flex-1">Add a matching deal &amp; save 30%</span>
            <span className="text-[8px] font-bold text-emerald-500">+ Add</span>
          </div>
          <div className="h-6 rounded bg-foreground/90 flex items-center justify-center">
            <span className="text-[8px] font-bold text-background">Checkout</span>
          </div>
        </div>
      );
    case 'email':
      return (
        <div className={cn(wrap, 'flex flex-col')}>
          <div className="flex items-center gap-1.5 pb-1.5 border-b border-border mb-1.5">
            <Coffee className="w-3 h-3 text-rose-500" />
            <span className="text-[8px] font-bold text-foreground">Your weekly deals digest</span>
          </div>
          {[0, 1].map(i => (
            <div key={i} className="flex items-center gap-1.5 py-1">
              <div className="w-1 h-1 rounded-full bg-rose-500" />
              <div className="h-1.5 rounded-full bg-muted-foreground/25" style={{ width: `${80 - i * 20}%` }} />
            </div>
          ))}
          <div className="mt-auto h-4 rounded bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
            <span className="text-[7px] font-bold text-rose-500">View all 12 deals</span>
          </div>
        </div>
      );
    case 'grid':
    default:
      return (
        <div className={cn(wrap, 'flex flex-col gap-1.5')}>
          <div className="flex gap-1">
            {['All', 'Spa', 'Food'].map((c, i) => (
              <span key={c} className={cn('text-[7px] font-bold px-1.5 py-0.5 rounded-full', i === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-muted-foreground')}>{c}</span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1 flex-1">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="rounded bg-secondary/70 border border-border flex items-center justify-center">
                <Icon className="w-2.5 h-2.5 text-muted-foreground/50" />
              </div>
            ))}
          </div>
        </div>
      );
  }
}
