import React from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Governance Policy | Offrion',
  description: 'Understand how Offrion governs its deals ecosystem, moderation practices, and platform integrity standards.',
};

export default function GovernancePolicyPage() {
  return (
    <article className="space-y-12">
      {/* Header */}
      <div className="space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-none shadow-amber-500/10">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Governance Policy</h1>
            <p className="text-muted-foreground text-sm mt-1">Last updated: April 12, 2026</p>
          </div>
        </div>
        <div className="h-px bg-border" />
      </div>

      {/* Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">1. Platform Governance Overview</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            The Offrion platform operates under a structured governance framework designed to maintain trust, transparency, and fairness across all stakeholders — Merchants, Partners, End-Users, and the Platform Administration. This policy outlines the rules, moderation practices, and ethical standards that govern the ecosystem.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">2. Deal Moderation</h2>
          <div className="bg-card border border-border rounded-md p-6 space-y-4">
            <h3 className="font-bold text-sm">2.1 Approval Process</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">All deals submitted by Merchants are subject to review by the Platform Administration. Deals must comply with content standards, local regulations, and ethical advertising practices before being made available to Partners.</p>
            <h3 className="font-bold text-sm">2.2 Prohibited Content</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Deals that promote illegal activities, discriminatory content, misleading claims, counterfeit goods, or any content that violates applicable laws are strictly prohibited and will be rejected.</p>
            <h3 className="font-bold text-sm">2.3 Ongoing Monitoring</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">The Admin team continuously monitors deal performance, user complaints, and conversion anomalies. Deals may be suspended or removed at any time if they are found to violate platform standards.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">3. Merchant KYC & Verification</h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />All Merchants must complete Know Your Customer (KYC) verification before publishing deals.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />KYC includes identity validation, business registration verification, and tax ID confirmation.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />Merchant status can be: Pending, Verified, Rejected, or Suspended.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />Merchants with a &quot;Rejected&quot; or &quot;Suspended&quot; status cannot publish new deals or process redemptions.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">4. Financial Governance</h2>
          <div className="bg-secondary/30 border border-border rounded-md p-6 space-y-3 text-sm">
            <p className="text-muted-foreground"><span className="font-bold text-foreground">Commission Transparency:</span> All commission rates are defined by the Merchant at deal creation and are visible to Partners. The 70/30 split (Partner/Platform) is standard and non-negotiable.</p>
            <p className="text-muted-foreground"><span className="font-bold text-foreground">Settlement Integrity:</span> Prepaid merchants have commissions settled instantly from their wallet balance. Card-on-file merchants accrue liability settled on a 15-day billing cycle.</p>
            <p className="text-muted-foreground"><span className="font-bold text-foreground">Audit Trail:</span> All financial transactions, commissions, and settlements are logged with immutable timestamps and are available for audit by authorized administrators.</p>
            <p className="text-muted-foreground"><span className="font-bold text-foreground">Dispute Resolution:</span> Financial disputes are handled through the in-platform support system. Resolution timelines are typically 5–10 business days.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">5. API Usage & Fair Use</h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />Partners must adhere to API rate limits defined in their subscription tier.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />Automated scraping, data harvesting, or reverse-engineering of the API is prohibited.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />API keys must be rotated regularly and stored securely (never in client-side code).</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />The Platform reserves the right to revoke API access for violations of the fair use policy.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">6. Enforcement & Penalties</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Violations of governance policies may result in warnings, temporary suspensions, permanent account termination, or legal action. The severity of enforcement is proportional to the violation and considers the user&apos;s history and intent.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-md p-4 text-center">
              <p className="text-2xl font-black text-amber-500">⚠️</p>
              <p className="text-xs font-bold mt-2">Warning</p>
              <p className="text-[10px] text-muted-foreground mt-1">First-time minor violations</p>
            </div>
            <div className="bg-card border border-border rounded-md p-4 text-center">
              <p className="text-2xl font-black text-orange-500">⏸️</p>
              <p className="text-xs font-bold mt-2">Suspension</p>
              <p className="text-[10px] text-muted-foreground mt-1">Repeated or moderate violations</p>
            </div>
            <div className="bg-card border border-border rounded-md p-4 text-center">
              <p className="text-2xl font-black text-red-500">🚫</p>
              <p className="text-xs font-bold mt-2">Termination</p>
              <p className="text-[10px] text-muted-foreground mt-1">Severe or fraudulent violations</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">7. Policy Updates</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            This Governance Policy may be updated periodically. Significant changes will be communicated via platform notifications and email to all registered users. Continued use of the Platform after changes constitutes acceptance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">8. Contact</h2>
          <div className="bg-secondary/30 border border-border rounded-md p-6">
            <p className="text-sm text-muted-foreground">For governance-related questions or to report violations:</p>
            <p className="text-sm font-bold mt-2">Aethyl Group — Offrion Platform</p>
            <p className="text-sm text-muted-foreground">Email: governance@offrion.com</p>
          </div>
        </section>
      </div>
    </article>
  );
}
