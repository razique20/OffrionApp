'use client';

import React from 'react';
import SettingsForm from '@/components/SettingsForm';

export default function PartnerSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account & Settings</h1>
        <p className="text-muted-foreground">Manage your profile and integration preferences.</p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         <SettingsForm />
      </div>
    </div>
  );
}
