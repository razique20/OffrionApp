'use client';

import React, { useState } from 'react';
import { WebhookManagement } from '@/components/partner/WebhookManagement';
import { cn } from '@/lib/utils';

export default function WebhooksPage() {
  const [env, setEnv] = React.useState<'production' | 'sandbox'>('production');

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-muted-foreground">Manage your HTTP endpoints to receive real-time event notifications from Offrion.</p>
        </div>

        <div className="flex bg-secondary/50 p-1 rounded-2xl border border-border shrink-0">
          <button
            onClick={() => setEnv('production')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              env === 'production' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full", env === 'production' ? "bg-primary" : "bg-muted-foreground/30")} />
            Production
          </button>
          <button
            onClick={() => setEnv('sandbox')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              env === 'sandbox' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
             <div className={cn("w-1.5 h-1.5 rounded-full", env === 'sandbox' ? "bg-amber-500" : "bg-muted-foreground/30")} />
            Sandbox
          </button>
        </div>
      </div>
      
      <WebhookManagement environment={env} />
    </div>
  );
}
