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
  Code2,
  Car,
  Wallet,
  Plane,
  Tag,
  Ticket,
  TrendingUp,
  QrCode,
  ChevronRight
} from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroButtons } from '@/components/HeroButtons';
import { HeroVisual } from '@/components/HeroVisual';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <main>
        {/* ── Hero Section ── */}
        <section className="relative min-h-[90svh] lg:min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--primary)_0%,transparent_50%)] opacity-[0.03] dark:opacity-[0.07]"></div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
            
            {/* Left Content */}
            <div className="flex flex-col items-start text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] font-bold text-foreground uppercase tracking-[0.2em]">Partner Infrastructure v2.0</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                Scale your deals <br />
                <span className="text-gradient">effortlessly.</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000">
                The high-performance API that connects hyper-local merchants with global partner applications. Build rewards, monetize audiences, and track growth in real-time.
              </p>
              
              <div className="w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <HeroButtons />
              </div>

              <div className="mt-10 flex items-center gap-8 border-t border-border/50 pt-8 w-full animate-in fade-in slide-in-from-bottom-7 duration-1000">
                <div>
                  <p className="text-xl font-bold">140+</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Active Partners</p>
                </div>
                <div className="w-px h-8 bg-border/50"></div>
                <div>
                  <p className="text-xl font-bold">AED 2.4M</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Payouts Sent</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000">
              <HeroVisual />
            </div>

          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="border-y border-border bg-card/40">
          <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '<100ms', label: 'API Latency' },
              { value: '70%', label: 'Partner Commission' },
              { value: 'Geo-Spatial', label: 'Deal Discovery' },
              { value: '24/7', label: 'Real-time Analytics' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="process" className="py-24 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-4">
                <Zap className="w-3.5 h-3.5 text-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground font-mono leading-none">The Workflow</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 max-w-2xl">
                Redemption in <span className="text-gradient">Three Acts</span>
              </h2>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                Offrion bridges the gap between local commerce and digital discovery through a streamlined, automated ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector lines (Desktop) */}
              <div className="hidden md:block absolute top-1/4 left-[30%] right-[30%] h-px bg-gradient-to-r from-border/5 via-primary/20 to-border/5 -z-10" />
              
              {[
                {
                  step: '01',
                  icon: ShoppingBag,
                  title: 'Publish',
                  subtitle: 'Merchants go live',
                  desc: 'Business owners create geo-fenced offers with usage caps and custom terms via an intuitive dashboard.',
                  delay: '0s'
                },
                {
                  step: '02',
                  icon: Code2,
                  title: 'Distribute',
                  subtitle: 'Partners fetch deals',
                  desc: 'Apps fetch nearby deals via our sub-100ms API, earning automated commissions on every verified usage.',
                  delay: '0.2s'
                },
                {
                  step: '03',
                  icon: QrCode,
                  title: 'Redeem',
                  subtitle: 'Real-time settlement',
                  desc: 'Customers scan at the store. The split is settled live, and performance metrics update instantly.',
                  delay: '0.4s'
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: item.delay }}
                >
                  <div className="mb-8 relative">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-card border border-border flex items-center justify-center shadow-none relative z-10 group-hover:border-primary/30 group-hover:shadow-primary/5 transition-all">
                      <item.icon className="w-7 h-7 text-foreground" />
                    </div>
                    <span className="absolute -top-4 -left-4 text-4xl font-black text-foreground/5 select-none -z-0">{item.step}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                      <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">{item.subtitle}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pr-4 opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Merchant Section ── */}
        <section className="py-24 md:py-32 px-6 bg-card/30 border-y border-border overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-6">
                <ShoppingBag className="w-3.5 h-3.5 text-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground font-mono leading-none">For Merchants</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]">
                Fill empty tables,<br />not expensive <span className="text-gradient">ads.</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Connect your business to a massive network of discovery apps with zero upfront marketing costs. Pay only when customers actually walk through your door.
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
                {[
                  'Geo-fenced targeting',
                  'QR-based redemption',
                  'Usage caps & scheduling',
                  'Instant Stripe payouts',
                  'Real-time traffic data',
                  'Verified footfall'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold">
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-foreground" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-6">
                <Link
                  href="/auth/register?role=merchant"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-md text-sm font-black shadow-none hover:shadow-none hover:-translate-y-0.5 transition-all"
                >
                  Start Listing Deals
                </Link>
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">+200</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-secondary blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-3xl border border-border bg-background p-8 shadow-none">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md bg-secondary border border-border flex items-center justify-center shadow-none">
                      <ShoppingBag className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <p className="text-base font-black tracking-tight">Ecosystem Ledger</p>
                      <p className="text-xs text-muted-foreground">Live transaction feed</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/20">
                    LIVE SYSTEM
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'Merchant Net Revenue', value: 'AED 42,910', trend: '+12.4%', up: true },
                    { label: 'Partner Commission Paid', value: 'AED 12,873', trend: '+8.2%', up: true },
                    { label: 'System Requests', value: '1.2M', trend: 'STABLE', up: true },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-md bg-secondary/20 border border-border/40 group/row hover:bg-secondary/40 transition-colors">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{row.label}</p>
                        <p className="text-xl font-black tracking-tight">{row.value}</p>
                      </div>
                      <span className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-full border",
                        row.up ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>{row.trend}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Partner Section ── */}
        <section id="developers" className="py-24 md:py-32 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute -inset-4 bg-muted blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-none">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/40" />
                    <span className="ml-3 text-[10px] text-muted-foreground font-mono italic">endpoint: /api/deals/discovery</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-secondary border border-border text-[9px] text-muted-foreground font-mono">200 OK</div>
                </div>
                <div className="p-8 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto">
                  <div className="flex gap-4">
                    <span className="text-foreground font-bold">➜</span>
                    <div className="space-y-4">
                      <div>
                        <span className="text-muted-foreground mb-1 block">// Fetch geo-optimized deals</span>
                        <p className="text-emerald-400">
                          const <span className="text-foreground">deals</span> = await Offrion.<span className="text-foreground">fetchNearby</span>({ "{" } <br />
                          <span className="pl-4">radius: "5km",</span> <br />
                          <span className="pl-4">limit: 25</span> <br />
                          { "}" });
                        </p>
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <span className="text-muted-foreground mb-1 block">// Success response</span>
                        <p className="text-foreground/80">
                          { "{" } <br />
                          <span className="pl-4">"id": "deal_8x92",</span> <br />
                          <span className="pl-4 text-emerald-400">"commission": "70%",</span> <br />
                          <span className="pl-4">"status": "verified"</span> <br />
                          { "}" }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-6">
                <Code2 className="w-3.5 h-3.5 text-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground font-mono leading-none">For Partners</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]">
                Infinite Supply.<br />One Integration.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Plug into a real-time stream of high-converting local deals. Our geo-spatial API handles the heavy lifting, and the 70/30 commission split is settled instantly.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {[
                  { title: 'Sub-100ms Latency', desc: 'Edgecached delivery layer for global speed.' },
                  { title: 'Auto-Settled Leads', desc: 'Instant payouts upon QR verification.' },
                  { title: 'Geo-V1 Engine', desc: 'Advanced radius and point-of-interest filters.' },
                  { title: 'Live Webhooks', desc: 'Sync redemption events to your custom backend.' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <h4 className="text-sm font-black tracking-tight">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/docs"
                className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground rounded-md text-sm font-black border border-border hover:bg-muted transition-all group"
              >
                Access API Keys
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Why Offrion (Benefits) ── */}
        <section className="py-24 md:py-32 px-6 bg-card/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-4">
                <Shield className="w-3.5 h-3.5 text-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground font-mono leading-none">The Foundation</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                Built for <span className="text-gradient">Scale.</span>
              </h2>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                High-performance architecture meeting the demands of modern commerce ecosystems.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: 'Geo-Spatial Discovery',
                  desc: 'Proprietary indexing for sub-100ms discovery of relevant, nearby offers.',
                },
                {
                  icon: Zap,
                  title: 'Instant Redemption',
                  desc: 'Cryptographic QR validation ensures every redemption is secure and settled live.',
                },
                {
                  icon: Wallet,
                  title: 'Automated Ledger',
                  desc: 'Transparent 70/30 commission splits settled via Stripe Connect instantly.',
                },
                {
                  icon: BarChart3,
                  title: 'Live Engine Metrics',
                  desc: 'Track impressions, conversions, and revenue flow updated in real-time.',
                },
                {
                  icon: Shield,
                  title: 'Trust & Verification',
                  desc: 'Mandatory verification for every merchant and deal to ensure platform quality.',
                },
                {
                  icon: Users,
                  title: 'Unified Dashboards',
                  desc: 'Optimized workspaces for merchants, partners, and administrators.',
                },
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2rem] border border-border bg-background hover:border-border hover:shadow-none hover:shadow-primary/5 transition-all group">
                  <div className="w-12 h-12 rounded-md bg-secondary/30 text-foreground flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA Section ── */}
        <section className="py-24 md:py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-muted -z-10" />
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              The redemption network is <br />
              now <span className="text-gradient underline decoration-primary/20 underline-offset-8">strictly open.</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Join the ecosystem today and start monetizing local discovery with industry-leading infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link
                href="/auth/register?role=merchant"
                className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-md text-sm font-black shadow-none hover:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                Become a Merchant
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/register?role=partner"
                className="w-full sm:w-auto px-10 py-5 bg-card border border-border text-foreground rounded-md text-sm font-black hover:bg-secondary/50 transition-all flex items-center justify-center gap-3"
              >
                Access API Gateway
                <Code2 className="w-4 h-4" />
              </Link>
            </div>
            
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.2em] pt-12">
              SOC-2 Type II In Progress • 256-bit AES Encryption
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
