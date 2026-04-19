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
  Check,
  Wallet,
  MapPin,
  Clock
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/constants/locations';

type TabType = 'personal_info' | 'security' | 'notifications' | 'billing' | 'regional_access';

export default function SettingsForm() {
  const pathname = usePathname();
  const currentContextRole = pathname.startsWith('/merchant') ? 'merchant' : pathname.startsWith('/partner') ? 'partner' : '';
  
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
    businessName: '',
    billingPreference: 'prepaid' as 'prepaid' | 'card_on_file',
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

  // Regional Access Request Data
  const [requestCountries, setRequestCountries] = useState<string[]>([]);
  const [requestSaving, setRequestSaving] = useState(false);

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
    const requests = [
      fetch('/api/auth/me', { credentials: 'include' }).then(res => res.json()),
      fetch('/api/auth/profile/billing', { credentials: 'include' }).then(res => res.json())
    ];

    if (currentContextRole === 'merchant') {
      requests.push(fetch('/api/merchant/profile', { credentials: 'include' }).then(res => res.json()));
    }

    Promise.all(requests)
    .then(([userData, billingData, merchantData]) => {
      setUser(userData);
      const baseData = {
        name: userData.name || '',
        email: userData.email || '',
        businessName: '',
        billingPreference: 'prepaid' as 'prepaid' | 'card_on_file',
      };

      if (merchantData && !merchantData.error) {
        baseData.businessName = merchantData.businessName || '';
        baseData.billingPreference = merchantData.billingPreference || 'prepaid';
      }

      setFormData(baseData);
      
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

      if (currentContextRole === 'merchant') {
        const profileRes = await fetch('/api/merchant/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            businessName: formData.businessName,
            billingPreference: formData.billingPreference,
            contactEmail: formData.email,
            contactPhone: user?.phone || 'N/A', // Assuming phone exists or using fallback
            address: user?.address || 'N/A',
          }),
        });
        if (!profileRes.ok) {
           const profileData = await profileRes.json();
           throw new Error(profileData.error || 'Failed to update merchant profile');
        }
      }

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

  const handleRegionRequest = async () => {
    if (requestCountries.length === 0) {
      setError("Please select at least one country to request.");
      return;
    }

    setRequestSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/partner/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ countries: requestCountries }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit request');

      setUser({
        ...user,
        pendingAccessCountries: data.pending
      });
      setSuccess(true);
      setRequestCountries([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRequestSaving(false);
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
        "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-md transition-all",
        activeTab === id 
          ? "bg-secondary text-white border border-border shadow-none" 
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-foreground" />
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
            {user?.role === 'partner' && renderNavButton('regional_access', 'Regional Access', MapPin)}
            {user?.role !== 'admin' && user?.role !== 'super_admin' && renderNavButton('billing', 'Billing', Globe)}
          </nav>
        </aside>

        <main className="md:col-span-3 space-y-8">
          
          {/* Status Banners */}
          <div className="space-y-4 empty:hidden">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-3 text-destructive text-sm font-medium animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-secondary border border-border rounded-md flex items-center gap-3 text-foreground text-sm font-medium animate-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Your settings have been updated successfully!
              </div>
            )}
          </div>

          {/* Profile Tab */}
          {activeTab === 'personal_info' && (
            <>
              <div className="bg-card border border-border rounded-md overflow-hidden shadow-none">
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
                          className="w-full bg-secondary/50 border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
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
                            className="w-full bg-secondary/50 border border-border rounded-md pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                    </div>

                    {currentContextRole === 'merchant' && (
                      <div className="space-y-2">
                          <label className="text-sm font-semibold ml-1">Business Name</label>
                          <input 
                            type="text" required
                            className="w-full bg-secondary/50 border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={formData.businessName}
                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          />
                      </div>
                    )}
                  </div>

                  {currentContextRole === 'merchant' && (
                    <div className="pt-8 border-t border-border space-y-6">
                       <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Billing Revenue Model</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, billingPreference: 'prepaid'})}
                            className={cn(
                              "p-6 rounded-md border text-left transition-all relative overflow-hidden",
                              formData.billingPreference === 'prepaid' 
                                ? "border-primary bg-muted ring-2 ring-primary/20" 
                                : "border-border bg-secondary/20 hover:bg-secondary/40"
                            )}
                          >
                             <div className="flex justify-between items-start mb-4">
                                <div className={cn("p-2 rounded-lg", formData.billingPreference === 'prepaid' ? "bg-primary text-white" : "bg-card text-muted-foreground")}>
                                   <Wallet className="w-5 h-5" />
                                </div>
                                {formData.billingPreference === 'prepaid' && <CheckCircle2 className="w-5 h-5 text-foreground" />}
                             </div>
                             <h5 className="font-bold">Opt 1: Pre-paid Wallet</h5>
                             <p className="text-xs text-muted-foreground mt-1">Add funds in advance. Commissions are deducted per redemption.</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFormData({...formData, billingPreference: 'card_on_file'})}
                            className={cn(
                              "p-6 rounded-md border text-left transition-all relative overflow-hidden",
                              formData.billingPreference === 'card_on_file' 
                                ? "border-primary bg-muted ring-2 ring-primary/20" 
                                : "border-border bg-secondary/20 hover:bg-secondary/40"
                            )}
                          >
                             <div className="flex justify-between items-start mb-4">
                                <div className={cn("p-2 rounded-lg", formData.billingPreference === 'card_on_file' ? "bg-primary text-white" : "bg-card text-muted-foreground")}>
                                   <CreditCard className="w-5 h-5" />
                                </div>
                                {formData.billingPreference === 'card_on_file' && <CheckCircle2 className="w-5 h-5 text-foreground" />}
                             </div>
                             <h5 className="font-bold">Opt 2: Card on File</h5>
                             <p className="text-xs text-muted-foreground mt-1">Directly charge your attached payment method for commissions.</p>
                          </button>
                       </div>
                    </div>
                  )}

                  <div className="pt-6 flex justify-end">
                      <button 
                      type="submit" disabled={saving}
                      className="flex items-center gap-2 px-8 py-3.5 bg-secondary text-foreground border border-border rounded-md font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-none shadow-primary/20 text-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                      </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-secondary/30 border border-border rounded-md flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Membership Role</p>
                    <div className="w-16 h-16 bg-secondary text-foreground rounded-md flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">
                        {(currentContextRole || user?.role)?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-bold capitalize text-lg text-gradient">{currentContextRole || user?.role}</span>
                </div>
                <div className="p-6 bg-secondary/30 border border-border rounded-md flex flex-col justify-center items-center text-center">
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
            <div className="bg-card border border-border rounded-md overflow-hidden shadow-none animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-md flex items-center justify-center">
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
                        className="w-full bg-secondary/50 border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                      <input 
                        type="password" required
                        placeholder="••••••••"
                        className="w-full bg-secondary/50 border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                  </div>
                </div>

                <div className="pt-6 flex justify-start">
                    <button 
                    type="submit" disabled={saving}
                    className="flex items-center gap-2 px-8 py-3.5 bg-red-500 text-white rounded-md font-bold hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-none shadow-red-500/20 text-sm"
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
            <div className="bg-card border border-border rounded-md overflow-hidden shadow-none animate-in zoom-in-95 duration-300">
               <div className="p-8 border-b border-border bg-gradient-to-r from-blue-500/10 to-transparent flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-md flex items-center justify-center">
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
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-md border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
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
                          notifications[item.id as keyof typeof notifications] ? "bg-secondary border border-border" : "bg-muted"
                        )}
                     >
                       <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
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
                  className="flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-md font-bold hover:bg-blue-600 shadow-none shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Preferences
                  </button>
              </div>
            </div>
          )}

          {/* Regional Access Tab */}
          {activeTab === 'regional_access' && (
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              <div className="bg-card border border-border rounded-md overflow-hidden shadow-none">
                <div className="p-8 border-b border-border bg-gradient-to-r from-primary/10 to-transparent flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 text-foreground rounded-md flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Regional Distribution Access</h3>
                    <p className="text-sm text-muted-foreground mt-1">Manage where your application can discover and distribute deals.</p>
                  </div>
                </div>

                <div className="p-8 space-y-10">
                  {/* Current Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Authorized Regions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user?.accessCountries && user.accessCountries.length > 0 ? (
                          user.accessCountries.map((c: string) => (
                            <span key={c} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md text-[10px] font-bold">
                              {c}
                            </span>
                          ))
                        ) : (
                          <div className="p-4 bg-muted/30 rounded-md border border-dashed border-border w-full text-center">
                             <p className="text-xs text-muted-foreground italic">No authorized regions yet. Your API access is currently locked.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" /> Pending Approval
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user?.pendingAccessCountries && user.pendingAccessCountries.length > 0 ? (
                          user.pendingAccessCountries.map((c: string) => (
                            <span key={c} className="px-3 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md text-[10px] font-bold animate-pulse">
                              {c}
                            </span>
                          ))
                        ) : (
                          <div className="p-4 bg-muted/30 rounded-md border border-dashed border-border w-full text-center">
                             <p className="text-xs text-muted-foreground italic">No pending requests.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Request New Access */}
                  <div className="pt-8 border-t border-border space-y-6">
                    <div>
                       <h4 className="text-sm font-bold tracking-tight">Request New Region Access</h4>
                       <p className="text-xs text-muted-foreground mt-1">Select the countries you wish to expand into. Our team usually reviews requests within 24 hours.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {COUNTRIES.filter(c => 
                        !(user?.accessCountries || []).includes(c.name) && 
                        !(user?.pendingAccessCountries || []).includes(c.name)
                      ).map((c) => {
                        const isSelected = requestCountries.includes(c.name);
                        return (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setRequestCountries(requestCountries.filter(a => a !== c.name));
                              } else {
                                setRequestCountries([...requestCountries, c.name]);
                              }
                            }}
                            className={cn(
                              "p-4 rounded-md border text-left transition-all group",
                              isSelected 
                                ? "bg-secondary border-primary ring-2 ring-primary/20" 
                                : "bg-secondary/20 border-border hover:bg-secondary/40"
                            )}
                          >
                             <div className="flex justify-between items-center">
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", isSelected ? "text-white" : "text-muted-foreground")}>{c.code}</span>
                                {isSelected && <Check className="w-4 h-4 text-foreground" />}
                             </div>
                             <p className="font-bold text-xs mt-1">{c.name}</p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-4">
                       <button
                         type="button"
                         disabled={requestSaving || requestCountries.length === 0}
                         onClick={handleRegionRequest}
                         className="px-8 py-3.5 bg-secondary text-foreground border border-border rounded-md font-bold shadow-none shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm flex items-center gap-2"
                       >
                         {requestSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                         Submit Access Request
                       </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-secondary/10 border-t border-border">
                   <div className="flex items-start gap-4">
                      <AlertCircle className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-muted-foreground leading-relaxed">
                         <p className="font-bold text-foreground mb-1">Strict Geographic Policy</p>
                         Offrion enforces strict regional boundaries. If your application attempts to fetch deals from a country you are not authorized for, the API will return zero results. 
                         Authorized regions are automatically included in your discovery range.
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && subscription && (
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              <div className="bg-card border border-border rounded-md overflow-hidden shadow-none">
                 <div className="p-8 border-b border-border bg-gradient-to-r from-primary/10 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 text-foreground rounded-md flex items-center justify-center">
                       <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Billing & Subscription</h3>
                      <p className="text-sm text-muted-foreground mt-1">Manage your payment methods and plans.</p>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 bg-white/5 dark:bg-black/20 border border-border rounded-md text-center backdrop-blur-sm shadow-inner">
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
                                    <Check className="w-3.5 h-3.5 text-foreground" />
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
                          <div className="p-4 bg-secondary/30 rounded-md border border-border">
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
                             features: (currentContextRole || user?.role || 'partner') === 'partner' 
                               ? ['10k API Requests', 'Standard Analytics'] 
                               : ['Basic Deals', 'Email Support']
                           },
                           { 
                             id: 'pro', 
                             name: 'Professional', 
                             price: '$49',
                             desc: 'Scale your operations.',
                             popular: true,
                             features: (currentContextRole || user?.role || 'partner') === 'partner'
                               ? ['100k API Requests', 'Full Analytics', 'API Key Mgmt']
                               : ['Unlimited Deals', 'Advanced Analytics', 'Custom Branding']
                           },
                           { 
                             id: 'enterprise', 
                             name: 'Enterprise', 
                             price: (currentContextRole || user?.role || 'partner') === 'partner' ? '$399' : '$199',
                             desc: 'Dedicated infrastructure.',
                             features: (currentContextRole || user?.role || 'partner') === 'partner'
                               ? ['Unlimited API', 'Webhooks', 'Dedicated Node']
                               : ['White-labeling', 'Dedicated Mgr', 'Custom Integrations']
                           }
                         ].map((plan) => {
                           const contextRole = currentContextRole || user?.role || 'partner';
                           const rolePrefix = contextRole === 'partner' ? 'partner_' : 'merchant_';
                           const fullId = `${rolePrefix}${plan.id}`;
                           const isCurrent = subscription.plan === plan.id || subscription.plan === fullId;
                           const isPaid = !subscription.plan.includes('free');
                           
                           return (
                             <div key={plan.id} className={cn(
                               "relative p-5 rounded-[24px] border transition-all flex flex-col",
                               isCurrent ? "border-primary bg-muted shadow-inner" : "border-border bg-card hover:bg-secondary/20",
                               plan.popular && !isCurrent && "border-primary/50 shadow-none shadow-primary/5"
                             )}>
                               {plan.popular && !isCurrent && (
                                 <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-secondary text-foreground border border-border text-[10px] font-black uppercase rounded-full shadow-none">Most Popular</span>
                               )}
                               
                               <div className="mb-4">
                                  <h5 className="font-bold text-base">{plan.name} {isCurrent && <span className="ml-1 text-[10px] bg-primary text-foreground px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Current</span>}</h5>
                                  <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-2xl font-black">{plan.price}</span>
                                    {plan.id !== 'enterprise' && <span className="text-[10px] text-muted-foreground font-bold uppercase">/mo</span>}
                                  </div>
                               </div>

                               <ul className="space-y-2 mb-6 flex-grow">
                                  {plan.features.map(f => (
                                    <li key={f} className="text-xs flex items-center gap-2 font-medium opacity-80">
                                      <span className="w-1.5 h-1.5 rounded-full bg-background"></span> {f}
                                    </li>
                                  ))}
                               </ul>

                               <button 
                                 disabled={isCurrent || (plan.id === 'free' && isPaid) || saving}
                                 onClick={() => plan.id === 'enterprise' ? window.location.href = 'mailto:sales@offrion.com' : handleManageSubscription(fullId)}
                                 className={cn(
                                   "w-full py-2.5 rounded-md font-bold text-xs transition-all",
                                   isCurrent ? "bg-secondary text-white cursor-default" : 
                                   (plan.id === 'free' && isPaid) ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" :
                                   "bg-secondary text-white border border-border shadow-none active:scale-95"
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

                <div className="p-8 bg-secondary/10 border-t border-border mt-4">
                    <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-black">Powered by Stripe & Offrion Billing Hub</p>
                </div>
              </div>
            </div>
          </div>
        )}

        </main>
      </div>
    </div>
  );
}
