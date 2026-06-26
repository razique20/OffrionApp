'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ChromeConfig {
  title: string;
  back?: boolean;
  bottomBar?: React.ReactNode;
  /** Whether to show the persistent shell (top bar + bottom tabs). Default true. */
  showShell?: boolean;
}

interface ChromeCtx extends ChromeConfig {
  setChrome: (c: ChromeConfig) => void;
}

const Ctx = createContext<ChromeCtx | null>(null);

export function MobileChromeProvider({ children }: { children: React.ReactNode }) {
  const [chrome, setChrome] = useState<ChromeConfig>({ title: '', showShell: true });
  return (
    <Ctx.Provider value={{ ...chrome, setChrome }}>{children}</Ctx.Provider>
  );
}

export function useMobileChrome() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useMobileChrome must be used within MobileChromeProvider');
  return ctx;
}

/**
 * Pages call this to configure the persistent mobile shell (title, back button,
 * sticky bottom bar) without remounting the shell itself. Effect re-runs when
 * the passed values change.
 */
export function useSetMobileChrome(config: ChromeConfig, deps: React.DependencyList) {
  const { setChrome } = useMobileChrome();
  useEffect(() => {
    setChrome(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
