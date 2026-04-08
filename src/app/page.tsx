import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Shield, 
  BarChart3, 
  ArrowRight, 
  ShoppingBag, 
  Users, 
  Globe, 
  CheckCircle2,
  Code,
  MousePointer2,
  Rocket,
  Plus
} from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroButtons } from '@/components/HeroButtons';
import { AppCTA } from '@/components/AppCTA';
import { InteractiveShowcase } from '@/components/InteractiveShowcase';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          {/* Background Blurs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full blur-[120px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400 to-primary rounded-full blur-[120px] translate-y-1/2"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Text Content Left */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3 h-3 fill-primary" />
                Next-Gen Deals Platform
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-foreground">
                The Scalable <br className="hidden lg:block"/> <span className="text-gradient">Deals Architecture</span> <br className="hidden lg:block"/> for Modern Platforms.
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                Connect merchants with partners through a high-performance API. Publish deals in minutes, distribute via thousands of apps, and track everything in real-time.
              </p>
              
              <div className="w-full sm:w-auto">
                <HeroButtons />
              </div>
            </div>

            {/* Interactive Showcase Right */}
            <div className="relative w-full z-10 perspective-[2000px]">
              <div className="lg:rotate-y-[-5deg] lg:rotate-x-[5deg] transition-transform duration-700 hover:rotate-0">
                <InteractiveShowcase />
              </div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section id="process" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for scale. Designed for speed.</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to launch a deals network or monetize your existing audience.
              </p>
            </div>

            {/* Feature 1: Merchant */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="order-2 lg:order-1 rounded-[2rem] shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl -z-10 rounded-full"></div>
                <div className="aspect-video w-full rounded-[2rem] overflow-hidden relative">
                   <img src="/images/qr-vision.png" alt="Merchant Portal" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Merchant Control Center</h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Provide local businesses with a powerful dashboard to publish deals, configure Geo-spatial constraints, and track performance in real-time. Say goodbye to complex onboarding and manual deal validation.
                </p>
                <ul className="space-y-3">
                  {['Instant Deal Publication', 'Cryptographic QR Validation', 'Real-time Analytics Dashboard'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 2: Partner */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Developer-First Platform API</h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Integrate seamlessly into any fintech app, map service, or social network. Query rewards by location, perfectly matching your users to relevant nearby discounts in milliseconds.
                </p>
                <ul className="space-y-3">
                  {['Sub-100ms Latency Globally', 'Simple SDKs & Endpoints', 'Automated Commission Splits'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /> <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[2rem] shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl -z-10 rounded-full"></div>
                <div className="aspect-video w-full rounded-[2rem] overflow-hidden relative">
                   <img src="/images/api-network.png" alt="API Network" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Ecosystem & Commission Section */}
        <section id="ecosystem" className="py-24 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">A Fair <span className="text-gradient">Economic Model</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Offrion creates a sustainable triangle of value between producers, distributors, and the core infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
              {/* Connector Lines (Visual only for desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10"></div>
              
              {/* Merchant Role */}
              <div className="bg-card border border-border p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-blue-500">The Merchant</h4>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Publishes deals and manages inventory. Only pays a platform fee on successful redemptions. No upfront costs.
                </p>
                <div className="pt-6 border-t border-border flex items-center justify-between text-sm">
                  <span className="font-medium">Revenue Retention</span>
                  <span className="font-bold text-primary">85-95%</span>
                </div>
              </div>

              {/* Partner Role */}
              <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                  <Users className="w-24 h-24" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-premium-gradient text-white flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-primary">The Partner</h4>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Integrates the deals API into their apps (Fintech, E-commerce, Social). Earns the lion's share of the generated commission.
                </p>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-400">Commission Share</span>
                  <span className="font-bold text-primary">70%</span>
                </div>
              </div>

              {/* Platform Role */}
              <div className="bg-card border border-border p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-foreground">The Platform</h4>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  The Offrion core handles Geo-indexing, API high-concurrency, security, and automated commission settlements.
                </p>
                <div className="pt-6 border-t border-border flex items-center justify-between text-sm">
                  <span className="font-medium">Platform Share</span>
                  <span className="font-bold text-primary">30%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-gradient">Simple Revenue-Based Pricing</h2>
              <p className="text-muted-foreground max-w-xl mx-auto italic">Scale naturally with your success.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Starter', price: 'Free', fee: '15%', features: ['Geo-Spatial Search', '10 Active Deals', 'Partner Dashboard'] },
                { name: 'Pro', price: '$49/mo', fee: '10%', features: ['Unlimited Deals', 'Priority API Support', 'Advanced Analytics', 'Global Distribution'], active: true },
                { name: 'Enterprise', price: 'Custom', fee: '5%', features: ['White-label Portal', 'Dedicated Node Cluster', 'Custom Data Retention', 'SLA Guarantee'] },
              ].map((tier, i) => (
                <div key={i} className={cn(
                  "p-8 rounded-[32px] border transition-all",
                  tier.active ? "bg-slate-900 text-white border-primary shadow-2xl scale-105" : "bg-card border-border hover:border-primary/20"
                )}>
                  <h4 className="text-xl font-bold mb-2">{tier.name}</h4>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-sm opacity-60">/per month</span>
                  </div>
                  <p className="text-sm mb-8 opacity-80">Platform fee: <span className="font-bold">{tier.fee} per deal</span></p>
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="opacity-90">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={cn(
                    "w-full py-3 rounded-xl font-bold transition-all",
                    tier.active ? "bg-premium-gradient text-white" : "bg-secondary hover:bg-primary/10"
                  )}>
                    Select {tier.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center underline decoration-primary/30 underline-offset-8">Common Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Is the Geo-Search API globally redundant?", a: "Yes, our MongoDB cluster uses GeoJSON indexing across multiple regions to ensure <100ms latency worldwide." },
                { q: "How are commissions distributed?", a: "The partner who referred the customer gets 70% of the commission, and the platform retains 30%. This is calculated instantly." },
                { q: "Can we use custom domain for deals?", a: "Merchant Pro and Enterprise tiers support white-label portals with custom CNAME mapping." },
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-secondary/30 rounded-2xl border border-border">
                  <h5 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-premium-gradient rounded-full"></span>
                    {faq.q}
                  </h5>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 flex justify-center">
          <div className="max-w-5xl w-full bg-premium-gradient rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Start distributing rewards.</h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto relative z-10 font-mono italic">
              "Scale from 1 to 1M deals without touching the infrastructure."
            </p>
            <AppCTA />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
