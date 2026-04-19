import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Offrion',
  description: 'Read the terms and conditions governing the use of the Offrion platform.',
};

export default function TermsPage() {
  return (
    <article className="space-y-12">
      {/* Header */}
      <div className="space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-none shadow-blue-500/10">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Terms & Conditions</h1>
            <p className="text-muted-foreground text-sm mt-1">Last updated: April 12, 2026</p>
          </div>
        </div>
        <div className="h-px bg-border" />
      </div>

      {/* Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            By accessing or using the Offrion platform (&quot;Platform&quot;), including all associated APIs, dashboards, mobile interfaces, and services operated by Aethyl Group (&quot;Company&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree, you must not use the Platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">2. Definitions</h2>
          <div className="bg-card border border-border rounded-md p-6 space-y-3">
            <div className="flex items-start gap-3 text-sm"><span className="font-bold text-foreground w-28 shrink-0">Merchant</span><span className="text-muted-foreground">A business entity that creates and publishes deals on the Platform.</span></div>
            <div className="flex items-start gap-3 text-sm"><span className="font-bold text-foreground w-28 shrink-0">Partner</span><span className="text-muted-foreground">A developer or platform operator that integrates with the Offrion API to display and distribute deals to end-users.</span></div>
            <div className="flex items-start gap-3 text-sm"><span className="font-bold text-foreground w-28 shrink-0">End-User</span><span className="text-muted-foreground">A consumer who discovers, claims, and redeems deals through a Partner&apos;s integrated platform.</span></div>
            <div className="flex items-start gap-3 text-sm"><span className="font-bold text-foreground w-28 shrink-0">Commission</span><span className="text-muted-foreground">The percentage fee charged on each successful deal redemption, split between the Partner (70%) and the Platform (30%).</span></div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">3. Account Registration</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your credentials. Merchants are required to complete KYC verification before publishing deals. The Company reserves the right to suspend or terminate accounts that provide false information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">4. Merchant Obligations</h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />Merchants must ensure all published deals are accurate, lawful, and honor the advertised terms.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />Merchants must maintain sufficient wallet balance (Prepaid) or a valid payment method (Card on File) to cover commissions.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />Merchants are solely responsible for fulfilling redeemed deals and providing the promised goods or services.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />Merchants on the 15-day billing cycle must settle outstanding commissions by the scheduled date.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">5. Partner Obligations</h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />Partners must use the API in accordance with the documentation and rate limits.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />Partners must not modify, misrepresent, or alter deal content provided through the API.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />Partners must adequately protect API keys and not expose them in client-side code.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />Partners must comply with applicable data protection laws when handling end-user data.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">6. Financial Terms</h2>
          <div className="bg-secondary/30 border border-border rounded-md p-6 space-y-3 text-sm">
            <p className="text-muted-foreground"><span className="font-bold text-foreground">Commission Rate:</span> Defined per deal by the Merchant. The commission is split 70% to the referring Partner and 30% to the Platform.</p>
            <p className="text-muted-foreground"><span className="font-bold text-foreground">Billing Cycles:</span> Merchants using &quot;Card on File&quot; are subject to a 15-day billing cycle (settlement on the 15th and 30th/31st of each month).</p>
            <p className="text-muted-foreground"><span className="font-bold text-foreground">Refunds:</span> Refunds for redeemed deals are handled exclusively by the Merchant. The Platform commission is non-refundable once a deal is redeemed.</p>
            <p className="text-muted-foreground"><span className="font-bold text-foreground">Disputes:</span> Financial disputes must be raised within 30 days of the transaction date through the support portal.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">7. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            All Platform content, design, code, trademarks, and branding (&quot;Offrion,&quot; &quot;Aethyl&quot;) are the intellectual property of Aethyl Group. Merchants retain ownership of their deal content but grant the Platform a non-exclusive, royalty-free license to display and distribute it through Partners.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Platform. The Company&apos;s total liability shall not exceed the fees paid by you in the preceding 12 months.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">9. Termination</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Either party may terminate the agreement at any time. The Company may suspend or terminate accounts for violations of these Terms, non-payment, or fraudulent activity. Upon termination, outstanding commissions remain payable, and data retention policies apply per the Privacy Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">10. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            These Terms are governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration, unless otherwise required by local consumer protection laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">11. Contact</h2>
          <div className="bg-secondary/30 border border-border rounded-md p-6">
            <p className="text-sm text-muted-foreground">For questions about these Terms:</p>
            <p className="text-sm font-bold mt-2">Aethyl Group — Offrion Platform</p>
            <p className="text-sm text-muted-foreground">Email: legal@offrion.com</p>
          </div>
        </section>
      </div>
    </article>
  );
}
