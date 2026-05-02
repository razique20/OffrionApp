'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const ConditionalNavFooter = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  // Hide navbar/footer on dashboard, admin, and auth pages
  const isDashboard = pathname?.startsWith('/merchant') || 
                     pathname?.startsWith('/partner') || 
                     pathname?.startsWith('/admin') || 
                     pathname?.startsWith('/auth');

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};
