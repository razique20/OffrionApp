import Link from 'next/link';
import {
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Zap,
  ShieldCheck,
  BarChart3,
  Globe,
} from 'lucide-react';
import FAQSupport from '@/components/FAQSupport';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 md:pt-32">

        {/* ── Hero (themed background) ── */}
        <div className="relative overflow-hidden bg-background">
          {/* On-brand layered background: subtle grid + monochrome glows */}
          <div
            className="absolute inset-0 z-0 opacity-[0.18] dark:opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage:
                'radial-gradient(ellipse 80% 70% at 50% 0%, #000 40%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 70% at 50% 0%, #000 40%, transparent 100%)',
            }}
          />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full bg-foreground opacity-[0.07] blur-[120px] z-0" />
          <div className="absolute top-10 left-[12%] w-[320px] h-[320px] rounded-full bg-foreground opacity-[0.04] blur-[110px] z-0" />
          <div className="absolute top-10 right-[12%] w-[320px] h-[320px] rounded-full bg-foreground opacity-[0.04] blur-[110px] z-0" />
          <div className="absolute inset-x-0 bottom-0 h-32 z-0 bg-gradient-to-b from-transparent to-background" />

        <section className="relative z-10 px-6 py-12 md:py-20 flex flex-col items-center text-center max-w-4xl mx-auto overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full bg-foreground opacity-[0.06] blur-[80px] z-0" />

          <div className="inline-flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="text-xs font-medium text-muted-foreground ml-1">Now in Beta</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            Free while we&apos;re in{' '}
            <span className="text-foreground">
              beta.
            </span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            We&apos;re building Offrion alongside our first partners. The platform is free to use during beta — no plans, no
            credit card. Pricing arrives once we&apos;ve shaped it together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-10 py-4 rounded-full text-sm font-semibold text-background hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
              style={{ background: 'var(--foreground)' }}
            >
              Get early access
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto px-10 py-4 bg-secondary border border-border text-foreground rounded-full text-sm font-semibold hover:bg-secondary/70 transition-all flex items-center justify-center gap-3"
            >
              <Zap className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
              Read API Docs
            </Link>
          </div>
          <p className="text-xs text-muted-foreground pt-6">
            Free during beta &middot; No credit card &middot; Early partners help shape pricing
          </p>
        </section>
        </div>

        {/* ── Feature Comparison ── */}
        <section className="py-24 md:py-32 bg-card/30 border-y border-border px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-foreground opacity-[0.04] blur-[100px] -z-10" />
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-4">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--foreground)' }} />
                <span className="text-xs font-medium text-foreground">What's included</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Deep Technical Comparison</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to know about the capabilities of each tier.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Core Infrastructure',
                  icon: Globe,
                  color: 'var(--foreground)',
                  features: ['Geo-spatial discovery engine', 'QR-based secure redemption', 'Real-time payout ledger', 'Sub-100ms API response'],
                },
                {
                  title: 'Scale & Limits',
                  icon: BarChart3,
                  color: 'var(--foreground)',
                  features: ['Unlimited deal capacity', 'High-volume node clusters', 'On-premise database sync', 'Custom rate limiting'],
                },
                {
                  title: 'Trust & Safety',
                  icon: ShieldCheck,
                  color: 'var(--foreground)',
                  features: ['SOC-2 compliance logs', 'Mandatory visual verification', 'Fraud detection engine', 'Custom SLA guarantees'],
                },
              ].map((group) => (
                <div key={group.title} className="p-8 rounded-3xl border border-border bg-background hover:-translate-y-1 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(135deg, ${group.color}08, transparent)` }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{ background: `${group.color}15` }}>
                    <group.icon className="w-5 h-5" style={{ color: group.color }} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-4">{group.title}</h3>
                  <ul className="space-y-3">
                    {group.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: group.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 md:py-32 px-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-4">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Common Questions</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Beta & Payouts</h2>
            </div>
            <FAQSupport />
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-24 md:py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10" style={{ background: 'var(--secondary)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-border" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-foreground opacity-[0.06] blur-[80px] -z-10" />

          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Ready to{' '}
              <span className="text-foreground">
                start scaling?
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Launch your first deal in minutes. Free during beta — no credit card required to begin testing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-10 py-4 rounded-full text-sm font-semibold text-background hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                style={{ background: 'var(--foreground)' }}
              >
                Create Free Account
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-auto px-10 py-4 bg-secondary border border-border text-foreground rounded-full text-sm font-semibold hover:bg-secondary/70 transition-all flex items-center justify-center gap-3"
              >
                <Zap className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                Read API Docs
              </Link>
            </div>
            <p className="text-xs text-muted-foreground pt-6">
              Free to start &middot; No credit card &middot; Cancel anytime
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
