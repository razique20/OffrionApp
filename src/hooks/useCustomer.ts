'use client';

import { useState, useEffect } from 'react';

export interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  country?: string;
}

/**
 * Reads the first-party customer session (customer_token cookie) via
 * /api/customer/auth/me. Separate from useUser, which tracks the staff
 * (admin/merchant/partner) session.
 */
export function useCustomer() {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch('/api/customer/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCustomer(data.customer ?? null);
        } else {
          setCustomer(null);
        }
      } catch {
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, []);

  return { customer, loading };
}
