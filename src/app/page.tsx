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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Partner Infrastructure v2.0</span>
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
        <section id="process" className="py-20 md:py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">How Offrion works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Three simple steps connect local businesses to millions of app users.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  step: '01',
                  icon: ShoppingBag,
                  title: 'Merchants publish deals',
                  desc: 'Business owners create time-limited offers with geo-boundaries, usage caps, and custom terms through a simple dashboard.',
                },
                {
                  step: '02',
                  icon: Code2,
                  title: 'Partners distribute via API',
                  desc: 'Apps, websites, and influencers fetch nearby deals through our API and show them to their users — earning commission on every redemption.',
                },
                {
                  step: '03',
                  icon: QrCode,
                  title: 'Customers redeem & earn',
                  desc: 'Customers scan a QR code at the store. The merchant gets footfall, the partner gets 70% commission, and analytics update instantly.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative p-8 rounded-2xl border border-border bg-card hover:border-primary/25 transition-colors group"
                >
                  <span className="text-6xl font-black text-muted/30 absolute top-4 right-6 select-none">{item.step}</span>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Merchant Section ── */}
        <section className="py-20 md:py-28 px-6 bg-card/50 border-y border-border">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-6">
                <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">For Merchants</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                Publish deals in minutes, reach thousands of apps.
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                No technical knowledge needed. Create a deal, set your terms, and let our partner network drive real customers to your door.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Simple deal creation dashboard',
                  'Geo-fenced targeting with custom radius',
                  'QR-based redemption — no extra hardware',
                  'Real-time revenue and performance analytics',
                  'Instant payouts to your bank via Stripe',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register?role=merchant"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4"
              >
                Start listing deals <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Merchant Dashboard</p>
                  <p className="text-xs text-muted-foreground">Manage your deals & revenue</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Active Deals', value: '12', trend: '+3 this week' },
                  { label: 'Redemptions', value: '847', trend: '+24% vs last month' },
                  { label: 'Revenue', value: 'AED 14,320', trend: 'Ready to withdraw' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground">{row.label}</p>
                      <p className="text-lg font-bold">{row.value}</p>
                    </div>
                    <span className="text-xs text-primary font-medium bg-primary/8 px-2.5 py-1 rounded-full">{row.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Partner Section ── */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/20">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">GET /api/deals</span>
              </div>
              <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <pre className="text-muted-foreground"><code>{`// Fetch nearby deals
const response = await fetch(
  "https://api.offrion.com/api/deals?" +
  "lat=25.2048&lng=55.2708&radius=5km"
);

const { deals } = await response.json();

// Each deal includes:
// - title, description, terms
// - merchant info & location
// - redemption QR endpoint`}</code></pre>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-6">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">For Partners & Developers</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                One API call. Thousands of local deals.
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Integrate Offrion into your app and start earning commissions. 
                Our geo-spatial API returns relevant deals based on location.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'RESTful API with sub-100ms response times',
                  '14+ query filters including geo-search',
                  'Sandbox & production API key management',
                  'Automatic 70/30 commission split',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4"
              >
                Read the API docs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Why Offrion ── */}
        <section className="py-20 md:py-28 px-6 bg-card/50 border-y border-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">Why companies choose Offrion</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built for speed, transparency, and scale.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: 'Geo-Spatial Discovery',
                  desc: 'Deals are indexed with MongoDB GeoJSON. Users see only what\'s nearby and relevant.',
                },
                {
                  icon: Zap,
                  title: 'Instant Redemption',
                  desc: 'Cryptographic QR validation ensures every redemption is secure and settled live.',
                },
                {
                  icon: Wallet,
                  title: 'Transparent Payouts',
                  desc: '70% goes to the partner, 30% to the platform. No hidden fees or complex math.',
                },
                {
                  icon: BarChart3,
                  title: 'Real-time Analytics',
                  desc: 'Track impressions, clicks, conversions, and revenue updated live on your dashboard.',
                },
                {
                  icon: Shield,
                  title: 'Trust & Moderation',
                  desc: 'Every merchant is verified and every deal is reviewed to ensure quality.',
                },
                {
                  icon: Users,
                  title: 'Multi-role Platform',
                  desc: 'Dedicated dashboards for merchants, partners, and admins for clear workflows.',
                },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-background hover:border-primary/20 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="py-20 md:py-28 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
              Ready to grow?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              Join the deals network that connects merchants with millions of users globally.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register?role=merchant"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/15 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Join as Merchant
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/register?role=partner"
                className="w-full sm:w-auto px-8 py-3.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-bold hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
              >
                Join as Partner
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
