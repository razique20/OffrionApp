'use client';

import React from 'react';
import { ApiPlayground } from '@/components/ApiPlayground';
import { Terminal, Lightbulb } from 'lucide-react';

export default function PlaygroundPage() {
  return (
    <div className="space-y-6 max-w-7xl -mt-2">
      <div>
        <h1 className="text-xl font-bold tracking-tight">API Playground</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Interactive sandbox for testing Offrion endpoints.
        </p>
      </div>

      {/* Intro Banner */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-3xl flex flex-col md:flex-row items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
          <Terminal className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-sm font-bold">Interactive Sandbox Mode</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Requests use Sandbox keys and generate test data isolated from production.
          </p>
        </div>
      </div>

      <ApiPlayground />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        <div className="p-8 bg-card border border-border rounded-[32px] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <h4 className="font-bold">Pro Tip: Use Real IDs</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When testing tracking endpoints, try fetching real Deal IDs from the "List Deals" endpoint first. This ensures your analytics will be correctly mapped in the sandbox dashboard.
          </p>
        </div>
        
        <div className="p-8 bg-card border border-border rounded-[32px] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-blue-500" />
          </div>
          <h4 className="font-bold">Next Steps</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Once you're satisfied with your integration logic, simply swap your Sandbox Key for a Production Key in your production environment variables.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-secondary/30 border border-border rounded-2xl">
        <p className="text-[11px] text-muted-foreground text-center">
          Looking for the technical reference? <a href="/partner/docs" className="text-primary font-bold hover:underline">View Documentation</a>
        </p>
      </div>
    </div>
  );
}
