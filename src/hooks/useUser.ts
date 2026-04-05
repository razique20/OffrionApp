'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'merchant' | 'partner';
  avatar?: string;
}

export function useUser() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      // In this app, logout is handled by removing the cookie
      // The most reliable way is hitting a logout endpoint if it exists
      // If not, we can just hit a simple clean-up endpoint
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return { user, loading, logout };
}
