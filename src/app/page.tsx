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
  Plus,
  Car,
  Wallet,
  Plane,
  Layers
} from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroButtons } from '@/components/HeroButtons';
import { AppCTA } from '@/components/AppCTA';
import { Logo } from '@/components/Logo';
import { ApiUseCases } from '@/components/ApiUseCases';
import { InteractivePricing } from '@/components/InteractivePricing';
import { FomoTicker } from '@/components/FomoTicker';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[100svh] overflow-hidden flex items-center justify-center py-20">
          {/* ── Frosted Aura Background Blurs ── */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-15">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#5C7E8F] to-[#A2A2A2] rounded-full blur-[120px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#D4DDE2] to-[#5C7E8F] rounded-full blur-[120px] translate-y-1/2"></div>
          </div>
          {/* ── Subtle frost particles ── */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full frost-shimmer"></div>
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary/15 rounded-full frost-shimmer" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-primary/25 rounded-full frost-shimmer" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-5xl w-full mx-auto px-6 z-10 relative">
            
            {/* Minimalist Hero Content */}
            <div className="flex flex-col items-center justify-center text-center w-full">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 leading-[1.1] text-foreground">
                The Scalable <br className="hidden lg:block"/> <span className="text-gradient">Deals Architecture</span> <br className="hidden lg:block"/> for Modern Platforms.
              </h1>

              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-border"></div>
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-gradient">Engineered by Aethyl</span>
                <div className="h-px w-12 bg-border"></div>
              </div>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl px-4 sm:px-0">
                Connect merchants with partners through a high-performance API. Publish deals in minutes, distribute via thousands of apps, and track everything in real-time.
              </p>
              
              <div className="w-full flex justify-center sm:w-auto">
                <HeroButtons />
              </div>
            </div>
          </div>
        </section>



        {/* Features Section */}
        <section id="process" className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for scale. Designed for speed.</h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                Everything you need to launch a deals network or monetize your existing audience.
              </p>
            </div>

            {/* Feature 1: Merchant */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="order-2 lg:order-1 rounded-[2rem] shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent blur-3xl -z-10 rounded-full"></div>
                <div className="aspect-video w-full bg-secondary/30 border border-border rounded-[2rem] overflow-hidden relative flex items-center justify-center p-8 group-hover:border-primary/30 transition-colors">
                   <div className="absolute top-4 left-4 flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-destructive/50"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                   </div>
                   <div className="relative">
                     <div className="w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform relative z-10 border border-primary/20 shadow-xl shadow-primary/10">
                       <ShoppingBag className="w-16 h-16 text-primary" />
                     </div>
                     <div className="w-24 h-24 bg-card rounded-2xl flex items-center justify-center -rotate-6 absolute -bottom-6 -left-6 z-0 border border-border shadow-lg hidden md:flex">
                        <BarChart3 className="w-10 h-10 text-muted-foreground opacity-50" />
                     </div>
                     <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center rotate-12 absolute -top-4 -right-8 z-0 border border-border shadow-lg hidden md:flex">
                        <Shield className="w-8 h-8 text-muted-foreground opacity-50" />
                     </div>
                   </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Merchant Control Center</h3>
                <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                  Provide local businesses with a powerful dashboard to publish deals, configure Geo-spatial constraints, and track performance in real-time. Say goodbye to complex onboarding and manual deal validation.
                </p>
                <ul className="space-y-3">
                  {['Instant Deal Publication', 'Cryptographic QR Validation', 'Real-time Analytics Dashboard'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /> <span className="text-foreground">{item}</span>
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
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Developer-First Platform API</h3>
                <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
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
              <div className="rounded-[2rem] shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl -z-10 rounded-full"></div>
                <div className="aspect-video w-full bg-secondary/30 border border-border rounded-[2rem] overflow-hidden relative flex items-center justify-center p-8 group-hover:border-primary/30 transition-colors">
                   <div className="absolute top-4 left-4 flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-destructive/50"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                   </div>
                   <div className="relative">
                     <div className="w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center -rotate-3 group-hover:-rotate-6 transition-transform relative z-10 border border-primary/20 shadow-xl shadow-primary/10">
                       <Code className="w-16 h-16 text-primary" />
                     </div>
                     <div className="w-24 h-24 bg-card rounded-2xl flex items-center justify-center rotate-6 absolute -bottom-6 right-[-20px] z-0 border border-border shadow-lg hidden md:flex">
                        <Globe className="w-10 h-10 text-muted-foreground opacity-50" />
                     </div>
                     <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center -rotate-12 absolute -top-4 -left-8 z-0 border border-border shadow-lg hidden md:flex">
                        <Layers className="w-8 h-8 text-muted-foreground opacity-50" />
                     </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* API Use Cases Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-[800px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Integrate Anywhere. <span className="text-gradient">Monetize Every Audience.</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                The Offrion API is completely agnostic. Fetch hyper-local deals and inject them seamlessly wherever your users are making decisions.
              </p>
            </div>

            <ApiUseCases />
          </div>
        </section>




        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-secondary/50 to-transparent pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gradient">We grow when you grow.</h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                No fixed API limits. No complex enterprise silos. Your revenue share aggressively scales in your favor.
              </p>
            </div>

            <InteractivePricing />
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
                <div key={i} className="p-6 bg-secondary/30 rounded-2xl border border-border hover:border-primary/20 transition-colors">
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
        <section className="py-16 md:py-24 px-4 sm:px-6 flex justify-center">
          <div className="max-w-5xl w-full bg-premium-gradient rounded-[2rem] md:rounded-[40px] p-8 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-6 relative z-10">
              <Zap className="w-3 h-3 text-white" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Next-Gen Deals Platform</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Start distributing rewards.</h2>
            <p className="text-white/80 text-base md:text-lg mb-10 max-w-xl mx-auto relative z-10 font-mono italic">
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
