import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-premium-gradient flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">O</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Offrion</span>
        </div>
        <div className="flex items-center gap-8">
           <Link href="/features" className="text-xs text-muted-foreground hover:text-primary transition-colors">Features</Link>
           <Link href="/partners" className="text-xs text-muted-foreground hover:text-primary transition-colors">Partners</Link>
           <Link href="/partner/docs" className="text-xs text-muted-foreground hover:text-primary transition-colors">API Docs</Link>
           <Link href="/auth/register?role=merchant" className="text-xs text-muted-foreground hover:text-primary transition-colors">Join as Merchant</Link>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Offrion Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};
