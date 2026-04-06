import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Zap, 
  Target, 
  MapPin, 
  BarChart3, 
  ShieldCheck, 
  Globe, 
  Code
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase mb-6">
            Feature Roadmap
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">Platform <span className="text-gradient">Capabilities</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
            "Engineered for high-frequency distribution and absolute precision."
          </p>
        </div>

        {/* Features Deep Dive */}
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {[
            {
              title: "Geo-Spatial Deal Discovery",
              description: "Query deals within milliseconds based on exact longitude and latitude. Our custom MongoDB GeoJSON indexing ensures sub-100ms response times globally.",
              icon: MapPin,
              color: "text-blue-500",
              bullets: ["Radius-based search", "Polygon boundaries", "Location-weighted ranking"]
            },
            {
              title: "AI-Powered Priority Scores",
              description: "Deals aren't just listed; they're ranked. Our internal utility calculates priority based on category relevance, business weight, and proximity.",
              icon: Zap,
              color: "text-amber-500",
              bullets: ["Real-time ranking", "Category affinity", "Merchant boosting"]
            },
            {
              title: "Partner SDK & API First",
              description: "Build on top of Offrion with ease. Our RESTful endpoints and upcoming TypeScript SDK make integration a matter of minutes, not days.",
              icon: Code,
              color: "text-indigo-500",
              bullets: ["Developer first documentation", "Scalable rate limits", "x-api-key security"]
            },
            {
              title: "Enterprise Grade Analytics",
              description: "Every impression, click, and conversion is tracked with millisecond precision. Aggregate data across categories or drill down into specific deals.",
              icon: BarChart3,
              color: "text-primary",
              bullets: ["Live tracking", "Historical aggregation", "Conversion funnel mapping"]
            }
          ].map((feature, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}>
              <div className="flex-1">
                <div className={`w-16 h-16 rounded-[24px] bg-secondary flex items-center justify-center mb-8 ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold mb-6">{feature.title}</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-4">
                  {feature.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-premium-gradient" />
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full aspect-video rounded-[40px] relative overflow-hidden flex items-center justify-center">
                <img 
                  src={i === 0 ? "/images/qr-scan.png" :
                       i === 1 ? "/images/dashboard.png" :
                       i === 2 ? "/images/api-network.png" :
                       "/images/merchant-owner.png"} 
                  alt={feature.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
