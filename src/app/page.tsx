import Link from 'next/link';
import {
  Zap,
  Shield,
  ArrowRight,
  ShoppingBag,
  Heart,
  Code2,
  Wallet,
  QrCode,
  CheckCircle2,
  Clock,
  MapPin,
  Smile,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-purple-500/20">
      <main>

        {/* ── Hero ── */}
        <section className="relative min-h-[88svh] lg:min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
          {/* Brand gradient blobs */}
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#A855F7] opacity-[0.07] blur-[120px] -z-10" />
          <div className="absolute top-10 left-1/3 w-[400px] h-[400px] rounded-full bg-[#F97316] opacity-[0.06] blur-[100px] -z-10" />
          <div className="absolute bottom-10 left-20 w-[300px] h-[300px] rounded-full bg-[#22C55E] opacity-[0.05] blur-[80px] -z-10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent -z-10" />

          <div className="w-full px-6 md:px-16 lg:px-24 grid grid-cols-1 gap-12 items-start z-10">
            <div className="flex flex-col items-start text-left max-w-4xl">
              {/* Brand dots pill */}
              <div className="inline-flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                <span className="text-xs font-medium text-muted-foreground ml-1">Deals-as-a-Service API</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Great local deals,
                <br />
                <span className="text-foreground/70">connected to the apps</span>
                <br />
                <span className="bg-gradient-to-r from-[#A855F7] via-[#F97316] to-[#EF4444] bg-clip-text text-transparent">
                  people already use.
                </span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000">
                Offrion helps merchants bring in real customers and helps apps reward their users &mdash; without the
                guesswork. List a deal, plug in the API, and everyone gets paid when someone walks through the door.
              </p>
            </div>

            <div className="flex items-center gap-8 border-t border-border/50 pt-8 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-7 duration-1000">
              <div>
                <p className="text-xl font-bold">200+</p>
                <p className="text-[11px] text-muted-foreground font-medium">Businesses & partners</p>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div>
                <p className="text-xl font-bold">AED 2.4M</p>
                <p className="text-[11px] text-muted-foreground font-medium">Paid out to partners</p>
              </div>
              <div className="w-px h-8 bg-border/50 hidden sm:block" />
              <div className="hidden sm:block">
                <p className="text-xl font-bold">Pay-per-visit</p>
                <p className="text-[11px] text-muted-foreground font-medium">No upfront ad spend</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Dual-path fork ── */}
        <section className="px-6 -mt-8 mb-4 relative z-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-sm font-medium text-muted-foreground mb-6">
              Pick the path that sounds like you &darr;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  href: '/auth/register?role=merchant',
                  icon: ShoppingBag,
                  tag: 'I run a business',
                  title: 'Bring in more customers',
                  desc: 'List a deal and reach people through dozens of apps. Only pay when someone actually shows up.',
                  cta: 'Start as a merchant',
                  accent: 'from-[#F97316] to-[#EF4444]',
                  dot: 'bg-[#F97316]',
                },
                {
                  href: '/auth/register?role=partner',
                  icon: Code2,
                  tag: 'I build an app',
                  title: 'Reward your users & earn',
                  desc: 'Drop in one API and offer your users real local deals. Earn 70% on every redemption, settled automatically.',
                  cta: 'Start as a partner',
                  accent: 'from-[#A855F7] to-[#F97316]',
                  dot: 'bg-[#A855F7]',
                },
              ].map((p) => (
                <Link
                  key={p.tag}
                  href={p.href}
                  className="group relative p-7 rounded-3xl border border-border bg-card hover:border-transparent transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden"
                >
                  {/* Hover gradient border */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-10 transition-opacity -z-10`} />
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${p.accent} flex items-center justify-center`}>
                      <p.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{p.tag}</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.desc}</p>
                  <span className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${p.accent} bg-clip-text text-transparent`}>
                    {p.cta}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="py-24 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#F97316]" />
                <span className="text-xs font-medium text-foreground">How it works</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 max-w-2xl leading-[1.1]">
                Three simple steps, no middlemen
              </h2>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                From listing a deal to getting paid &mdash; here&apos;s the whole journey in plain English.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-[#A855F7]/30 via-[#F97316]/30 to-[#EF4444]/30" />

              {[
                { step: '1', icon: ShoppingBag, title: 'A business lists a deal', desc: 'Set your offer, where it works, and how many people can claim it. Live in minutes.', color: '#A855F7' },
                { step: '2', icon: Smile, title: 'Someone discovers it', desc: 'Partner apps show the deal to nearby users. No ad budget, no cold outreach.', color: '#F97316' },
                { step: '3', icon: QrCode, title: 'They visit & everyone wins', desc: 'A quick scan at the counter confirms the visit, and the payout is split automatically.', color: '#EF4444' },
              ].map((item) => (
                <div key={item.step} className="relative text-center md:text-left group">
                  <div className="flex md:block items-center gap-4 mb-5 justify-center">
                    <div className="w-16 h-16 rounded-3xl bg-card border border-border flex items-center justify-center group-hover:-translate-y-1 transition-all relative"
                      style={{ boxShadow: `0 0 0 0 ${item.color}00` }}
                    >
                      <item.icon className="w-7 h-7" style={{ color: item.color }} />
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                        style={{ background: item.color }}>
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Merchant section ── */}
        <section className="py-24 md:py-32 px-6 bg-card/30 border-y border-border overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#F97316] opacity-[0.04] blur-[100px] -z-10" />
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-6">
                <ShoppingBag className="w-3.5 h-3.5" style={{ color: '#F97316' }} />
                <span className="text-xs font-medium text-foreground">For businesses</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
                Fill quiet hours,
                <br />
                <span className="bg-gradient-to-r from-[#F97316] to-[#EF4444] bg-clip-text text-transparent">
                  not expensive ad budgets
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Reach customers across a whole network of apps &mdash; with nothing to pay until someone actually walks
                in. No agencies, no guessing, no wasted spend.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
                {[
                  'Only pay for real visits',
                  'Live in minutes',
                  'Reach nearby customers',
                  'Set limits & schedules',
                  'Get paid via Stripe',
                  'See what works, instantly',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F9731615' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#F97316' }} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-6">
                <Link
                  href="/auth/register?role=merchant"
                  className="px-8 py-4 rounded-full text-sm font-semibold text-white hover:opacity-90 hover:-translate-y-0.5 transition-all"
                  style={{ background: 'linear-gradient(to right, #F97316, #EF4444)' }}
                >
                  List your first deal
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-background bg-secondary" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">200+ already onboard</span>
                </div>
              </div>
            </div>

            {/* Merchant card */}
            <div className="relative">
              <div className="relative rounded-3xl border border-border bg-background p-8">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F97316, #EF4444)' }}>
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-bold tracking-tight">Your dashboard</p>
                      <p className="text-xs text-muted-foreground">This week so far</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20">
                    LIVE
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'New customers in', value: '128', trend: '+12%' },
                    { label: 'You earned', value: 'AED 4,290', trend: '+8%' },
                    { label: 'Deals claimed', value: '163', trend: 'Steady' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/40 border border-border/40">
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium text-muted-foreground">{row.label}</p>
                        <p className="text-xl font-bold tracking-tight">{row.value}</p>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {row.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Partner section ── */}
        <section id="developers" className="py-24 md:py-32 px-6 overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#A855F7] opacity-[0.04] blur-[100px] -z-10" />
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Code card */}
            <div className="order-2 lg:order-1 relative">
              <div className="relative rounded-3xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
                    <span className="ml-3 text-[11px] text-muted-foreground font-mono">one request, that&apos;s it</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-secondary border border-border text-[10px] text-emerald-500 font-mono">
                    200 OK
                  </div>
                </div>
                <div className="p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
                  <span className="text-muted-foreground block mb-1">{'// Get deals near your user'}</span>
                  <p className="text-foreground/90">
                    const <span style={{ color: '#A855F7' }}>deals</span> = await offrion.<span className="text-foreground">nearby</span>({'{'}
                    <br />
                    <span className="pl-4">radius: </span>
                    <span style={{ color: '#22C55E' }}>&apos;5km&apos;</span>,
                    <br />
                    <span className="pl-4">limit: </span>
                    <span style={{ color: '#22C55E' }}>25</span>
                    <br />
                    {'}'});
                  </p>
                  <span className="text-muted-foreground block mt-6 mb-1">{'// You earn on every visit'}</span>
                  <p className="text-foreground/90">
                    {'{'}
                    <br />
                    <span className="pl-4">deal: </span>
                    <span style={{ color: '#F97316' }}>&apos;2-for-1 brunch&apos;</span>,
                    <br />
                    <span className="pl-4">your_cut: </span>
                    <span style={{ color: '#A855F7' }}>&apos;70%&apos;</span>,
                    <br />
                    <span className="pl-4">paid: </span>
                    <span style={{ color: '#22C55E' }}>&apos;instantly&apos;</span>
                    <br />
                    {'}'}
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-6">
                <Code2 className="w-3.5 h-3.5" style={{ color: '#A855F7' }} />
                <span className="text-xs font-medium text-foreground">For app builders & partners</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
                One API. Real deals.
                <br />
                <span className="bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent">
                  You keep 70%.
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Give your users genuinely useful local offers and earn on every redemption &mdash; no inventory to
                manage, no payout chasing. We handle the merchants, the matching, and the money.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {[
                  { icon: Clock, title: 'Fast to integrate', desc: "A handful of lines and you're live.", color: '#A855F7' },
                  { icon: Wallet, title: 'Paid automatically', desc: 'Your 70% lands the moment a deal is used.', color: '#F97316' },
                  { icon: MapPin, title: 'Location-aware', desc: 'Show the right deal to the right user nearby.', color: '#EF4444' },
                  { icon: Zap, title: 'Real-time updates', desc: 'Get notified the instant something happens.', color: '#22C55E' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold tracking-tight">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/docs"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all group"
                style={{ background: 'linear-gradient(to right, #A855F7, #F97316)' }}
              >
                Read the docs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Trust / why ── */}
        <section className="py-24 md:py-32 px-6 bg-card/30 border-y border-border relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] rounded-full bg-[#EF4444] opacity-[0.04] blur-[100px] -z-10" />
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-4">
                <Shield className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />
                <span className="text-xs font-medium text-foreground">Why people trust Offrion</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
                Fair, fast, and built to last
              </h2>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                The boring-but-important stuff, handled &mdash; so you can focus on growth.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: MapPin,       title: 'The right deal, nearby',  desc: 'Smart location matching surfaces offers people actually want.',          color: '#A855F7' },
                { icon: QrCode,       title: 'Every visit is real',      desc: 'A quick scan confirms each redemption — no fake claims.',               color: '#F97316' },
                { icon: Wallet,       title: 'Transparent payouts',      desc: 'A clear 70/30 split, settled automatically via Stripe.',                color: '#EF4444' },
                { icon: Zap,          title: 'See results live',         desc: 'Watch visits, claims, and earnings update in real time.',               color: '#22C55E' },
                { icon: Shield,       title: 'Verified merchants',       desc: 'Every business is checked, so quality stays high.',                     color: '#A855F7' },
                { icon: Heart,        title: 'Made for everyone',        desc: 'Clean, friendly tools for merchants, partners, and admins.',            color: '#F97316' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-7 rounded-3xl border border-border bg-background hover:-translate-y-1 transition-all group overflow-hidden relative"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(135deg, ${item.color}08, transparent)` }} />
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${item.color}15` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-base font-bold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-24 md:py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(135deg, #A855F708 0%, #F9731608 50%, #EF444408 100%)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#A855F7]/40 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-[#A855F7] opacity-[0.06] blur-[80px] -z-10" />

          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Ready when{' '}
              <span className="bg-gradient-to-r from-[#A855F7] via-[#F97316] to-[#EF4444] bg-clip-text text-transparent">
                you are
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Whether you run a business or build an app, you can be live today. It&apos;s free to start &mdash; you only
              ever pay when it works.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/auth/register?role=merchant"
                className="w-full sm:w-auto px-9 py-4 rounded-full text-sm font-semibold text-white hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(to right, #F97316, #EF4444)' }}
              >
                <ShoppingBag className="w-4 h-4" />
                I run a business
              </Link>
              <Link
                href="/auth/register?role=partner"
                className="w-full sm:w-auto px-9 py-4 rounded-full text-sm font-semibold text-white hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(to right, #A855F7, #F97316)' }}
              >
                <Code2 className="w-4 h-4" />
                I build an app
              </Link>
            </div>
            <p className="text-xs text-muted-foreground pt-10">
              Free to start &middot; No credit card &middot; Cancel anytime
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
