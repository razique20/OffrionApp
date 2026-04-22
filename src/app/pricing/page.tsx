import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Globe 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { InteractivePricing } from '@/components/InteractivePricing';
import FAQSupport from '@/components/FAQSupport';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <main className="pt-24 md:pt-32">
        {/* ── Hero Section ── */}
        <section className="px-6 py-12 md:py-20 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Zap className="w-3.5 h-3.5 text-foreground" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground font-mono leading-none">Transparent Infrastructure</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            Scalable costs for <br />
            <span className="text-gradient">performance tech.</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Built for growth. Choose a tier that matches your business velocity, with zero upfront costs on our Starter plan.
          </p>
        </section>

        {/* ── Main Pricing Component ── */}
        <section className="px-6 pb-24 md:pb-32 relative">
          <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-[0.03] -z-10" />
          <InteractivePricing />
        </section>

        {/* ── Feature Comparison Grid ── */}
        <section className="py-24 md:py-32 bg-card/30 border-y border-border px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Deep Technical Comparison</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to know about the capabilities of each tier.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Core Infrastructure',
                  icon: Globe,
                  features: ['Geo-spatial discovery engine', 'QR-based secure redemption', 'Real-time payout ledger', 'Sub-100ms API response']
                },
                {
                  title: 'Scale & Limits',
                  icon: BarChart3,
                  features: ['Unlimited deal capacity (Growth+)', 'High-volume node clusters', 'On-premise database sync', 'Custom rate limiting']
                },
                {
                  title: 'Trust & Safety',
                  icon: ShieldCheck,
                  features: ['SOC-2 compliance logs', 'Mandatory visual verification', 'Fraud detection engine', 'Custom SLA guarantees']
                }
              ].map((group, i) => (
                <div key={i} className="p-8 rounded-3xl border border-border bg-background shadow-none">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-6">
                    <group.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight mb-4">{group.title}</h3>
                  <ul className="space-y-3">
                    {group.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="py-24 md:py-32 px-6 bg-background">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-4">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Common Questions</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">Billing & Payouts</h2>
             </div>
             <FAQSupport />
          </div>
        </section>

        {/* ── Final CTA Section ── */}
        <section className="py-24 md:py-32 px-6 text-center relative overflow-hidden bg-card/50">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Ready to <span className="text-gradient underline decoration-primary/20 underline-offset-8">start scaling?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Launch your first deal in minutes with our Starter plan. No credit card required to begin testing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-md text-sm font-black shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                Create Free Account
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-auto px-10 py-5 bg-card border border-border text-foreground rounded-md text-sm font-black hover:bg-secondary transition-all flex items-center justify-center gap-3"
              >
                Read API Docs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
