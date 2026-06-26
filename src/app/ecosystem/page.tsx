import { InteractiveShowcase } from '@/components/InteractiveShowcase';

import { ShoppingBag, Globe, Zap } from 'lucide-react';

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">

        {/* Platform background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-25 dark:opacity-20"
        />
        {/* Readability overlay */}
        <div className="absolute inset-0 z-0 bg-background/75 dark:bg-background/80" />

        {/* Brand blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-foreground opacity-[0.06] blur-[120px] z-0" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-foreground opacity-[0.05] blur-[100px] z-0" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-foreground opacity-[0.04] blur-[80px] z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-24 mt-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="text-xs font-medium text-muted-foreground ml-1">The Offrion Network</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.05]">
              A fair{' '}
              <span className="text-foreground">
                economic model
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Offrion creates a sustainable triangle of value between producers, distributors, and the core infrastructure. No upfront fees. Everyone wins.
            </p>
          </div>

          {/* Three roles — card grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {/* Merchant */}
            <div className="group relative flex flex-col p-7 rounded-3xl border border-border bg-card hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'var(--secondary)' }}>
                <ShoppingBag className="w-7 h-7" style={{ color: 'var(--foreground)' }} />
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>The Merchant</h4>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Publishes deals and manages inventory. Only pays a platform fee on successful redemptions. No upfront costs.
              </p>
              <div className="mt-6 pt-5 border-t border-border">
                <div className="text-xs font-medium text-muted-foreground mb-1">Revenue Retention</div>
                <div className="font-bold text-3xl text-foreground">85–95%</div>
              </div>
            </div>

            {/* Partner — featured */}
            <div className="group relative flex flex-col p-7 rounded-3xl border border-border bg-card hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="relative flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--secondary)' }}>
                  <Globe className="w-7 h-7" style={{ color: 'var(--foreground)' }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full text-foreground" style={{ background: 'var(--secondary)' }}>Earns most</span>
              </div>
              <h4 className="relative text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>The Partner</h4>
              <p className="relative text-sm text-muted-foreground leading-relaxed flex-1">
                Integrates the deals API into their apps — Fintech, E-commerce, Social. Earns the lion&apos;s share of the generated commission.
              </p>
              <div className="relative mt-6 pt-5 border-t border-border">
                <div className="text-xs font-medium text-muted-foreground mb-1">Commission Share</div>
                <div className="font-bold text-4xl text-foreground">70%</div>
              </div>
            </div>

            {/* Platform */}
            <div className="group relative flex flex-col p-7 rounded-3xl border border-border bg-card hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'var(--secondary)' }}>
                <Zap className="w-7 h-7" style={{ color: 'var(--foreground)' }} />
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>The Platform</h4>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                The Offrion core handles geo-indexing, API high-concurrency, security, and automated commission settlements.
              </p>
              <div className="mt-6 pt-5 border-t border-border">
                <div className="text-xs font-medium text-muted-foreground mb-1">Platform Share</div>
                <div className="font-bold text-3xl text-foreground">30%</div>
              </div>
            </div>
          </div>

          {/* Interactive Tools */}
          <div className="mt-32">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                <span className="text-xs font-medium text-foreground">Platform tooling</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Centralized Tooling</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore the tailored applications built for every participant in the Offrion network.
              </p>
            </div>
            <InteractiveShowcase />
          </div>

        </div>
      </main>
    </div>
  );
}
