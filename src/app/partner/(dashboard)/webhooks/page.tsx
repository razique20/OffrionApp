'use client';

import React, { useState } from 'react';
import { WebhookManagement } from '@/components/partner/WebhookManagement';
import { cn } from '@/lib/utils';

export default function WebhooksPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-muted-foreground">Manage your HTTP endpoints to receive real-time event notifications from Offrion.</p>
        </div>
      </div>
      
      <WebhookManagement />
    </div>
  );
}
