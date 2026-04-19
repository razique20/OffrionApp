'use client';

import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  History, 
  ChevronRight,
  Activity,
  Globe,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function PartnerStatusPage() {
  const systems = [
    { name: 'Deals API', status: 'operational', uptime: '99.98%', icon: Globe },
    { name: 'Authentication Service', status: 'operational', uptime: '100%', icon: ShieldCheck },
    { name: 'Core Database', status: 'operational', uptime: '99.99%', icon: Database },
    { name: 'Webhook Engine', status: 'operational', uptime: '99.95%', icon: Zap },
    { name: 'Partner Dashboard', status: 'operational', uptime: '99.99%', icon: Activity },
  ];

  const maintenance = [
    { title: 'Scheduled Database Optimization', time: 'April 15, 2026 - 02:00 UTC', duration: '30 minutes', status: 'Upcoming' },
  ];

  const incidents = [
    { date: 'April 1, 2026', title: 'Increased API Latency', description: 'Resolved - We experienced a brief period of increased latency due to a DNS provider issue.', status: 'Resolved' },
    { date: 'March 22, 2026', title: 'Webhook Delivery Delays', description: 'Resolved - Processing backlog was cleared and system is back to normal.', status: 'Resolved' },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-5xl">
      {/* Overall Header */}
      <div className="p-10 bg-card border border-border rounded-[48px] shadow-none overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-muted rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black mb-2">System Status</h1>
              <p className="text-muted-foreground">Real-time status of Offrion's services and infrastructure.</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-secondary border border-border rounded-md">
              <CheckCircle2 className="w-6 h-6 text-foreground" />
              <span className="font-bold text-foreground">All Systems Operational</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Systems List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            {systems.map((system) => (
              <div key={system.name} className="p-6 bg-card border border-border rounded-md hover:border-border transition-all group">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center">
                       <system.icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                     </div>
                     <div>
                       <h3 className="font-bold text-lg">{system.name}</h3>
                       <p className="text-xs text-muted-foreground">Uptime: {system.uptime}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                     <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                     Operational
                   </div>
                </div>
                {/* Uptime Bar Placeholder (visual only) */}
                <div className="flex gap-1 h-8">
                   {[...Array(30)].map((_, i) => (
                     <div key={i} className="flex-1 rounded-sm bg-primary/30 hover:bg-primary transition-colors cursor-help" title="Operational"></div>
                   ))}
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>30 Days Ago</span>
                  <span>Today</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 pt-8">
             <h2 className="text-2xl font-bold flex items-center gap-3">
                <History className="w-6 h-6 text-foreground" />
                Incident History
             </h2>
             <div className="space-y-6">
                {incidents.map((incident, i) => (
                  <div key={i} className="relative pl-8 border-l-2 border-border pb-8 last:pb-0">
                     <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                     <span className="text-xs font-bold text-muted-foreground mb-1 block">{incident.date}</span>
                     <h4 className="font-bold mb-2">{incident.title}</h4>
                     <p className="text-sm text-muted-foreground leading-relaxed">{incident.description}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="p-8 bg-card border border-border rounded-md shadow-none">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-foreground" />
              Maintenance
            </h3>
            {maintenance.map((m, i) => (
              <div key={i} className="p-4 bg-secondary/50 rounded-md border border-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">{m.status}</span>
                </div>
                <h4 className="text-sm font-bold mb-1">{m.title}</h4>
                <p className="text-[10px] text-muted-foreground mb-3">{m.time}</p>
                <div className="flex items-center gap-2 text-[10px] font-medium opacity-60">
                   <Clock className="w-3 h-3" />
                   Duration: {m.duration}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-secondary border border-border rounded-md text-foreground shadow-none shadow-primary/20">
             <h3 className="text-lg font-bold mb-2">Need Support?</h3>
             <p className="text-sm opacity-80 mb-6">If you're experiencing issues not listed here, our team is here to help.</p>
             <Link 
               href="/partner/support" 
               className="w-full py-4 bg-background text-foreground border border-border text-center font-bold rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
               Contact Support <ChevronRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
