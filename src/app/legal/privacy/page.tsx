import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Offrion',
  description: 'Learn how Offrion collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-12">
      {/* Header */}
      <div className="space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-md bg-secondary text-foreground flex items-center justify-center shadow-none shadow-primary/10">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm mt-1">Last updated: April 12, 2026</p>
          </div>
        </div>
        <div className="h-px bg-border" />
      </div>

      {/* Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Offrion (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), operated by Aethyl Group, is committed to protecting the privacy and security of your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access our platform, APIs, merchant dashboard, partner portal, or any related services (collectively, the &quot;Platform&quot;).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">2. Information We Collect</h2>
          <div className="bg-card border border-border rounded-md p-6 space-y-4">
            <h3 className="font-bold text-sm">2.1 Account Information</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">When you register as a Merchant or Partner, we collect: full name, email address, business name, contact phone number, physical address, and KYC documents (tax ID, registration number).</p>
            <h3 className="font-bold text-sm">2.2 Transaction Data</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">We collect data related to deal claims, redemptions, QR code scans, commission calculations, wallet balances, and payment method details processed through Stripe.</p>
            <h3 className="font-bold text-sm">2.3 Usage & Analytics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">We automatically collect device information, IP addresses, browser type, page views, API call logs, and geolocation data used for geo-spatial deal discovery.</p>
            <h3 className="font-bold text-sm">2.4 Cookies & Tracking</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">We use essential session cookies (JWT tokens) for authentication and analytics cookies to improve platform performance. You can manage cookie preferences through your browser settings.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">3. How We Use Your Information</h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />To operate, maintain, and improve the Platform and its services.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />To process transactions, commissions, and financial settlements.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />To verify merchant identities through KYC procedures.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />To send billing cycle notifications and platform alerts.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />To prevent fraud, enforce terms, and protect platform integrity.</li>
            <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />To provide analytics dashboards and performance insights.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">4. Data Sharing & Disclosure</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-3"><span className="font-bold text-foreground w-24 shrink-0">Partners</span>Limited deal performance data and anonymized conversion metrics.</li>
            <li className="flex items-start gap-3"><span className="font-bold text-foreground w-24 shrink-0">Stripe</span>Payment processing data as required for financial transactions.</li>
            <li className="flex items-start gap-3"><span className="font-bold text-foreground w-24 shrink-0">Legal</span>When required by law, court order, or to protect our rights.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We implement industry-standard security measures including: TLS/SSL encryption for all data in transit, bcrypt password hashing, JWT-based session management, role-based access controls, and regular security audits. While no system is 100% secure, we continuously work to protect your data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">6. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            We retain your personal data for as long as your account is active or as needed to provide services. Transaction records and commission data are retained for a minimum of 7 years for regulatory compliance. You may request deletion of your account and associated data by contacting our support team.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">7. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Depending on your jurisdiction, you may have the right to: access your personal data, request corrections, request deletion, object to processing, data portability, and withdraw consent. To exercise these rights, contact us at <span className="font-bold text-foreground">privacy@offrion.com</span>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">8. Contact Us</h2>
          <div className="bg-secondary/30 border border-border rounded-md p-6">
            <p className="text-sm text-muted-foreground">
              For privacy-related inquiries, contact our Data Protection team:
            </p>
            <p className="text-sm font-bold mt-2">Aethyl Group — Offrion Platform</p>
            <p className="text-sm text-muted-foreground">Email: privacy@offrion.com</p>
          </div>
        </section>
      </div>
    </article>
  );
}
