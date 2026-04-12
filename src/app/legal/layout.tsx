import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
