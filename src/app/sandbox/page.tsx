'use client';

import React from 'react';
import { 
  Zap, 
  Terminal, 
  Globe, 
  Shield, 
  FlaskConical,
  Code,
  ArrowRight,
  Loader2,
  AlertCircle,
  Tag,
  MapPin,
  Calendar
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PublicApiPlayground } from '@/components/PublicApiPlayground';
import Link from 'next/link';

function SandboxDealsTable() {
  const [deals, setDeals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/sandbox/deals')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setDeals(data.deals || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20 bg-card border border-border rounded-[40px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Fetching sandbox deals...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-12 bg-destructive/5 border border-destructive/20 rounded-[40px] text-center">
      <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
      <h3 className="font-bold text-lg mb-2">Failed to load sandbox data</h3>
      <p className="text-sm text-destructive/70">{error}</p>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-[40px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deal Title</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pricing</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Commission</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {deals.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic text-sm">
                  No deals found in sandbox. Run seed-sandbox.ts to populate.
                </td>
              </tr>
            ) : (
              deals.map((deal) => (
                <tr key={deal._id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl border border-border overflow-hidden bg-secondary/50 shrink-0">
                        {deal.images?.[0] ? (
                          <img src={deal.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tag className="w-5 h-5 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight">{deal.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                           <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Dubai</span>
                           <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Ends {new Date(deal.validUntil).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-[10px] font-bold uppercase tracking-wider">
                      {deal.categoryId?.name || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">AED {deal.discountedPrice}</span>
                      <span className="text-[10px] text-muted-foreground line-through">AED {deal.originalPrice}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span className="font-bold text-sm text-emerald-600">{deal.commissionPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                       <Zap className="w-3 h-3 fill-primary" /> Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                <FlaskConical className="w-3.5 h-3.5" />
                API Sandbox
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Interactive <span className="text-gradient">API Playground</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Test the Offrion discovery and categories API in real-time. Explore hyperparameters, understand our Geo-spatial indexing, and see the response structures instantly.
              </p>
            </div>

            <div className="bg-card border border-border rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
               {/* Decorative Gradient */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-700" />
               
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                  <div className="lg:col-span-1 space-y-8">
                     <div className="space-y-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                           <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold">Real-time Testing</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           Executes requests directly against our test cluster. Experience our sub-80ms response times first-hand.
                        </p>
                     </div>

                     <div className="space-y-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                           <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold">Geo-Ready</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           Try searching with latitude and longitude parameters to see how we deliver hyper-local deals.
                        </p>
                     </div>

                     <div className="pt-6 border-t border-border">
                        <Link 
                           href="/docs"
                           className="flex items-center gap-2 text-xs font-bold text-primary hover:gap-3 transition-all"
                        >
                           Read Full Documentation <ArrowRight className="w-4 h-4" />
                        </Link>
                     </div>
                  </div>

                  <div className="lg:col-span-3">
                     <PublicApiPlayground />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Sandbox Deals Table */}
        <section className="py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
               <div className="max-w-xl">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">Sandbox Dummy Data</h2>
                  <p className="text-muted-foreground">The public sandbox is populated with realistic test data. Below are some of the deals currently available in the sandbox environment.</p>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-2xl border border-border">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Environment: Sandbox</span>
               </div>
            </div>

            <SandboxDealsTable />
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-24 bg-secondary/20 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to track conversions?</h2>
              <p className="text-sm text-muted-foreground">The public sandbox is restricted to read-only endpoints. Authenticated partners get full access to our entire fintech stack.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              <FeatureCard 
                title="Attribution Tracking" 
                desc="Log clicks and successful redemptions to earn performance-based commissions."
                active={false}
              />
              <FeatureCard 
                title="Real-time Webhooks" 
                desc="Get instant POST notifications to your server when a user redeems a deal."
                active={false}
              />
              <FeatureCard 
                title="Partner Ledger" 
                desc="Access full earnings history, pending balances, and automated payouts."
                active={false}
              />
            </div>

            <div className="mt-16 flex justify-center">
               <Link 
                  href="/auth/register"
                  className="px-8 py-4 bg-premium-gradient rounded-full text-white font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-3"
               >
                  Get Started for Free <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ title, desc, active }: { title: string, desc: string, active: boolean }) {
  return (
    <div className="p-8 bg-card border border-border rounded-[32px] relative group overflow-hidden">
      <div className="absolute top-4 right-6 uppercase text-[9px] font-bold tracking-[0.2em] text-muted-foreground/30">
        Partner Auth Required
      </div>
      <h4 className="text-lg font-bold mb-3">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      <div className="mt-6 flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Learn More <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
