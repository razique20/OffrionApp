'use client';

import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  { q: "Is the Geo-Search API globally redundant?", a: "Yes, our MongoDB cluster uses GeoJSON indexing across multiple regions to ensure <100ms latency worldwide." },
  { q: "How are commissions distributed?", a: "The partner who referred the customer gets 70% of the commission, and the platform retains 30%. This is calculated instantly." },
  { q: "Can we use custom domain for deals?", a: "Merchant Pro and Enterprise tiers support white-label portals with custom CNAME mapping." },
  { q: "How do I upgrade my plan?", a: "Go to Settings > Billing and select your preferred plan. Upgrades are instantaneous." },
  { q: "What happens if a deal is expired?", a: "Expired deals are automatically removed from partner search results but remain visible in your merchant archives." },
];

export function FAQSupport() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-foreground" />
        <h3 className="font-bold text-lg">Frequently Asked Questions</h3>
      </div>
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <details key={i} className="group p-4 bg-secondary/20 border border-border rounded-md cursor-pointer hover:bg-secondary/40 transition-all">
            <summary className="flex items-center justify-between font-bold text-sm list-none outline-none">
              <span className="flex-1 pr-4">{faq.q}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
            </summary>
            <div className="text-xs text-muted-foreground mt-3 leading-relaxed border-t border-border/50 pt-3 opacity-0 group-open:opacity-100 transition-opacity">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default FAQSupport;
