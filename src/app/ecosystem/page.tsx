import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { InteractiveShowcase } from '@/components/InteractiveShowcase';
import { ShoppingBag, Users, Globe, Zap } from 'lucide-react';

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Background blurs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 to-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-[100px] translate-y-1/2 pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 mt-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">A Fair <span className="text-gradient">Economic Model</span></h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Offrion creates a sustainable triangle of value between producers, distributors, and the core infrastructure. No upfront fees. Everyone wins.
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

          {/* Interactive Platform Tools */}
          <div className="mt-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Centralized Tooling</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore the tailored applications built for every participant in the Offrion network.
              </p>
            </div>
            
            <InteractiveShowcase />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
