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
  DollarSign,
  Activity,
  Search,
  List,
  Target,
  FlaskConical
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
              active={activeTab === 'deals'} 
              onClick={() => setActiveTab('deals')}
              icon={Layers}
              label="Deals API" 
            />
            <DocNavItem 
              active={activeTab === 'filtering'} 
              onClick={() => setActiveTab('filtering')}
              icon={Search}
              label="Advanced Filtering" 
            />
            <DocNavItem 
              active={activeTab === 'categories'} 
              onClick={() => setActiveTab('categories')}
              icon={List}
              label="Categories" 
            />
            <DocNavItem 
              active={activeTab === 'tracking'} 
              onClick={() => setActiveTab('tracking')}
              icon={Activity}
              label="Tracking" 
            />
          </nav>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 ml-3">Account & Stats</h4>
          <nav className="space-y-1">
            <DocNavItem 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')}
              icon={Target}
              label="Partner Analytics" 
            />
            <DocNavItem 
              active={activeTab === 'ledger'} 
              onClick={() => setActiveTab('ledger')}
              icon={DollarSign}
              label="Earnings Ledger" 
            />
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 max-w-4xl">
        {activeTab === 'getting-started' && (
          <DocSection title="Quick Start & Installation">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Offrion's Deals-as-a-Service API enables you to programmatically access thousands of merchant deals. The API is designed to be RESTful and easy to integrate into any stack.
            </p>
            
            <h3 className="text-2xl font-bold mb-4">Base URL</h3>
            <div className="p-4 bg-secondary font-mono rounded-xl border border-border flex items-center justify-between mb-8">
              <span>https://api.offrion.com/api</span>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">Dev: localhost:3000/api</span>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Integration Checklist</h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0">1</div>
                  <div>
                    <p className="font-bold">Generate API Key</p>
                    <p className="text-sm text-muted-foreground">Go to the Keys section and create your first integration key.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0">2</div>
                  <div>
                    <p className="font-bold">Fetch Deals</p>
                    <p className="text-sm text-muted-foreground">List all active deals with categories and locations.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0">3</div>
                  <div>
                    <p className="font-bold">Track Conversions</p>
                    <p className="text-sm text-muted-foreground">Log clicks and successful conversions for attribution.</p>
                  </div>
                </li>
              </ol>
            </div>
          </DocSection>
        )}

        {activeTab === 'auth' && (
          <DocSection title="Authentication">
            <p className="text-muted-foreground mb-8">
              All public API requests must include the <code>x-api-key</code> header. 
            </p>
            <CodeBlock 
              language="http"
              code={`GET /api/deals HTTP/1.1
Host: api.offrion.com
x-api-key: YOUR_API_KEY`}
            />
            <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-4">
               <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
               <p className="text-sm text-muted-foreground leading-relaxed">
                 For partner dashboard requests (internal), authentication uses <strong>JWT HTTP-only cookies</strong>. When calling internal APIs, ensure your cross-origin settings (CORS) allow credentials.
               </p>
            </div>
          </DocSection>
        )}

        {activeTab === 'deals' && (
          <DocSection title="Deals API">
            <p className="text-muted-foreground mb-12">The primary endpoint to discover and retrieve deals.</p>
            
            <div className="space-y-12">
              <div>
                <EndpointLabel method="GET" path="/deals" />
                <p className="text-sm text-muted-foreground mb-4">List all active deals. Support multiple filters (see Advanced Filtering).</p>
                <CodeBlock 
                  code={`curl -H "x-api-key: YOUR_KEY" "https://api.offrion.com/api/deals"`}
                />
              </div>

              <div>
                <EndpointLabel method="GET" path="/deals/[id]" />
                <p className="text-sm text-muted-foreground mb-4">Retrieve details of a single deal by its ID.</p>
                <CodeBlock 
                  code={`curl -H "x-api-key: YOUR_KEY" "https://api.offrion.com/api/deals/654a123f8b..."`}
                />
              </div>

              <div>
                <EndpointLabel method="GET" path="/deals/[id]/similar" />
                <p className="text-sm text-muted-foreground mb-4">Get up to 10 deals from the same category as the reference deal.</p>
                <CodeBlock 
                  code={`curl -H "x-api-key: YOUR_KEY" "https://api.offrion.com/api/deals/654a123f8b/similar"`}
                />
              </div>
            </div>
          </DocSection>
        )}

        {activeTab === 'filtering' && (
          <DocSection title="Advanced Filtering">
            <p className="text-muted-foreground mb-8 italic">Fine-tune your deal delivery with 14 powerful query parameters.</p>
            
            <ParamTable 
              title="Query Parameters"
              params={[
                { name: 'categoryId', type: 'string', desc: 'Category ID(s), comma-separated.' },
                { name: 'eventType', type: 'string', desc: 'Event: holiday, flash, seasonal, clearance.' },
                { name: 'dealType', type: 'string', desc: 'Type: percentage, flat, bogo, free-item.' },
                { name: 'tags', type: 'string', desc: 'Comma-separated tags to match.' },
                { name: 'audience', type: 'string', desc: 'student, senior, member, all.' },
                { name: 'minDiscount', type: 'number', desc: 'Minimum discount percentage.' },
                { name: 'activeNow', type: 'boolean', desc: 'Only deals currently valid by time.' },
                { name: 'lat / lng', type: 'number', desc: 'Co-ordinates for distance search.' },
                { name: 'radius', type: 'number', desc: 'Search radius in meters.' },
                { name: 'page / limit', type: 'number', desc: 'Pagination controls.' },
              ]}
            />
            
            <h4 className="text-lg font-bold mt-12 mb-4">Advanced Example</h4>
            <CodeBlock 
              code={`https://api.offrion.com/api/deals?activeNow=true&minDiscount=30&eventType=flash&audience=student`}
            />
          </DocSection>
        )}

        {activeTab === 'categories' && (
          <DocSection title="Categories">
            <p className="text-muted-foreground mb-8">Fetch all available deal categories to build your navigation or filters.</p>
            <EndpointLabel method="GET" path="/categories" />
            <CodeBlock 
              code={`curl -H "x-api-key: YOUR_KEY" "https://api.offrion.com/api/categories"`}
            />
          </DocSection>
        )}

        {activeTab === 'tracking' && (
          <DocSection title="Tracking & Attribution">
            <p className="text-muted-foreground mb-12">Log engagement to ensure proper commission attribution.</p>
            
            <div className="space-y-12">
              <div>
                <EndpointLabel method="POST" path="/partners/track-click" />
                <p className="text-sm text-muted-foreground mb-4">Track a user clicking on a deal.</p>
                <CodeBlock 
                  language="json"
                  code={`{
  "dealId": "654a123f8b",
  "metadata": { "source": "mobile_app" }
}`}
                />
              </div>

              <div>
                <EndpointLabel method="POST" path="/partners/track-conversion" />
                <p className="text-sm text-muted-foreground mb-4">Record a successful purchase or conversion.</p>
                <CodeBlock 
                  language="json"
                  code={`{
  "dealId": "654a123f8b",
  "amount": 49.99,
  "currency": "USD"
}`}
                />
              </div>
            </div>
          </DocSection>
        )}

        {activeTab === 'analytics' && (
          <DocSection title="Partner Analytics">
            <p className="text-muted-foreground mb-8">Fetch performance data for your partner account.</p>
            <div className="flex items-center gap-2 mb-6">
               <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded text-xs font-bold font-mono">GET</span>
               <code className="text-sm font-bold font-mono">/partner/analytics</code>
            </div>
            <ParamTable 
              title="Query Parameters"
              params={[
                { name: 'period', type: 'string', desc: '7d, 30d (default), or 90d.' },
                { name: 'environment', type: 'string', desc: 'production (default) or sandbox.' },
              ]}
            />
          </DocSection>
        )}

        {activeTab === 'ledger' && (
          <DocSection title="Earnings Ledger">
            <p className="text-muted-foreground mb-8">Access detailed logs of your transactions and earned commissions.</p>
            
            <div className="space-y-8">
              <div>
                <EndpointLabel method="GET" path="/partner/transactions" />
                <p className="text-sm text-muted-foreground mb-2">Partner transaction history. Support ?environment=sandbox</p>
              </div>
              <div>
                <EndpointLabel method="GET" path="/partner/commissions" />
                <p className="text-sm text-muted-foreground mb-2">Individual commission records (pending/paid). Support ?environment=sandbox</p>
              </div>
            </div>
          </DocSection>
        )}
      </main>
    </div>
  );
}

function EndpointLabel({ method, path }: { method: string, path: string }) {
  const isPost = method === 'POST';
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className={cn(
        "px-2 py-1 rounded text-xs font-bold font-mono",
        isPost ? "bg-blue-500/20 text-blue-500" : "bg-emerald-500/20 text-emerald-500"
      )}>
        {method}
      </span>
      <code className="text-sm font-bold font-mono text-foreground">{path}</code>
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
        <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre">
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
