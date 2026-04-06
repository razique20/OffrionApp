'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  CreditCard,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'personal_info' | 'security' | 'notifications' | 'billing';

export default function SettingsForm() {
  const [activeTab, setActiveTab] = useState<TabType>('personal_info');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Password Data
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Toggles (Mock)
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    dealSummaries: true,
    marketing: false,
    securityAlerts: true
  });

  // Subscription Data
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }, 5000);
    }
    if (params.get('canceled') === 'true') {
      setError("Payment was canceled. You can try again whenever you're ready.");
      setTimeout(() => setError(null), 5000);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me', { credentials: 'include' }).then(res => res.json()),
      fetch('/api/auth/profile/billing', { credentials: 'include' }).then(res => res.json())
    ])
    .then(([userData, billingData]) => {
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
      });
      if (billingData && billingData.subscription) {
        setSubscription(billingData.subscription);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setUser(data.user);
      triggerSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/auth/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setPasswordData({ newPassword: '', confirmPassword: '' });
      triggerSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMockSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      triggerSuccess();
    }, 800);
  };

  const handleManageSubscription = async (planId?: string) => {
    setSaving(true);
    setError(null);
    try {
      // Determine the plan to checkout based on current user role/plan
      const rolePrefix = user?.role === 'partner' ? 'partner_' : 'merchant_';
      const currentPlan = subscription.plan.includes('_') ? subscription.plan : `${rolePrefix}${subscription.plan}`;
      
      const planToCheckout = planId || (currentPlan.includes('free') 
        ? `${rolePrefix}pro` 
        : currentPlan);

      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: planToCheckout }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize checkout');
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const triggerSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const renderNavButton = (id: TabType, label: string, Icon: any) => (
    <button 
      onClick={() => {
        setActiveTab(id);
        setError(null);
        setSuccess(false);
      }}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all",
        activeTab === id 
          ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="text-sm font-medium text-muted-foreground">Loading settings...</span>
    </div>
  );

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          <nav className="space-y-1 sticky top-8">
            {renderNavButton('personal_info', 'Personal Info', User)}
            {renderNavButton('security', 'Security', Shield)}
            {renderNavButton('notifications', 'Notifications', Bell)}
            {user?.role !== 'admin' && user?.role !== 'super_admin' && renderNavButton('billing', 'Billing', Globe)}
          </nav>
        </aside>

        <main className="md:col-span-3 space-y-8">
          
          {/* Status Banners */}
          <div className="space-y-4 empty:hidden">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm font-medium animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3 text-primary text-sm font-medium animate-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Your settings have been updated successfully!
              </div>
            )}
          </div>

          {/* Profile Tab */}
          {activeTab === 'personal_info' && (
            <>
              <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-xl">
                <div className="p-8 border-b border-border bg-gradient-to-r from-secondary/50 to-transparent">
                  <h3 className="text-xl font-bold">Profile Details</h3>
                  <p className="text-sm text-muted-foreground mt-1">General information about your account.</p>
                </div>
                
                <form onSubmit={handleProfileSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Full Name</label>
                        <input 
                          type="text" required
                          className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            type="email" required
                            className="w-full bg-secondary/50 border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                      <button 
                      type="submit" disabled={saving}
                      className="flex items-center gap-2 px-8 py-3.5 bg-premium-gradient text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-primary/20 text-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                      </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-secondary/30 border border-border rounded-2xl flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Membership Role</p>
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">
                        {user?.role?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-bold capitalize text-lg text-gradient">{user?.role}</span>
                </div>
                <div className="p-6 bg-secondary/30 border border-border rounded-2xl flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Member Since</p>
                    <div className="text-4xl font-bold font-mono tracking-tighter">
                      {user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      {user?.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) 
                        : 'Joined'}
                    </p>
                </div>
              </div>
            </>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-xl animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center">
                   <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Security & Password</h3>
                  <p className="text-sm text-muted-foreground mt-1">Keep your account secure.</p>
                </div>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
                <div className="space-y-4 max-w-sm">
                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                      <input 
                        type="password" required
                        placeholder="••••••••"
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                      <input 
                        type="password" required
                        placeholder="••••••••"
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                  </div>
                </div>

                <div className="pt-6 flex justify-start">
                    <button 
                    type="submit" disabled={saving}
                    className="flex items-center gap-2 px-8 py-3.5 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-red-500/20 text-sm"
                  >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      Update Password
                    </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-xl animate-in zoom-in-95 duration-300">
               <div className="p-8 border-b border-border bg-gradient-to-r from-blue-500/10 to-transparent flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center">
                   <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground mt-1">Control how Offrion communicates with you.</p>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                {[
                  { id: 'emailAlerts', title: 'Critical Email Alerts', desc: 'Receive immediate emails for critical account activities (login from new IP, etc).' },
                  { id: 'securityAlerts', title: 'Security Summaries', desc: 'Get a weekly rundown of security events and activity.' },
                  { id: 'dealSummaries', title: 'Deal Performance Summaries', desc: 'Receive weekly roundups of your deals\' engagement and conversions.' },
                  { id: 'marketing', title: 'News & Marketing', desc: 'Stay updated on Offrion platform updates, new features and promotions.' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                     <div className="space-y-1">
                        <label htmlFor={item.id} className="text-sm font-bold block cursor-pointer">{item.title}</label>
                        <p className="text-xs text-muted-foreground max-w-sm">{item.desc}</p>
                     </div>
                     <button
                        type="button"
                        id={item.id}
                        role="switch"
                        aria-checked={notifications[item.id as keyof typeof notifications]}
                        onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id as keyof typeof notifications] })}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                          notifications[item.id as keyof typeof notifications] ? "bg-premium-gradient" : "bg-muted"
                        )}
                     >
                       <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            notifications[item.id as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                     </button>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-secondary/10 border-t border-border flex justify-end">
                  <button 
                  onClick={() => handleMockSave()} 
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Preferences
                  </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && subscription && (
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-xl">
                 <div className="p-8 border-b border-border bg-gradient-to-r from-primary/10 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center">
                       <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Billing & Subscription</h3>
                      <p className="text-sm text-muted-foreground mt-1">Manage your payment methods and plans.</p>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 bg-white/5 dark:bg-black/20 border border-border rounded-xl text-center backdrop-blur-sm shadow-inner">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</p>
                     <p className="font-bold text-gradient text-lg capitalize">{subscription.status}</p>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                   {/* Current Plan Summary */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Active Features</h4>
                          <ul className="space-y-2">
                             {subscription.features && subscription.features.length > 0 ? (
                               subscription.features.map((feature: string) => (
                                 <li key={feature} className="flex items-center gap-2 text-sm font-medium">
                                    <Check className="w-3.5 h-3.5 text-primary" />
                                    {feature}
                                 </li>
                               ))
                             ) : (
                               <li className="text-sm text-muted-foreground italic">Basic Features Applied</li>
                             )}
                          </ul>
                       </div>
                       <div className="space-y-4">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Next Renewal</h4>
                          <div className="p-4 bg-secondary/30 rounded-2xl border border-border">
                             <p className="text-sm font-bold">{subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                             <p className="text-xs text-muted-foreground mt-1">Your plan will automatically renew on this date.</p>
                          </div>
                          {subscription.paymentMethodLast4 && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                               <CreditCard className="w-3 h-3" />
                               Ending in {subscription.paymentMethodLast4}
                            </div>
                          )}
                       </div>
                   </div>

                   {/* Plan Comparison */}
                   <div className="space-y-4 pt-4">
                      <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Available Plans</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {[
                           { 
                             id: 'free', 
                             name: 'Starter', 
                             price: '$0',
                             desc: 'For individuals starting out.',
                             features: user?.role === 'partner' 
                               ? ['10k API Requests', 'Standard Analytics'] 
                               : ['Basic Deals', 'Email Support']
                           },
                           { 
                             id: 'pro', 
                             name: 'Professional', 
                             price: user?.role === 'partner' ? '$29' : '$49',
                             desc: 'Scale your operations.',
                             popular: true,
                             features: user?.role === 'partner'
                               ? ['100k API Requests', 'Full Analytics', 'API Key Mgmt']
                               : ['Unlimited Deals', 'Advanced Analytics', 'Custom Branding']
                           },
                           { 
                             id: 'enterprise', 
                             name: 'Enterprise', 
                             price: 'Custom',
                             desc: 'Dedicated infrastructure.',
                             features: user?.role === 'partner'
                               ? ['Unlimited API', 'Webhooks', 'Dedicated Node']
                               : ['White-labeling', 'Dedicated Mgr', 'Custom Integrations']
                           }
                         ].map((plan) => {
                           const rolePrefix = user?.role === 'partner' ? 'partner_' : 'merchant_';
                           const fullId = `${rolePrefix}${plan.id}`;
                           const isCurrent = subscription.plan === plan.id || subscription.plan === fullId;
                           const isPaid = !subscription.plan.includes('free');
                           
                           return (
                             <div key={plan.id} className={cn(
                               "relative p-5 rounded-[24px] border transition-all flex flex-col",
                               isCurrent ? "border-primary bg-primary/5 shadow-inner" : "border-border bg-card hover:bg-secondary/20",
                               plan.popular && !isCurrent && "border-primary/50 shadow-lg shadow-primary/5"
                             )}>
                               {plan.popular && !isCurrent && (
                                 <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-premium-gradient text-white text-[10px] font-black uppercase rounded-full shadow-lg">Most Popular</span>
                               )}
                               
                               <div className="mb-4">
                                  <h5 className="font-bold text-base">{plan.name} {isCurrent && <span className="ml-1 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Current</span>}</h5>
                                  <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-2xl font-black">{plan.price}</span>
                                    {plan.id !== 'enterprise' && <span className="text-[10px] text-muted-foreground font-bold uppercase">/mo</span>}
                                  </div>
                               </div>

                               <ul className="space-y-2 mb-6 flex-grow">
                                  {plan.features.map(f => (
                                    <li key={f} className="text-xs flex items-center gap-2 font-medium opacity-80">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> {f}
                                    </li>
                                  ))}
                               </ul>

                               <button 
                                 disabled={isCurrent || (plan.id === 'free' && isPaid) || saving}
                                 onClick={() => plan.id === 'enterprise' ? window.location.href = 'mailto:sales@offrion.com' : handleManageSubscription(fullId)}
                                 className={cn(
                                   "w-full py-2.5 rounded-xl font-bold text-xs transition-all",
                                   isCurrent ? "bg-primary/10 text-primary cursor-default" : 
                                   (plan.id === 'free' && isPaid) ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" :
                                   "bg-premium-gradient text-white shadow-md active:scale-95"
                                 )}
                               >
                                 {isCurrent ? 'Active Plan' : 
                                  (plan.id === 'free' && isPaid) ? 'Downgrade' :
                                  plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade Now'}
                               </button>
                             </div>
                           )
                         })}
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-secondary/10 border-t border-border mt-4">
                    <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-black">Powered by Stripe & Offrion Billing Hub</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
