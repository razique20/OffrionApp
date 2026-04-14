'use client';

import React from 'react';
import SettingsForm from '@/components/SettingsForm';
import { ShieldAlert, Zap } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">System Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your administrative profile and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <SettingsForm />
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-premium-gradient rounded-[32px] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Zap className="w-16 h-16" />
            </div>
            <h3 className="text-lg font-bold mb-2 relative z-10">Super Admin</h3>
            <p className="text-xs opacity-80 leading-relaxed mb-6 relative z-10">You have full read/write access to platform-wide models and settings.</p>
            <div className="flex items-center gap-2 relative z-10 bg-background/20 backdrop-blur-md px-3 py-1.5 rounded-xl w-fit text-[10px] uppercase font-bold tracking-widest">
               Active Session
            </div>
          </div>

          <div className="p-6 bg-card border border-border rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-amber-500 font-bold text-sm">
               <ShieldAlert className="w-5 h-5" />
               Security Context
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Updating your email will require session re-validation. High-risk actions are logged to the system audit trail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
