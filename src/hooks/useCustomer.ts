'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  country?: string;
}

/**
 * Fired (on window) whenever the customer session changes — e.g. after
 * login/logout — so any mounted useCustomer re-reads the session. This keeps
 * shared components like the navbar in sync without a full page reload.
 */
export const CUSTOMER_SESSION_EVENT = 'customer-session-change';

export function notifyCustomerSessionChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CUSTOMER_SESSION_EVENT));
  }
}

/**
 * Reads the first-party customer session (customer_token cookie) via
 * /api/customer/auth/me. Separate from useUser, which tracks the staff
 * (admin/merchant/partner) session.
 */
export function useCustomer() {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCustomer();
    window.addEventListener(CUSTOMER_SESSION_EVENT, fetchCustomer);
    return () => window.removeEventListener(CUSTOMER_SESSION_EVENT, fetchCustomer);
  }, [fetchCustomer]);

  return { customer, loading, refresh: fetchCustomer };
}
