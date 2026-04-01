'use client';

import React, { useState } from 'react';
import { 
  Book, 
  Code, 
  Terminal, 
  Globe, 
  Shield, 
  Zap, 
  Copy, 
  CheckCircle2,
  ChevronRight,
  Info,
  Layers,
  MapPin,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PartnerDocsPage() {
  const [activeTab, setActiveTab] = useState('getting-started');

  return (
    <div className="flex flex-col lg:flex-row gap-12 pb-20">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 shrink-0 space-y-8">
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 ml-3">Getting Started</h4>
          <nav className="space-y-1">
            <DocNavItem 
              active={activeTab === 'getting-started'} 
              onClick={() => setActiveTab('getting-started')}
              icon={Book}
              label="Introduction" 
            />
            <DocNavItem 
              active={activeTab === 'auth'} 
              onClick={() => setActiveTab('auth')}
              icon={Shield}
              label="Authentication" 
            />
          </nav>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 ml-3">API Reference</h4>
          <nav className="space-y-1">
            <DocNavItem 
              active={activeTab === 'list-deals'} 
              onClick={() => setActiveTab('list-deals')}
              icon={Layers}
              label="List Deals" 
            />
            <DocNavItem 
              active={activeTab === 'filtering'} 
              onClick={() => setActiveTab('filtering')}
              icon={Zap}
              label="Filtering & Search" 
            />
            <DocNavItem 
              active={activeTab === 'geo'} 
              onClick={() => setActiveTab('geo')}
              icon={MapPin}
              label="Geo-spatial Search" 
            />
            <DocNavItem 
              active={activeTab === 'commission'} 
              onClick={() => setActiveTab('commission')}
              icon={DollarSign}
              label="Commissions" 
            />
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 max-w-4xl">
        {activeTab === 'getting-started' && (
          <DocSection title="API Introduction">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Offrion's Deals-as-a-Service API enables you to programmatically access thousands of merchant deals across dozens of categories. Integrated into your app to provide instant value to your users.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <FeatureHighlight 
                 title="Fast & Global" 
                 desc="Edge-accelerated API responses with low latency globally." 
                 icon={Zap}
               />
               <FeatureHighlight 
                 title="Real-time Tracking" 
                 desc="Every impression and conversion is tracked and attributed back to you." 
                 icon={CheckCircle2}
               />
            </div>
            <h3 className="text-2xl font-bold mb-4">Base URL</h3>
            <div className="p-4 bg-secondary font-mono rounded-xl border border-border">
              https://api.offrion.com/api
            </div>
          </DocSection>
        )}

        {activeTab === 'auth' && (
          <DocSection title="Authentication">
            <p className="text-muted-foreground mb-8">
              All API requests must be authenticated using your partner API Key. You can generate keys from your dashboard.
            </p>
            <h4 className="font-bold mb-4">Header Requirement</h4>
            <div className="bg-slate-900 rounded-2xl overflow-hidden p-6 mb-8 shadow-xl">
               <pre className="text-slate-300 font-mono text-sm leading-6">
{`x-api-key: your_api_key_here`}
               </pre>
            </div>
            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-4">
               <Info className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
               <p className="text-sm text-muted-foreground leading-relaxed">
                 <strong>Keep your keys safe:</strong> If a key is compromised, revoke it immediately from the dashboard and generate a new one.
               </p>
            </div>
          </DocSection>
        )}

        {activeTab === 'list-deals' && (
          <DocSection title="List Deals">
            <p className="text-muted-foreground mb-8 text-lg">Retrieve a list of active deals currently being offered by merchants on the platform.</p>
            
            <div className="flex items-center gap-2 mb-6">
               <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded text-xs font-bold font-mono">GET</span>
               <code className="text-sm font-bold font-mono">/deals</code>
            </div>

            <h4 className="text-lg font-bold mb-6">Request Example</h4>
            <CodeBlock 
              code={`curl -X GET "https://api.offrion.com/api/deals" \\
  -H "x-api-key: your_key"`}
            />

            <h4 className="text-lg font-bold mb-6 mt-12">Response Format</h4>
            <CodeBlock 
              language="json"
              code={`{
  "count": 1,
  "deals": [
    {
      "id": "deal_123",
      "title": "50% Off Burger",
      "discountedPrice": 12.00,
      "originalPrice": 24.00,
      "commissionPercentage": 10
    }
  ]
}`}
            />
          </DocSection>
        )}

        {activeTab === 'filtering' && (
          <DocSection title="Filtering & Search">
            <p className="text-muted-foreground mb-12 italic">Precision targeting for your users.</p>
            
            <div className="space-y-12">
               <ParamTable 
                 title="Categories & Prices"
                 params={[
                   { name: 'categoryId', type: 'string', desc: 'Filter by specific category ID.' },
                   { name: 'minPrice', type: 'number', desc: 'Minimum discounted price threshold.' },
                   { name: 'maxPrice', type: 'number', desc: 'Maximum discounted price threshold.' },
                   { name: 'search', type: 'string', desc: 'Keyword search in title and description.' },
                 ]}
               />

               <h4 className="text-lg font-bold">Complex Query Example</h4>
               <CodeBlock 
                 code={`GET /api/deals?categoryId=food&minPrice=10&maxPrice=50&search=pizza`}
               />
            </div>
          </DocSection>
        )}

        {activeTab === 'geo' && (
          <DocSection title="Geo-spatial Search">
            <p className="text-muted-foreground mb-8">
              Enable "Deals Near Me" features by filtering based on the user's location.
            </p>
            
            <ParamTable 
              title="Location Parameters"
              params={[
                { name: 'lat', type: 'number', desc: 'Latitude of the user.' },
                { name: 'lng', type: 'number', desc: 'Longitude of the user.' },
                { name: 'radius', type: 'number', desc: 'Search radius in meters (default: 10000).' },
              ]}
            />

            <h4 className="text-lg font-bold mt-12">Geo Query Example</h4>
            <CodeBlock 
              code={`GET /api/deals?lat=40.7128&lng=-74.0060&radius=5000`}
            />
            <p className="mt-4 text-xs text-muted-foreground">This query will return all deals within a 5km radius of NYC.</p>
          </DocSection>
        )}

        {activeTab === 'commission' && (
          <DocSection title="Commissions & Attribution">
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Every deal object contains a `commissionPercentage` field. This is the estimated amount you will earn when a user claims the deal through your implementation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[32px]">
                  <h4 className="font-bold mb-4">How it's tracked</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">When you fetch deals via our API, we associate your unique Partner ID with every impression. When a customer pays, our platform attributes the revenue based on that session log.</p>
               </div>
               <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[32px]">
                  <h4 className="font-bold mb-4">Earnings Calculation</h4>
                  <pre className="text-blue-600 font-mono text-xs font-bold leading-6">
{`Commission = 
  Sale Price * 
  (percent / 100)`}
                  </pre>
               </div>
            </div>

            <div className="p-8 bg-card border border-border rounded-[40px]">
               <h4 className="text-xl font-bold mb-4">Log Conversion (Postback)</h4>
               <p className="text-sm text-muted-foreground mb-6">For partners with custom payment flows, use our tracking endpoint to manually log conversions.</p>
               <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs font-bold font-mono">POST</span>
                  <code className="text-sm font-bold font-mono">/track/conversion</code>
               </div>
               <CodeBlock 
                 language="json"
                 code={`{
  "dealId": "deal_123",
  "transactionId": "your_order_id",
  "amount": 49.99
}`}
               />
            </div>
          </DocSection>
        )}
      </main>
    </div>
  );
}

function DocNavItem({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function DocSection({ title, children }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-bold mb-8 tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

function FeatureHighlight({ title, desc, icon: Icon }: any) {
  return (
    <div className="p-6 bg-card border border-border rounded-2xl flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function CodeBlock({ code, language = 'bash' }: any) {
  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{language}</span>
        <button 
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 overflow-x-auto">
        <pre className="text-xs font-mono text-slate-300 leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  );
}

function ParamTable({ title, params }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <div className="border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground font-bold border-b border-border">
              <th className="px-6 py-4">Parameter</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {params.map((p: any) => (
              <tr key={p.name} className="group hover:bg-secondary/20 transition-all">
                <td className="px-6 py-4 font-mono font-bold text-primary">{p.name}</td>
                <td className="px-6 py-4"><span className="px-2 py-0.5 bg-secondary rounded text-[10px] font-mono">{p.type}</span></td>
                <td className="px-6 py-4 text-muted-foreground">{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
