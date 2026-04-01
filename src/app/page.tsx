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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          {/* Background Blurs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[120px] translate-y-1/2"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8">
              <Zap className="w-3 h-3 fill-primary" />
              Next-Gen Deals Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] text-foreground">
              The Scalable <span className="text-gradient">Deals Architecture</span> for Modern Platforms.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect merchants with partners through a high-performance API. Publish deals in minutes, distribute via thousands of apps, and track everything in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/merchant/dashboard" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Start as Merchant <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/partner/dashboard" 
                className="w-full sm:w-auto px-8 py-4 bg-card border border-border rounded-2xl text-lg font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2"
              >
                Integrate API
              </Link>
            </div>

            {/* Developer Experience Section (Replaces Hero Image) */}
            <div className="mt-20 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
               {/* Terminal Mockup */}
               <div className="lg:col-span-3 bg-slate-950 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                     </div>
                     <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-4">Terminal — bash</span>
                  </div>
                  <div className="p-8 font-mono text-sm leading-relaxed text-left">
                     <div className="flex gap-4 mb-4">
                        <span className="text-emerald-500">➜</span>
                        <span className="text-white">curl -X GET "https://api.offrion.com/v1/deals" \</span>
                     </div>
                     <div className="flex gap-4 mb-4 pl-8">
                        <span className="text-blue-400">-H "x-api-key: offr_live_8k2l9..." \</span>
                     </div>
                     <div className="flex gap-4 mb-8 pl-8">
                        <span className="text-blue-400">-d "radius=5000&lat=40.71&lng=-74.00"</span>
                     </div>
                     
                     <div className="space-y-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <p className="text-white/40 italic">// Recieved 200 OK</p>
                        <p className="text-blue-300">{"{"}</p>
                        <p className="pl-4 text-emerald-300">"status": "success",</p>
                        <p className="pl-4 text-emerald-300">"deals": [ {"{"} "title": "50% OFF Coffee", "dist": "0.4km" {"}"} ]</p>
                        <p className="text-blue-300">{"}"}</p>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Code className="w-40 h-40 text-white" />
                  </div>
               </div>

               {/* Live Preview Card */}
               <div className="lg:col-span-2 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-3xl border border-primary/20 p-8 flex flex-col justify-center text-left backdrop-blur-3xl shadow-xl">
                  <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                     <Rocket className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Live Integration</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                     Our SDK handles the heavy lifting. Integrate hyper-local deals into your mobile app or website with just 3 lines of code.
                  </p>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                        <span className="text-xs font-bold uppercase tracking-wider">99.9% API Uptime</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                        <span className="text-xs font-bold uppercase tracking-wider">&lt; 80ms Latency</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="process" className="py-24 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How it Works</h2>
              <p className="text-muted-foreground italic">Getting started is easier than you think.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Merchant Path */}
              <div className="p-8 bg-card border border-border rounded-[32px] relative overflow-hidden group flex flex-col">
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 relative border border-border">
                  <img 
                    src="/images/qr-vision.png" 
                    alt="Merchant Deal Management & QR" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</div>
                  For Merchants
                </h3>
                <ul className="space-y-6">
                  {[
                    { icon: Plus, t: 'Create Profile', d: 'Register and set up your merchant identity.' },
                    { icon: Rocket, t: 'Publish Deals', d: 'Launch discounts with Geo-metadata and usage limits.' },
                    { icon: BarChart3, t: 'Track Success', d: 'Monitor performance via your real-time dashboard.' },
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="mt-1"><step.icon className="w-5 h-5 text-primary" /></div>
                      <div>
                        <p className="font-bold">{step.t}</p>
                        <p className="text-sm text-muted-foreground">{step.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Partner Path */}
              <div className="p-8 bg-card border border-border rounded-[32px] relative overflow-hidden group flex flex-col">
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 relative">
                  <img 
                    src="/images/api-network.png" 
                    alt="API Integration" 
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</div>
                  For Partners
                </h3>
                <ul className="space-y-6">
                  {[
                    { icon: Globe, t: 'Get API Key', d: 'Instantly generate keys from your partner portal.' },
                    { icon: MousePointer2, t: 'Embed Deals', d: 'Query deals by location/category and embed in your app.' },
                    { icon: Zap, t: 'Earn Commission', d: 'Automated 70% revenue split on every conversion.' },
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="mt-1"><step.icon className="w-5 h-5 text-primary" /></div>
                      <div>
                        <p className="font-bold">{step.t}</p>
                        <p className="text-sm text-muted-foreground">{step.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
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
                <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-primary">The Partner</h4>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Integrates the deals API into their apps (Fintech, E-commerce, Social). Earns the lion's share of the generated commission.
                </p>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-sm">
                  <span className="font-medium">Commission Share</span>
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
                    tier.active ? "bg-primary text-white" : "bg-secondary hover:bg-primary/5"
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
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
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
          <div className="max-w-5xl w-full bg-primary rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Start distributing rewards.</h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto relative z-10 font-mono italic">
              "Scale from 1 to 1M deals without touching the infrastructure."
            </p>
            <Link 
              href="/auth/register" 
              className="inline-block px-10 py-5 bg-white text-primary rounded-2xl text-lg font-bold shadow-xl hover:bg-slate-50 transition-all active:scale-95 relative z-10"
            >
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
