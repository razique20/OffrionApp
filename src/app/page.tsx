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
import { LastCallDeals } from '@/components/LastCallDeals';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      <FomoTicker />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          {/* Background Blurs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full blur-[120px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400 to-primary rounded-full blur-[120px] translate-y-1/2"></div>
          </div>

          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-12">
            
            {/* Text Content */}
            <div className="flex flex-col items-center text-center mt-8 lg:mt-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3 h-3 fill-primary" />
                Next-Gen Deals Platform
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-foreground">
                The Scalable <br className="hidden lg:block"/> <span className="text-gradient">Deals Architecture</span> <br className="hidden lg:block"/> for Modern Platforms.
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
                Connect merchants with partners through a high-performance API. Publish deals in minutes, distribute via thousands of apps, and track everything in real-time.
              </p>
              
              <div className="w-full flex justify-center sm:w-auto">
                <HeroButtons />
              </div>
            </div>

            {/* Hero Visual Right (Now Centered Bottom) */}
            <div className="relative w-full flex justify-center items-center z-10 mt-8 mb-12">
              <div className="relative w-full max-w-4xl h-auto">
                <div className="relative bg-card border border-border rounded-[3rem] w-full flex flex-col items-center justify-center p-8 lg:p-16 transition-all duration-700 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
                   
                   <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                     <div className="flex items-center gap-3 bg-secondary/50 dark:bg-white/5 p-4 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                       <div className="p-2 bg-primary/20 text-primary rounded-lg shrink-0">
                         <Zap className="w-5 h-5" />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-foreground">Latency</div>
                         <div className="text-xs text-muted-foreground">&lt;80ms Edge Network</div>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-3 bg-secondary/50 dark:bg-white/5 p-4 rounded-2xl border border-border hover:border-blue-500/30 transition-colors">
                       <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg shrink-0">
                         <Globe className="w-5 h-5" />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-foreground">Geo-Spatial</div>
                         <div className="text-xs text-muted-foreground">Hyper-local Targeting</div>
                       </div>
                     </div>

                     <div className="flex items-center gap-3 bg-secondary/50 dark:bg-white/5 p-4 rounded-2xl border border-border hover:border-emerald-500/30 transition-colors">
                       <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg shrink-0">
                         <Shield className="w-5 h-5" />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-foreground">Security</div>
                         <div className="text-xs text-muted-foreground">Fraud-proof Scanning</div>
                       </div>
                     </div>

                     <div className="flex items-center gap-3 bg-secondary/50 dark:bg-white/5 p-4 rounded-2xl border border-border hover:border-orange-500/30 transition-colors">
                       <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg shrink-0">
                         <BarChart3 className="w-5 h-5" />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-foreground">Analytics</div>
                         <div className="text-xs text-muted-foreground">Real-time Performance</div>
                       </div>
                     </div>

                     <div className="flex items-center gap-3 bg-secondary/50 dark:bg-white/5 p-4 rounded-2xl border border-border hover:border-purple-500/30 transition-colors">
                       <div className="p-2 bg-purple-500/20 text-purple-500 rounded-lg shrink-0">
                         <ShoppingBag className="w-5 h-5" />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-foreground">Terminal</div>
                         <div className="text-xs text-muted-foreground">Instant Redemption</div>
                       </div>
                     </div>

                     <div className="flex items-center gap-3 bg-secondary/50 dark:bg-white/5 p-4 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                       <div className="p-2 bg-primary/20 text-primary rounded-lg shrink-0">
                         <Users className="w-5 h-5" />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-foreground">Partners</div>
                         <div className="text-xs text-muted-foreground">Automated Splits</div>
                       </div>
                     </div>
                   </div>
                </div>
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

        {/* API Use Cases Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-[800px] dark:from-primary/20 dark:to-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
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

        <LastCallDeals />




        {/* Pricing Section */}
        <section id="pricing" className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-secondary/50 to-transparent pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gradient">We grow when you grow.</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
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
