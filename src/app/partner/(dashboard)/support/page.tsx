'use client';

import React, { useState } from 'react';
import { 
  LifeBuoy, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Globe, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Search,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PartnerSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: "How do I rotate my API keys?",
      a: "Navigate to the API Keys section, generate a new key, update your integration, and then revoke the old key to ensure zero downtime."
    },
    {
      q: "What are the rate limits for the Deals API?",
      a: "The standard partner tier allows for 1,000 requests per hour per active API key. Contact support for higher limits."
    },
    {
      q: "Can I filter deals by longitude and latitude?",
      a: "Yes! Our API supports George-spatial queries. Use the `lat` and `lng` parameters in your GET requests."
    },
    {
      q: "How are commissions calculated?",
      a: "Commissions are calculated based on the percentage set by the merchant at the time of the deal's publication."
    }
  ];

  return (
    <div className="space-y-12 pb-20 max-w-6xl">
      {/* Header & Search */}
      <div className="relative p-12 bg-primary rounded-[48px] overflow-hidden shadow-2xl shadow-primary/20">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
         <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl font-black mb-4">How can we help?</h1>
            <p className="text-primary-foreground/80 mb-10 max-w-lg mx-auto">Access documentation, browse FAQs, or reach out to our dedicated partner success team.</p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search for answers..."
                className="w-full bg-white text-foreground rounded-2xl py-5 pl-14 pr-6 focus:outline-none shadow-xl transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Support Channels */}
        <SupportCard 
          icon={BookOpen} 
          title="Documentation" 
          description="Read our comprehensive API guides and integration tutorials." 
          link="/partner/docs"
          linkText="View Docs"
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <SupportCard 
          icon={MessageCircle} 
          title="Community" 
          description="Join the Offrion developer Slack to chat with other partners." 
          link="#"
          linkText="Join Slack"
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
        <SupportCard 
          icon={CheckCircle2} 
          title="System Status" 
          description="Check real-time status of our APIs and core infrastructure." 
          link="#"
          linkText="Status Page"
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* FAQ Section */}
        <div className="lg:col-span-3 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-primary" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 bg-card border border-border rounded-3xl hover:border-primary/30 transition-all group">
                <h4 className="font-bold flex justify-between items-center cursor-pointer">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </h4>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="p-8 bg-card border border-border rounded-[40px] shadow-sm sticky top-8">
            <h3 className="text-xl font-bold mb-2">Dedicated Support</h3>
            <p className="text-sm text-muted-foreground mb-8">Can't find what you're looking for? Send us a message.</p>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Subject</label>
                <select className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                  <option>API Integration Issue</option>
                  <option>Account & Billing</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us more about your issue..."
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button 
                type="button"
                className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Send Ticket
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-border flex flex-col gap-4">
               <div className="flex items-center gap-3 text-sm font-medium">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <span>support@offrion.com</span>
               </div>
               <div className="flex items-center gap-3 text-sm font-medium">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                  <span>Premium 24/7 Response</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportCard({ icon: Icon, title, description, link, linkText, color, bg }: any) {
  return (
    <div className="p-8 bg-card border border-border rounded-[40px] flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg)}>
        <Icon className={cn("w-7 h-7", color)} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{description}</p>
      <div className="mt-auto">
        <a 
          href={link} 
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline group-hover:gap-3 transition-all"
        >
          {linkText} <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
