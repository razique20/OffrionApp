import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Handshake, 
  TrendingUp, 
  Users, 
  Layers, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase mb-6">
                Partner Ecosystem
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">Empower your App with <span className="text-gradient">Premium Deals</span></h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed text-left">
                Join hundreds of platforms that use Offrion to increase user engagement and generate new revenue streams. Our API is built for scale.
              </p>
              <div className="flex-gap-4">
                <Link href="/auth/register?role=partner" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all">
                  Become a Partner
                </Link>
                <Link href="/partner/docs" className="px-8 py-4 bg-secondary text-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all">
                  Read API Docs
                </Link>
              </div>
            </div>
            <div className="relative aspect-square md:aspect-auto">
              <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10"></div>
              <div className="rounded-[40px] h-full overflow-hidden relative">
                <img 
                  src="/images/api-network.png" 
                  alt="API Network Illustration" 
                  className="w-full h-full object-cover rounded-[38px] opacity-90"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <section className="py-24 bg-card/50 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-16 text-left">The Economic Model</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { t: 'Integrate', d: 'Connect our API to your fintech, e-commerce, or lifestyle app in minutes.' },
                 { t: 'Distribute', d: 'Show highly relevant, geo-fenced deals to your users using our AI ranking.' },
                 { t: 'Earn', d: 'Receive an automated 70% share of every commission generated from your traffic.' }
               ].map((step, i) => (
                 <div key={i} className="p-8 bg-background border border-border rounded-[32px] text-left hover:border-primary/30 transition-all group">
                    <div className="text-4xl font-black text-secondary mb-4 group-hover:text-primary/20 transition-colors">0{i+1}</div>
                    <h3 className="text-xl font-bold mb-4">{step.t}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.d}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
           <h2 className="text-4xl font-bold mb-8">Ready to scale your rewards?</h2>
           <Link href="/auth/register?role=partner" className="inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-2xl text-xl font-bold hover:bg-slate-800 transition-all">
              Launch Partner Portal <ArrowRight className="w-6 h-6" />
           </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
