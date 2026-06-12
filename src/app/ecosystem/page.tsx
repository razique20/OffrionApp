import { InteractiveShowcase } from '@/components/InteractiveShowcase';

import { ShoppingBag, Users, Globe, Zap } from 'lucide-react';

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">

        {/* Brand blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#A855F7] opacity-[0.06] blur-[120px] -z-10" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[#F97316] opacity-[0.05] blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-[#22C55E] opacity-[0.04] blur-[80px] -z-10" />

        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-24 mt-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              <span className="text-xs font-medium text-muted-foreground ml-1">The Offrion Network</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.05]">
              A fair{' '}
              <span className="bg-gradient-to-r from-[#A855F7] via-[#F97316] to-[#EF4444] bg-clip-text text-transparent">
                economic model
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Offrion creates a sustainable triangle of value between producers, distributors, and the core infrastructure. No upfront fees. Everyone wins.
            </p>
          </div>

          {/* Three roles */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#A855F7]/20 to-transparent -z-10" />

            {/* Merchant */}
            <div className="relative p-8 rounded-3xl border border-border bg-card hover:-translate-y-1 transition-all group overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #F9731608, transparent)' }} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: '#F9731615' }}>
                <ShoppingBag className="w-8 h-8" style={{ color: '#F97316' }} />
              </div>
              <h4 className="text-2xl font-bold mb-4" style={{ color: '#F97316' }}>The Merchant</h4>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Publishes deals and manages inventory. Only pays a platform fee on successful redemptions. No upfront costs.
              </p>
              <div className="pt-6 border-t border-border flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Revenue Retention</span>
                <span className="font-bold text-xl bg-gradient-to-r from-[#F97316] to-[#EF4444] bg-clip-text text-transparent">85–95%</span>
              </div>
            </div>

            {/* Partner — featured */}
            <div className="relative p-8 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all"
              style={{ background: 'linear-gradient(135deg, #A855F7, #F97316)' }}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Users className="w-24 h-24 text-white" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white">The Partner</h4>
              <p className="text-sm text-white/80 mb-6 leading-relaxed">
                Integrates the deals API into their apps — Fintech, E-commerce, Social. Earns the lion's share of the generated commission.
              </p>
              <div className="pt-6 border-t border-white/20 flex items-center justify-between text-sm">
                <span className="font-medium text-white/60">Commission Share</span>
                <span className="font-bold text-2xl text-white">70%</span>
              </div>
            </div>

            {/* Platform */}
            <div className="relative p-8 rounded-3xl border border-border bg-card hover:-translate-y-1 transition-all group overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #A855F708, transparent)' }} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: '#A855F715' }}>
                <Zap className="w-8 h-8" style={{ color: '#A855F7' }} />
              </div>
              <h4 className="text-2xl font-bold mb-4" style={{ color: '#A855F7' }}>The Platform</h4>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                The Offrion core handles geo-indexing, API high-concurrency, security, and automated commission settlements.
              </p>
              <div className="pt-6 border-t border-border flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Platform Share</span>
                <span className="font-bold text-xl bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent">30%</span>
              </div>
            </div>
          </div>

          {/* Interactive Tools */}
          <div className="mt-32">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#F97316]" />
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
