'use client';

import React from 'react';
import { 
  Terminal, 
  Lightbulb, 
  Zap,
  Map as MapIcon,
  Loader2
} from 'lucide-react';
import { ApiPlayground } from '@/components/ApiPlayground';
import { GeoDiscoveryMap } from '@/components/partner/GeoDiscoveryMap';
import { cn } from '@/lib/utils';

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = React.useState<'api' | 'geo'>('api');
  const [apiKey, setApiKey] = React.useState<string | null>(null);
  const [keyLoading, setKeyLoading] = React.useState(false);

  React.useEffect(() => {
    if (activeTab === 'geo' && !apiKey) {
      setKeyLoading(true);
      fetch('/api/partner/keys')
        .then(res => res.json())
        .then(keys => {
          if (Array.isArray(keys)) {
            const sandboxKey = keys.find((k: any) => k.environment === 'sandbox' && k.isActive);
            if (sandboxKey) setApiKey(sandboxKey.key);
          }
        })
        .finally(() => setKeyLoading(false));
    }
  }, [activeTab]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
              Sandbox Only
            </span>
          </div>
          <p className="text-muted-foreground">Test your integrations and explore the API with safe, isolated test data.</p>
        </div>

        <div className="flex bg-secondary/50 p-1 rounded-2xl border border-border shrink-0">
          <button
            onClick={() => setActiveTab('api')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              activeTab === 'api' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <Terminal className="w-3.5 h-3.5" />
            API Explorer
          </button>
          <button
            onClick={() => setActiveTab('geo')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              activeTab === 'geo' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
             <MapIcon className="w-3.5 h-3.5" />
            Geo-Discovery
          </button>
        </div>
      </div>

      {activeTab === 'api' ? (
        <div className="space-y-8">
           {/* Intro Banner */}
           <div className="p-6 bg-primary/5 border border-primary/20 rounded-[32px] flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
              <Terminal className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold">Safe for Experimentation</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                The playground uses our <strong>Sandbox Environment</strong>. All API calls made here target our sandbox collection.
              </p>
            </div>
          </div>

          <ApiPlayground />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            <div className="p-8 bg-card border border-border rounded-[32px] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="font-bold text-lg">Pro Tip: Dummy Data</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our sandbox is pre-populated with high-quality dummy deals. Use these to verify your UI rendering and filtering logic.
              </p>
            </div>
            
            <div className="p-8 bg-card border border-border rounded-[32px] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-lg">Production Ready?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once your logic is verified here, simply switch to your <strong>Production API Key</strong> in your application code to go live.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {keyLoading ? (
            <div className="flex items-center justify-center h-[50vh] bg-card border border-border rounded-[40px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="min-h-[600px] h-auto rounded-[40px] overflow-hidden border border-border shadow-2xl">
              <GeoDiscoveryMap trackingKey={apiKey || ''} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
