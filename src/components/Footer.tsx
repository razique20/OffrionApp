import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-secondary border border-border flex items-center justify-center">
                <span className="text-foreground text-[10px] font-bold">O</span>
              </div>
              <span className="text-lg font-bold tracking-tight">Offrion</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              The scalable deals architecture for modern platforms. Connect merchants with partners through a high-performance API.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8 md:gap-16">
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Platform</p>
              <div className="flex flex-col gap-2">
                <Link href="/features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link href="/partners" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Partners</Link>
                <Link href="/partner/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">API Docs</Link>
                <Link href="/auth/register?role=merchant" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Join as Merchant</Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Legal</p>
              <div className="flex flex-col gap-2">
                <Link href="/legal/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="/legal/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link>
                <Link href="/legal/governance" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Governance Policy</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Offrion Platform. All rights reserved.</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Globe className="w-3 h-3" /> A product from Aethyl Group
          </p>
        </div>
      </div>
    </footer>
  );
};
