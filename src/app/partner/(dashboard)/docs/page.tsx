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
  FlaskConical,
  Code2
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
            <DocNavItem 
              active={activeTab === 'webhooks'} 
              onClick={() => setActiveTab('webhooks')}
              icon={Globe}
              label="Webhooks" 
            />
            <DocNavItem 
              active={activeTab === 'sdk-widget'} 
              onClick={() => setActiveTab('sdk-widget')}
              icon={Code2}
              label="SDK Widget" 
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
                  <div className="w-6 h-6 rounded-full bg-premium-gradient text-white text-xs flex items-center justify-center shrink-0">1</div>
                  <div>
                    <p className="font-bold">Generate API Key</p>
                    <p className="text-sm text-muted-foreground">Go to the Keys section and create your first integration key.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-premium-gradient text-white text-xs flex items-center justify-center shrink-0">2</div>
                  <div>
                    <p className="font-bold">Fetch Deals</p>
                    <p className="text-sm text-muted-foreground">List all active deals with categories and locations.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-premium-gradient text-white text-xs flex items-center justify-center shrink-0">3</div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Query Parameters</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li><code className="text-primary">minDiscount</code> (number) - Filter by discount %</li>
                      <li><code className="text-primary">activeNow</code> (boolean) - Currently valid deals</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Response (200 OK)</h5>
                    <CodeBlock 
                      language="json"
                      code={`{
  "page": 1,
  "total": 120,
  "deals": [{ "_id": "...", "title": "Buy 1 Get 1", "discountPercentage": 50 }]
}`}
                    />
                  </div>
                </div>
                <CodeBlock 
                  code={`curl -H "x-api-key: YOUR_KEY" "https://api.offrion.com/api/deals"`}
                />
              </div>

              <div>
                <EndpointLabel method="GET" path="/deals/[id]" />
                <p className="text-sm text-muted-foreground mb-4">Retrieve details of a single deal by its ID.</p>
                <div className="mb-4">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Response (200 OK)</h5>
                  <CodeBlock 
                    language="json"
                    code={`{
  "deal": {
    "_id": "654a123f8b...",
    "title": "Summer Flash Sale",
    "description": "50% off all beverages",
    "discountPercentage": 50,
    "originalPrice": 20,
    "discountedPrice": 10
  }
}`}
                  />
                </div>
                <CodeBlock 
                  code={`curl -H "x-api-key: YOUR_KEY" "https://api.offrion.com/api/deals/654a123f8b..."`}
                />
              </div>

              <div>
                <EndpointLabel method="GET" path="/deals/[id]/similar" />
                <p className="text-sm text-muted-foreground mb-4">Get up to 10 deals from the same category as the reference deal.</p>
                <div className="mb-4">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Response (200 OK)</h5>
                  <CodeBlock 
                    language="json"
                    code={`{
  "deals": [ { "_id": "...", "title": "Similar Deal 1" } ]
}`}
                  />
                </div>
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
            <div className="mb-8">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Response (200 OK)</h5>
              <CodeBlock 
                language="json"
                code={`{
  "count": 12,
  "categories": [
    { "_id": "...", "name": "Food & Drink", "slug": "food-drink" }
  ]
}`}
              />
            </div>
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
                <p className="text-sm text-muted-foreground mb-4">Track a user clicking on a deal. Returns a redemption code for the user.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Payload (JSON)</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li><code className="text-primary">dealId</code> (string, required) - The deal being clicked</li>
                      <li><code className="text-primary">metadata</code> (object, optional) - Custom data to track</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Response (200 OK)</h5>
                    <CodeBlock 
                      language="json"
                      code={`{
  "message": "Click tracked successfully",
  "redeemCode": "AXTRE9",
  "transactionId": "654b..."
}`}
                    />
                  </div>
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Payload (JSON)</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li><code className="text-primary">dealId</code> (string, required)</li>
                      <li><code className="text-primary">amount</code> (number, required) - Purchase value</li>
                      <li><code className="text-primary">currency</code> (string) - Default: USD</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Response (200 OK)</h5>
                    <CodeBlock 
                      language="json"
                      code={`{
  "message": "Conversion tracked",
  "transactionId": "654b...",
  "status": "pending"
}`}
                    />
                  </div>
                </div>
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
               <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-bold font-mono">GET</span>
               <code className="text-sm font-bold font-mono">/partner/analytics</code>
            </div>
            <ParamTable 
              title="Query Parameters"
              params={[
                { name: 'period', type: 'string', desc: '7d, 30d (default), or 90d.' },
                { name: 'environment', type: 'string', desc: 'production (default) or sandbox.' },
              ]}
            />
            <div className="mt-8">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Response (200 OK)</h5>
              <CodeBlock 
                language="json"
                code={`{
  "summary": {
    "impressions": 1402,
    "clicks": 84,
    "conversions": 12,
    "ctr": "5.99%",
    "totalEarned": 240.50
  }
}`}
              />
            </div>
          </DocSection>
        )}

        {activeTab === 'ledger' && (
          <DocSection title="Earnings Ledger">
            <p className="text-muted-foreground mb-8">Access detailed logs of your transactions and earned commissions.</p>
            
            <div className="space-y-8">
              <div>
                <EndpointLabel method="GET" path="/partner/transactions" />
                <p className="text-sm text-muted-foreground mb-4">Partner transaction history. Support ?environment=sandbox</p>
                <div className="mb-4">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Response (200 OK)</h5>
                  <CodeBlock 
                    language="json"
                    code={`{
  "total": 45,
  "transactions": [
    { "_id": "...", "status": "completed", "amount": 25.0, "createdAt": "2024-03-21T..." }
  ]
}`}
                  />
                </div>
              </div>
              <div>
                <EndpointLabel method="GET" path="/partner/commissions" />
                <p className="text-sm text-muted-foreground mb-4">Individual commission records (pending/paid). Support ?environment=sandbox</p>
                <div className="mb-4">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Response (200 OK)</h5>
                  <CodeBlock 
                    language="json"
                    code={`{
  "summary": { "pending": 45.0, "paid": 120.0 },
  "commissions": [
    { "_id": "...", "partnerShare": 7.5, "status": "pending" }
  ]
}`}
                  />
                </div>
              </div>
            </div>
          </DocSection>
        )}

        {activeTab === 'webhooks' && (
          <DocSection title="Webhooks">
            <p className="text-muted-foreground mb-8">Receive real-time notifications for automated deal redemption and commission updates.</p>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-bold mb-4">1. Request Payload (Sent by Offrion)</h3>
                <p className="text-sm text-muted-foreground mb-4">All webhooks are sent as POST requests with a JSON body to your configured URL.</p>
                <CodeBlock 
                  language="json"
                  code={`{
  "event": "deal.redeemed",
  "timestamp": "2026-04-11T08:11:42.027Z",
  "environment": "sandbox",
  "data": {
    "transactionId": "69da02275802637608455a50",
    "dealId": "69da01fead9d9b4f5c0222e8",
    "dealTitle": "Burj View Coffee & Pastry",
    "amount": 30,
    "partnerShare": 2.1,
    "redeemedAt": "2026-04-11T08:11:41.515Z"
  }
}`}
                />
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">2. Your Response (Expected)</h3>
                <p className="text-sm text-muted-foreground mb-4">Your server must respond with a 200 OK status to acknowledge receipt.</p>
                <CodeBlock 
                  language="http"
                  code={`HTTP/1.1 200 OK
Content-Type: application/json

{ "received": true }`}
                />
              </div>

              <div className="p-6 bg-secondary/50 rounded-2xl border border-border">
                <h3 className="text-lg font-bold mb-2">Security & Verification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Each request includes an <code>X-Offrion-Signature</code> header. This is an HMAC-SHA256 hash of the raw request body using your Webhook Secret.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <Shield className="w-4 h-4" />
                  Verification is mandatory for production environments.
                </div>
              </div>
            </div>
          </DocSection>
        )}
        {activeTab === 'sdk-widget' && (
          <DocSection title="JavaScript SDK Widget">
            <p className="text-muted-foreground mb-8">
              The fastest way to integrate Offrion. Add a premium "Deals Near Me" experience to your site with a single line of code.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <FeatureHighlight 
                title="Zero Code Integration"
                desc="No API knowledge required. Just paste the script and target div."
                icon={Zap}
              />
              <FeatureHighlight 
                title="Responsive & Themed"
                desc="Beautifully adapts to mobile and desktop with Offrion's premium glassmorphism."
                icon={Globe}
              />
            </div>

            <h3 className="text-xl font-bold mb-4">1. Add the Script</h3>
            <p className="text-sm text-muted-foreground mb-4">Place this in your <code>&lt;head&gt;</code> or at the end of your <code>&lt;body&gt;</code>.</p>
            <CodeBlock 
              language="html"
              code={`<script src="https://api.offrion.com/sdk/widget.js" defer></script>`}
            />

            <h3 className="text-xl font-bold mt-12 mb-4">2. Place the Container</h3>
            <p className="text-sm text-muted-foreground mb-4">Insert this div wherever you want the deals to appear. Our SDK will automatically find it and inject the latest rewards.</p>
            <CodeBlock 
              language="html"
              code={`<div 
  id="offrion-deals-widget" 
  data-api-key="YOUR_API_KEY"
  data-lat="25.1972"
  data-lng="55.2744"
  data-limit="3"
></div>`}
            />

            <h3 className="text-xl font-bold mt-12 mb-6">Live Widget Preview</h3>
            <div className="p-8 bg-secondary/30 border border-border rounded-[40px] relative overflow-hidden">
               <div className="absolute top-4 right-8 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                  Live SDK Instance
               </div>
               
               {/* Internal Simulator of the SDK UI */}
               <div className="space-y-4 max-w-lg mx-auto">
                  <div className="p-5 bg-white/80 backdrop-blur-md border border-black/5 rounded-[24px] flex items-center gap-5 shadow-sm">
                    <div className="w-16 h-16 bg-secondary rounded-2xl shrink-0" />
                    <div className="flex-1">
                      <div className="w-20 h-2 bg-primary/20 rounded mb-2" />
                      <div className="w-32 h-4 bg-secondary rounded" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="p-5 bg-white/80 backdrop-blur-md border border-black/5 rounded-[24px] flex items-center gap-5 shadow-sm opacity-60">
                    <div className="w-16 h-16 bg-secondary rounded-2xl shrink-0" />
                    <div className="flex-1">
                      <div className="w-20 h-2 bg-primary/20 rounded mb-2" />
                      <div className="w-32 h-4 bg-secondary rounded" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
               </div>

               <div className="mt-8 text-center">
                  <p className="text-xs text-muted-foreground italic">Note: Live preview uses mock data. Actual widget matches your account environment.</p>
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
        isPost ? "bg-blue-500/20 text-blue-500" : "bg-primary/20 text-primary"
      )}>
        {method}
      </span>
      <code className="text-sm font-bold font-mono text-foreground">{path}</code>
    </div>
  );
}

function DocNavItem({ active, onClick, icon: Icon, label }: any) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
        active 
          ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {mounted ? <Icon className="w-4 h-4" /> : <div className="w-4 h-4" />}
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
