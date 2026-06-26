'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const ConditionalNavFooter = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  // Hide navbar/footer on dashboard, admin, auth, and the standalone coupon
  // landing page (/c/[code]), which is a self-contained branded surface.
  const isChromeless = pathname?.startsWith('/merchant') ||
                     pathname?.startsWith('/partner') ||
                     pathname?.startsWith('/admin') ||
                     pathname?.startsWith('/auth') ||
                     pathname?.startsWith('/c/');

  if (isChromeless) {
    return <>{children}</>;
  }

  // Customer app pages keep the marketing chrome on desktop, but on mobile they
  // render as a native-style app (own top bar + bottom tabs), so the marketing
  // Navbar/Footer are hidden on small screens there.
  const isCustomerApp =
    pathname?.startsWith('/account') || pathname?.startsWith('/deals');

  return (
    <>
      <div className={isCustomerApp ? 'hidden md:block' : undefined}>
        <Navbar />
      </div>
      {children}
      <div className={isCustomerApp ? 'hidden md:block' : undefined}>
        <Footer />
      </div>
    </>
  );
};
