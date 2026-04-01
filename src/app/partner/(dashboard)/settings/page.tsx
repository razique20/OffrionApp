'use client';

import React from 'react';
import SettingsForm from '@/components/SettingsForm';

export default function PartnerSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Partner Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your integration and account preferences.</p>
      </div>
      <SettingsForm />
    </div>
  );
}
