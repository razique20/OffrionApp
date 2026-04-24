'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Layers, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Ban,
  Edit2,
  ExternalLink,
  ChevronRight,
  Clock,
  Download,
  MapPin
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { RedemptionPulse } from '@/components/admin/RedemptionPulse';
import { COUNTRIES } from '@/constants/locations';

type TabType = 'overview' | 'merchants' | 'partners' | 'deals' | 'categories' | 'admins' | 'financials' | 'review';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Category & Admin Management State
  const [me, setMe] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin', permissions: [] as string[] });
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [reviewSubTab, setReviewSubTab] = useState<'merchants' | 'deals' | 'funds' | 'regions'>('merchants');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Editable User Fields
  const [editCountry, setEditCountry] = useState('');
  const [editAccessCountries, setEditAccessCountries] = useState<string[]>([]);
  const [editCreditLimit, setEditCreditLimit] = useState<number>(0);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch Stats & Initial Data
  useEffect(() => {
    fetchMe();
    fetchStats();
    if (activeTab === 'categories') fetchCategories();
    else if (activeTab === 'admins') fetchAdmins();
    else if (activeTab === 'financials') fetchFinancials();
    else if (activeTab === 'review') fetchModerationQueue();
    else if (activeTab !== 'overview') fetchData(activeTab);
  }, [activeTab]);

  const [financials, setFinancials] = useState<any>(null);
  const [moderationData, setModerationData] = useState<any>({ deals: [], merchants: [], commissions: [], regionalRequests: [] });

  const fetchFinancials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/commissions');
      const json = await res.json();
      if (res.ok) setFinancials(json);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchModerationQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/moderation');
      const json = await res.json();
      if (res.ok) setModerationData(json);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) setMe(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/admins');
      const json = await res.json();
      if (res.ok) setAdmins(json);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (res.ok) setStats(json);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const fetchData = async (tab: TabType) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (tab === 'merchants') endpoint = '/api/admin/users?role=merchant';
      else if (tab === 'partners') endpoint = '/api/admin/users?role=partner';
      else if (tab === 'deals') endpoint = '/api/admin/deals';
      
      const res = await fetch(endpoint);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch data');
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching categories from /api/admin/categories...');
      const res = await fetch('/api/admin/categories');
      const json = await res.json();
      console.log('Categories Response:', json);
      if (res.ok) {
        setCategories(Array.isArray(json) ? json : []);
      } else {
        throw new Error(json.error || 'Failed to load categories');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setData(data.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
        showNotification(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        const json = await res.json();
        showNotification(json.error || 'Failed to update user status', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Network error occurred', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('new-cat');
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat),
      });
      if (res.ok) {
        const json = await res.json();
        setCategories([...categories, json.category]);
        setNewCat({ name: '', slug: '', description: '' });
        showNotification('Category initialized successfully');
      } else {
        const json = await res.json();
        showNotification(json.error || 'Failed to create category', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Network error occurred', 'error');
    } finally {
      setActionLoading(null);
    }
  };
  const handleModerateDealV2 = async (dealId: string, status: 'active' | 'rejected') => {
    setActionLoading(dealId);
    try {
      const res = await fetch(`/api/admin/deals/${dealId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setModerationData({
          ...moderationData,
          deals: moderationData.deals.filter((d: any) => d._id !== dealId)
        });
        showNotification(`Deal ${status === 'active' ? 'approved' : 'rejected'} successfully`);
        fetchStats();
      } else {
        const json = await res.json();
        showNotification(json.error || 'Failed to moderate deal', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Network error occurred', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleModerateCommission = async (commissionId: string, status: 'paid' | 'rejected') => {
    setActionLoading(commissionId);
    try {
      const res = await fetch(`/api/admin/commissions/${commissionId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setModerationData({
          ...moderationData,
          commissions: moderationData.commissions.filter((c: any) => c._id !== commissionId)
        });
        showNotification(`Payout audit ${status} successfully`);
        fetchStats();
      } else {
        const json = await res.json();
        showNotification(json.error || 'Failed to moderate fund audit', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Network error occurred', 'error');
    } finally {
      setActionLoading(null);
    }
  };
  const handleModerateMerchant = async (merchantId: string, status: 'verified' | 'rejected') => {
    setActionLoading(merchantId);
    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setModerationData({
          ...moderationData,
          merchants: moderationData.merchants.filter((m: any) => m._id !== merchantId)
        });
        showNotification(`Merchant ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
        fetchStats();
      } else {
        const json = await res.json();
        showNotification(json.error || 'Failed to verify merchant', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Network error occurred', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveRegions = async (partnerId: string, pendingRegions: string[]) => {
    setActionLoading(partnerId);
    try {
      const partnerRes = await fetch(`/api/admin/users/${partnerId}`);
      const partnerJson = await partnerRes.json();
      const currentAccess = partnerJson.user.accessCountries || [];
      const newAccess = Array.from(new Set([...currentAccess, ...pendingRegions]));

      const res = await fetch(`/api/admin/users/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessCountries: newAccess,
          pendingAccessCountries: []
        }),
      });

      if (res.ok) {
        setModerationData({
          ...moderationData,
          regionalRequests: moderationData.regionalRequests.filter((r: any) => r._id !== partnerId)
        });
        showNotification('Regional access granted');
        fetchStats();
      } else {
        const json = await res.json();
        showNotification(json.error || 'Failed to approve regions', 'error');
      }
    } catch (err: any) {
      showNotification(err.message || 'Error occurred', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetail = async (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
    setDetailData(null);
    try {
      // Use Admin API for both users and deals to avoid API Key requirements
      const endpoint = activeTab === 'deals' ? `/api/admin/deals/${item._id}` : `/api/admin/users/${item._id}`;
      const res = await fetch(endpoint);
      const json = await res.json();
      if (res.ok) {
        setDetailData(json);
        if (json.user) {
          setEditCountry(json.user.country || 'United Arab Emirates');
          setEditAccessCountries(json.user.accessCountries || []);
        }
        if (json.profile) {
          setEditCreditLimit(json.profile.creditLimit || 0);
        }
      } else {
        console.error('Fetch error:', json.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserLocations = async () => {
    if (!selectedItem || !detailData?.user) return;
    setActionLoading(selectedItem._id);
    try {
      const res = await fetch(`/api/admin/users/${selectedItem._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: editCountry,
          accessCountries: editAccessCountries,
          pendingAccessCountries: detailData.user.role === 'partner' ? [] : detailData.user.pendingAccessCountries,
          creditLimit: editCreditLimit
        }),
      });
      if (res.ok) {
        showNotification('User regional access updated successfully');
        setIsDetailOpen(false);
        fetchData(activeTab);
      } else {
        const json = await res.json();
        showNotification(json.error || 'Failed to update user', 'error');
      }
    } catch (err: any) {
      showNotification(err.message || 'Network error', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleCategory = async (catId: string, currentStatus: boolean) => {
    setActionLoading(catId);
    try {
      const res = await fetch(`/api/admin/categories/${catId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setCategories(categories.map(c => c._id === catId ? { ...c, isActive: !currentStatus } : c));
        showNotification('Category status updated');
      } else {
        const json = await res.json();
        showNotification(json.error || 'Failed to update category', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Network error occurred', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setActionLoading(selectedItem._id);
    try {
      let endpoint = '';
      if (activeTab === 'deals') endpoint = `/api/admin/deals/${selectedItem._id}`;
      else if (activeTab === 'categories') endpoint = `/api/admin/categories/${selectedItem._id}`;
      else if (activeTab === 'admins' || selectedItem.role === 'admin' || selectedItem.role === 'super_admin') endpoint = `/api/admin/admins/${selectedItem._id}`;
      else endpoint = `/api/admin/users/${selectedItem._id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      const json = await res.json();

      if (res.ok) {
        if (activeTab === 'categories') setCategories(categories.filter(c => c._id !== selectedItem._id));
        else if (activeTab === 'admins' || selectedItem.role === 'admin' || selectedItem.role === 'super_admin') {
          setAdmins(admins.filter(a => a._id !== selectedItem._id));
          setEditingAdminId(null);
        }
        else setData(data.filter(i => i._id !== selectedItem._id));
        
        showNotification(`${activeTab === 'categories' ? 'Category' : activeTab === 'admins' ? 'Administrator' : 'Item'} removed permanently`);
        fetchStats();
      } else {
         showNotification(json.error || 'Delete failed', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Network error occurred', 'error');
    } finally {
      setIsDeleteOpen(false);
      setSelectedItem(null);
      setActionLoading(null);
    }
  };

  const dashboardStats = [
    { name: 'Merchants', value: stats?.merchants || '0', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Partners', value: stats?.partners || '0', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Revenue', value: `$${stats?.revenue?.toLocaleString() || '0'}`, icon: TrendingUp, color: 'text-white', bg: 'bg-secondary' },
    { name: 'Active Deals', value: stats?.deals || '0', icon: Layers, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="w-full flex flex-col font-sans animate-fade-in relative z-10 px-4 md:px-0">
      
      {/* ── HORIZONTAL SUB-NAVIGATION (VERCEL STYLE) ── */}
      <div className="border-b border-border mb-8 sticky top-0 z-40 bg-background/80 backdrop-blur-md">
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {(['overview', 'merchants', 'partners', 'deals', 'categories', 'review', 'admins', 'financials'] as TabType[])
            .filter(tab => tab !== 'admins' || me?.role === 'super_admin')
            .map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-2 py-4 text-sm font-medium transition-all relative whitespace-nowrap",
                    isActive 
                      ? "text-white" 
                      : "text-[#888] hover:text-white"
                  )}
                >
                  <span className="capitalize">{tab}</span>
                  {tab === 'review' && moderationData.deals.length + moderationData.merchants.length + moderationData.regionalRequests.length > 0 && (
                    <span className="w-5 h-5 bg-accent text-foreground text-[10px] flex items-center justify-center rounded-md font-bold mb-0.5 ml-2">
                      {moderationData.deals.length + moderationData.merchants.length + moderationData.regionalRequests.length}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-t-full" />
                  )}
                </button>
              );
            })}
        </nav>
      </div>

      {notification && (
        <div className={cn(
          "fixed bottom-8 right-8 z-[100] px-6 py-3 rounded-md text-sm font-bold animate-in slide-in-from-right duration-300 flex items-center gap-3",
          notification.type === 'success' ? "bg-white text-black" : "bg-[#E00] text-white"
        )}>
          {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100 font-normal underline text-[10px]">DISMISS</button>
        </div>
      )}

      {/* Main Content Render */}
      <div className="w-full flex-1 flex flex-col">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 w-full animate-fade-in flex-1 flex flex-col">
          {/* Subtle Dynamic Header */}
          <header className="mb-8">
          <div className="flex items-center gap-2 text-[10px] text-[#888] uppercase tracking-[0.2em] font-black mb-2 opacity-80">
            <span>Foundation</span>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span className="text-foreground">{activeTab}</span>
          </div>
          <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold tracking-tighter flex items-center gap-4">
                  <span className="capitalize">{activeTab}</span>
                  {loading && <Loader2 className="w-6 h-6 animate-spin opacity-20" />}
                </h1>
                <p className="text-muted-foreground text-lg mt-2 max-w-2xl font-medium opacity-60">
                  {activeTab === 'overview' && "Comprehensive real-time metrics and system health indicators."}
                  {activeTab === 'merchants' && "Merchant onboarding, verification status, and business profiles."}
                  {activeTab === 'partners' && "Publisher integration health, API key status, and platform reach."}
                  {activeTab === 'deals' && "Direct offer management, regional locks, and live marketplace stats."}
                </p>
              </div>
              {activeTab === 'overview' && (
                <button 
                  onClick={() => fetchData('overview')}
                  className="px-6 py-2 bg-secondary text-foreground text-xs font-bold rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Refresh Data
                </button>
              )}
            </div>
          </header>

          <main className="space-y-12 pb-24 flex-1">
            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'Ecosystem Revenue', value: stats?.revenue || '$0', icon: TrendingUp },
                    { name: 'Active Marketplace Orders', value: stats?.activeDeals || '0', icon: Layers },
                    { name: 'Registered Merchants', value: stats?.merchants || '0', icon: ShoppingBag },
                    { name: 'Connected Partners', value: stats?.partners || '0', icon: Users },
                  ].map((stat) => (
                    <div key={stat.name} className="vercel-section relative group hover:border-foreground/30 transition-all cursor-pointer">
                      <div className="vercel-section-content">
                        <div className="flex justify-between items-start mb-6">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">{stat.name}</p>
                          <stat.icon className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                        </div>
                        <h3 className="text-4xl font-bold tracking-tighter">{stat.value}</h3>
                      </div>
                      <div className="vercel-section-footer bg-secondary/10">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                           Real-time Stats
                        </span>
                        <ChevronRight className="w-3 h-3 opacity-20 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 vercel-section">
                     <div className="vercel-section-header flex items-center justify-between">
                       <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-40" />
                          Marketplace Conversion Stream
                       </h2>
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     </div>
                     <div className="vercel-section-content bg-secondary/5 h-[400px]">
                       <RedemptionPulse />
                     </div>
                   </div>
                   <div className="space-y-8">
                     <div className="vercel-section">
                        <div className="vercel-section-header">
                           <h2 className="text-xs font-black uppercase tracking-[0.2em]">System Status</h2>
                        </div>
                        <div className="vercel-section-content space-y-4">
                           {[
                             { l: 'API Infrastructure', v: '99.9% Uptime', c: 'text-emerald-500' },
                             { l: 'Auth Subsystem', v: 'Proxy Active', c: 'text-foreground' },
                             { l: 'Geo-Redundancy', v: 'Replicating', c: 'text-blue-500' },
                           ].map(s => (
                             <div key={s.l} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                                <span className="text-[10px] font-black uppercase opacity-60">{s.l}</span>
                                <span className={cn("text-xs font-bold", s.c)}>{s.v}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="vercel-section">
                        <div className="vercel-section-header">
                           <h2 className="text-xs font-black uppercase tracking-[0.2em]">Quick Actions</h2>
                        </div>
                        <div className="vercel-section-content grid grid-cols-2 gap-4">
                           <button className="p-6 border border-border rounded-lg text-center hover:bg-secondary transition-all group">
                              <Plus className="w-6 h-6 mx-auto mb-2 opacity-20 group-hover:opacity-100" />
                              <span className="text-[10px] font-black uppercase tracking-widest">New Identity</span>
                           </button>
                           <button onClick={() => setActiveTab('review')} className="p-6 border border-border rounded-lg text-center hover:bg-secondary transition-all group">
                              <ShieldCheck className="w-6 h-6 mx-auto mb-2 opacity-20 group-hover:opacity-100" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Open Review</span>
                           </button>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* ── STANDARD DATA TABLES (Merchants, Partners, Deals) ── */}
            {['merchants', 'partners', 'deals'].includes(activeTab) && (
              <div className="vercel-section transition-all">
                <div className="vercel-section-header flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]">Active {activeTab} Records</h2>
                  <div className="flex gap-4">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-30" />
                        <input placeholder="Filter results..." className="bg-background border border-border rounded-md pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground w-64 transition-all" />
                     </div>
                  </div>
                </div>
                <div className="vercel-section-content p-0 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/20 border-b border-border">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Identity</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Meta</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.map((item) => (
                        <tr key={item._id} className="group hover:bg-secondary/30 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-[10px] font-bold overflow-hidden border border-border">
                                {item.logoUrl || item.images?.[0] ? (
                                  <img src={item.logoUrl || item.images[0]} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                ) : (item.name?.[0] || item.title?.[0])}
                              </div>
                              <div>
                                <p className="text-sm font-bold tracking-tight mb-1">{item.name || item.title}</p>
                                <p className="text-id opacity-40">#{item._id.slice(-8).toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs font-semibold opacity-60">
                              {activeTab === 'deals' ? `${item.discountPercentage}% DISCOUNT MAX` : item.email}
                            </p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <span className={cn(
                                  "w-2 h-2 rounded-full",
                                  item.status === 'active' || item.status === 'verified' || item.isActive ? "bg-emerald-500" : "bg-red-500"
                                )} />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                  {item.status || (item.isActive ? 'AUTHORIZED' : 'LOCKED')}
                                </span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button 
                                 onClick={() => { setSelectedItem(item); setIsDeleteOpen(true); }}
                                 className="px-3 py-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-md"
                                >
                                   <Ban className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => { setSelectedItem(item); handleViewDetail(item); }}
                                  className="px-4 py-2 bg-primary text-primary-foreground border border-primary rounded-md text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                  Inspect
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.length === 0 && !loading && (
                    <div className="p-32 text-center opacity-30">
                       <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
                       <p className="text-xs font-black uppercase tracking-[0.2em]">No records in current context</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── REVIEW CENTER ── */}
            {activeTab === 'review' && (
              <div className="space-y-8">
                <div className="flex border-b border-border">
                  {(['merchants', 'deals', 'funds', 'regions'] as const).map(sub => (
                    <button
                      key={sub}
                      onClick={() => setReviewSubTab(sub)}
                      className={cn(
                        "px-8 pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all",
                        reviewSubTab === sub ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {sub}
                      <span className="ml-3 px-2 py-0.5 bg-secondary border border-border rounded text-[9px] opacity-100">
                        {sub === 'merchants' && moderationData.merchants.length}
                        {sub === 'deals' && moderationData.deals.length}
                        {sub === 'funds' && moderationData.commissions.length}
                        {sub === 'regions' && moderationData.regionalRequests.length}
                      </span>
                      {reviewSubTab === sub && <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-foreground rounded-t-full" />}
                    </button>
                  ))}
                </div>

                <div className="vercel-section">
                   <div className="vercel-section-content p-0">
                      <table className="w-full text-left">
                         <tbody className="divide-y divide-border">
                            {reviewSubTab === 'merchants' && moderationData.merchants.length === 0 && (
                               <tr><td className="p-32 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">Verification queue is clear</td></tr>
                            )}
                            {reviewSubTab === 'merchants' && moderationData.merchants.map((m: any) => (
                               <tr key={m._id} className="group hover:bg-secondary/20 transition-colors">
                                  <td className="px-8 py-8 flex items-center gap-6">
                                     <div className="w-12 h-12 rounded bg-foreground text-background flex items-center justify-center font-bold text-xl">{m.name[0]}</div>
                                     <div>
                                        <p className="text-lg font-bold tracking-tighter leading-none mb-2">{m.name}</p>
                                        <p className="text-xs font-medium opacity-50">{m.email}</p>
                                     </div>
                                  </td>
                                  <td className="px-8 py-8 text-right space-x-3">
                                     <button onClick={() => handleModerateMerchant(m._id, 'verified')} className="px-8 py-3.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.1em] rounded-md hover:opacity-90 transition-all">Grant Accreditation</button>
                                     <button onClick={() => handleModerateMerchant(m._id, 'rejected')} className="px-8 py-3.5 bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-[0.1em] rounded-md hover:bg-red-600 hover:text-white transition-all">Deny</button>
                                  </td>
                               </tr>
                            ))}
                            {/* Region Requests Rendering */}
                            {reviewSubTab === 'regions' && moderationData.regionalRequests.map((partner: any) => (
                               <tr key={partner._id} className="group hover:bg-secondary/20 transition-colors">
                                  <td className="px-8 py-8">
                                     <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center font-bold text-xl border border-border">{partner.name[0]}</div>
                                        <div>
                                           <p className="text-lg font-bold tracking-tighter mb-1">{partner.name}</p>
                                           <p className="text-xs font-medium opacity-50 mb-4">{partner.email}</p>
                                           <div className="flex flex-wrap gap-2">
                                              {partner.pendingAccessCountries.map((c: string) => (
                                                <span key={c} className="px-2.5 py-1 bg-secondary text-foreground text-[9px] font-bold uppercase tracking-widest rounded-md border border-border">{c}</span>
                                              ))}
                                           </div>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-8 py-8 text-right">
                                     <button 
                                      onClick={() => handleApproveRegions(partner._id, partner.pendingAccessCountries)} 
                                      className="px-8 py-3.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.1em] rounded-md hover:opacity-90 transition-all"
                                     >
                                       Authorize Territories
                                     </button>
                                  </td>
                               </tr>
                            ))}
                            {/* Deals Requests Rendering */}
                            {reviewSubTab === 'deals' && moderationData.deals.length === 0 && (
                               <tr><td className="p-32 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">No deals in queue</td></tr>
                            )}
                            {reviewSubTab === 'deals' && moderationData.deals.map((d: any) => (
                               <tr key={d._id} className="group hover:bg-secondary/20 transition-colors">
                                  <td className="px-8 py-8">
                                    <div className="flex items-center gap-6">
                                     <div className="w-12 h-12 rounded bg-foreground text-background flex items-center justify-center font-bold text-xl">{d.title?.[0] || 'D'}</div>
                                     <div>
                                        <p className="text-lg font-bold tracking-tighter leading-none mb-2">{d.title}</p>
                                        <p className="text-xs font-medium opacity-50">Merchant: {d.merchantId?.name || 'Unknown'} • -{d.discountPercentage}% Discount</p>
                                     </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-8 text-right space-x-3">
                                     <button onClick={() => handleModerateDealV2(d._id, 'active')} className="px-8 py-3.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.1em] rounded-md hover:opacity-90 transition-all">Approve Deal</button>
                                     <button onClick={() => handleModerateDealV2(d._id, 'rejected')} className="px-8 py-3.5 bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-[0.1em] rounded-md hover:bg-red-600 hover:text-white transition-all">Reject</button>
                                  </td>
                               </tr>
                            ))}

                            {/* Funds rendering */}
                            {reviewSubTab === 'funds' && moderationData.commissions.length === 0 && (
                               <tr><td className="p-32 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">No fund audits pending</td></tr>
                            )}
                            {reviewSubTab === 'funds' && moderationData.commissions.map((c: any) => (
                               <tr key={c._id} className="group hover:bg-secondary/20 transition-colors">
                                  <td className="px-8 py-8">
                                    <div className="flex items-center gap-6">
                                     <div className="w-12 h-12 rounded bg-secondary border border-border text-emerald-500 flex items-center justify-center font-bold text-xl">$</div>
                                     <div>
                                        <p className="text-lg font-bold tracking-tighter leading-none mb-2">${(c.amount || 0).toFixed(2)} Vol.</p>
                                        <p className="text-xs font-medium opacity-50">Partner: {c.partnerId?.name || 'Unknown'} • Merchant: {c.merchantId?.name || 'Unknown'}</p>
                                     </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-8 text-right space-x-3">
                                     <button onClick={() => handleModerateCommission(c._id, 'paid')} className="px-8 py-3.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.1em] rounded-md hover:opacity-90 transition-all">Approve Payout</button>
                                     <button onClick={() => handleModerateCommission(c._id, 'rejected')} className="px-8 py-3.5 bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-[0.1em] rounded-md hover:bg-red-600 hover:text-white transition-all">Deny</button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
              </div>
            )}

            {/* Categories */}
            {activeTab === 'categories' && (
              <div className="space-y-8">
                {/* Create Category Form */}
                <div className="vercel-section">
                  <div className="vercel-section-header">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Initialize New Category</h2>
                  </div>
                  <div className="vercel-section-content">
                    <form onSubmit={handleCreateCategory} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground block mb-2">Name</label>
                        <input
                          value={newCat.name}
                          onChange={(e) => setNewCat({ ...newCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                          placeholder="e.g. Food & Dining"
                          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground block mb-2">Slug</label>
                        <input
                          value={newCat.slug}
                          onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                          placeholder="food-dining"
                          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground block mb-2">Description</label>
                        <input
                          value={newCat.description}
                          onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                          placeholder="Optional description"
                          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={actionLoading === 'new-cat'}
                        className="px-6 py-3 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.15em] rounded-md hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {actionLoading === 'new-cat' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        Create
                      </button>
                    </form>
                  </div>
                </div>

                {/* Category List */}
                <div className="vercel-section">
                  <div className="vercel-section-header flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Taxonomy Registry</h2>
                    <span className="text-[10px] font-bold text-muted-foreground opacity-50">{categories.length} categories</span>
                  </div>
                  <div className="vercel-section-content p-0 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-secondary/20 border-b border-border">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Name</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Slug</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Description</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {categories.map((cat: any) => (
                          <tr key={cat._id} className="group hover:bg-secondary/20 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center text-[10px] font-bold border border-border">{cat.name?.[0]}</div>
                                <p className="text-sm font-bold tracking-tight">{cat.name}</p>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <code className="text-xs bg-secondary/40 px-2 py-1 rounded font-mono">{cat.slug}</code>
                            </td>
                            <td className="px-8 py-5 text-xs opacity-60 max-w-[200px] truncate">{cat.description || '—'}</td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", cat.isActive ? "bg-emerald-500" : "bg-red-500")} />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{cat.isActive ? 'Active' : 'Disabled'}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleToggleCategory(cat._id, cat.isActive)}
                                  disabled={actionLoading === cat._id}
                                  className={cn(
                                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                                    cat.isActive
                                      ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white"
                                      : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                  )}
                                >
                                  {actionLoading === cat._id ? <Loader2 className="w-3 h-3 animate-spin" /> : cat.isActive ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                  onClick={() => { setSelectedItem(cat); setIsDeleteOpen(true); }}
                                  className="px-3 py-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {categories.length === 0 && !loading && (
                      <div className="p-32 text-center opacity-30">
                        <Filter className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No categories defined</p>
                        <p className="text-xs opacity-50 mt-2">Use the form above to initialize your taxonomy</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Admins */}
            {activeTab === 'admins' && (
              <div className="space-y-8">
                {/* Create Admin Form */}
                <div className="vercel-section">
                  <div className="vercel-section-header">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Provision New Administrator</h2>
                  </div>
                  <div className="vercel-section-content">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setActionLoading('new-admin');
                      try {
                        const res = await fetch('/api/admin/admins', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newAdmin),
                        });
                        const json = await res.json();
                        if (res.ok) {
                          setAdmins([json.user, ...admins]);
                          setNewAdmin({ name: '', email: '', password: '', role: 'admin', permissions: [] });
                          showNotification('Administrator provisioned successfully');
                        } else {
                          showNotification(json.error || 'Failed to create admin', 'error');
                        }
                      } catch (err: any) {
                        showNotification(err.message || 'Network error', 'error');
                      } finally {
                        setActionLoading(null);
                      }
                    }} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground block mb-2">Name</label>
                        <input
                          value={newAdmin.name}
                          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                          placeholder="Full name"
                          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground block mb-2">Email</label>
                        <input
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          placeholder="admin@offrion.com"
                          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground block mb-2">Password</label>
                        <input
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground block mb-2">Role</label>
                        <select
                          value={newAdmin.role}
                          onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                        >
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={actionLoading === 'new-admin'}
                        className="px-6 py-3 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.15em] rounded-md hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {actionLoading === 'new-admin' ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                        Provision
                      </button>
                    </form>
                  </div>
                </div>

                {/* Admins List */}
                <div className="vercel-section">
                  <div className="vercel-section-header flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Personnel Directory</h2>
                    <span className="text-[10px] font-bold text-muted-foreground opacity-50">{admins.length} administrators</span>
                  </div>
                  <div className="vercel-section-content p-0 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-secondary/20 border-b border-border">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Identity</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Email</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Role</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Permissions</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Joined</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {admins.map((admin: any) => (
                          <tr key={admin._id} className="group hover:bg-secondary/20 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded flex items-center justify-center text-sm font-bold border border-border",
                                  admin.role === 'super_admin' ? "bg-amber-500/20 text-amber-400" : "bg-secondary"
                                )}>
                                  {admin.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-bold tracking-tight">{admin.name}</p>
                                  <p className="text-id opacity-40">#{admin._id?.slice(-8).toUpperCase()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-xs opacity-60">{admin.email}</td>
                            <td className="px-8 py-5">
                              <span className={cn(
                                "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest",
                                admin.role === 'super_admin'
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                  : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              )}>
                                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                                {admin.role === 'super_admin' ? (
                                  <span className="text-[10px] opacity-40 font-bold">ALL</span>
                                ) : admin.permissions?.length > 0 ? admin.permissions.map((p: string) => (
                                  <span key={p} className="px-2 py-0.5 bg-secondary text-[9px] font-bold uppercase tracking-widest rounded border border-border">{p}</span>
                                )) : (
                                  <span className="text-[10px] opacity-30">No permissions</span>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", admin.isActive ? "bg-emerald-500" : "bg-red-500")} />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{admin.isActive ? 'Active' : 'Locked'}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-xs opacity-50">{new Date(admin.createdAt).toLocaleDateString()}</td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Toggle Active/Locked */}
                                <button
                                  onClick={async () => {
                                    setActionLoading(admin._id);
                                    try {
                                      const res = await fetch(`/api/admin/admins/${admin._id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ isActive: !admin.isActive }),
                                      });
                                      if (res.ok) {
                                        setAdmins(admins.map((a: any) => a._id === admin._id ? { ...a, isActive: !a.isActive } : a));
                                        showNotification(`Admin ${!admin.isActive ? 'activated' : 'deactivated'}`);
                                      } else {
                                        const json = await res.json();
                                        showNotification(json.error || 'Failed to update status', 'error');
                                      }
                                    } catch (err: any) { showNotification(err.message, 'error'); }
                                    finally { setActionLoading(null); }
                                  }}
                                  disabled={actionLoading === admin._id}
                                  className={cn(
                                    "px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all opacity-0 group-hover:opacity-100",
                                    admin.isActive
                                      ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white"
                                      : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                  )}
                                >
                                  {actionLoading === admin._id ? <Loader2 className="w-3 h-3 animate-spin" /> : admin.isActive ? 'Lock' : 'Unlock'}
                                </button>
                                {/* Edit Admin */}
                                <button
                                  onClick={() => { setEditingAdminId(admin._id); }}
                                  className="px-4 py-2 bg-primary text-primary-foreground border border-primary rounded-md text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                {/* Delete Admin */}
                                <button
                                  onClick={() => { setSelectedItem(admin); setIsDeleteOpen(true); }}
                                  className="px-3 py-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-md"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {admins.length === 0 && !loading && (
                      <div className="p-32 text-center opacity-30">
                        <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No administrators found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Financials */}
            {activeTab === 'financials' && (
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Gross Volume', value: `$${(financials?.summary?.grossVolume || 0).toFixed(2)}`, desc: 'Total commission value across all transactions' },
                    { name: 'Partner Payouts', value: `$${(financials?.summary?.partnerPayouts || 0).toFixed(2)}`, desc: '70% share distributed to partners' },
                    { name: 'Platform Profit', value: `$${(financials?.summary?.platformProfit || 0).toFixed(2)}`, desc: '30% platform revenue earned by Offrion' },
                  ].map((card) => (
                    <div key={card.name} className="vercel-section relative group hover:border-foreground/30 transition-all">
                      <div className="vercel-section-content">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-4">{card.name}</p>
                        <h3 className="text-4xl font-bold tracking-tighter mb-2">{card.value}</h3>
                        <p className="text-xs text-muted-foreground opacity-60">{card.desc}</p>
                      </div>
                      <div className="vercel-section-footer bg-secondary/10">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Live Ledger
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Commission History Table */}
                <div className="vercel-section">
                  <div className="vercel-section-header flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Commission Ledger</h2>
                    <span className="text-[10px] font-bold text-muted-foreground opacity-50">
                      {financials?.total || 0} total records • Page {financials?.page || 1} of {financials?.pages || 1}
                    </span>
                  </div>
                  <div className="vercel-section-content p-0 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-secondary/20 border-b border-border">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Partner</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Merchant</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Partner Cut</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Platform Cut</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {financials?.commissions?.map((c: any) => (
                          <tr key={c._id} className="group hover:bg-secondary/20 transition-colors">
                            <td className="px-8 py-5">
                              <p className="text-sm font-bold tracking-tight">{c.partnerId?.name || 'Unknown'}</p>
                              <p className="text-[10px] opacity-40">{c.partnerId?.email}</p>
                            </td>
                            <td className="px-8 py-5">
                              <p className="text-sm font-bold tracking-tight">{c.merchantId?.name || 'Unknown'}</p>
                              <p className="text-[10px] opacity-40">{c.merchantId?.email}</p>
                            </td>
                            <td className="px-8 py-5 text-sm font-bold">${(c.amount || 0).toFixed(2)}</td>
                            <td className="px-8 py-5 text-sm font-semibold text-purple-400">${(c.partnerShare || 0).toFixed(2)}</td>
                            <td className="px-8 py-5 text-sm font-semibold text-emerald-400">${(c.platformShare || 0).toFixed(2)}</td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "w-2 h-2 rounded-full",
                                  c.status === 'cleared' || c.status === 'paid' ? "bg-emerald-500" : c.status === 'pending' ? "bg-amber-500" : "bg-red-500"
                                )} />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{c.status}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-xs opacity-50">{new Date(c.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!financials?.commissions || financials.commissions.length === 0) && !loading && (
                      <div className="p-32 text-center opacity-30">
                        <Download className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No commission records yet</p>
                        <p className="text-xs opacity-50 mt-2">Records will appear here after deals are redeemed</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── SHARED OVERLAY: INSPECTOR PANEL ── */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in" onClick={() => setIsDetailOpen(false)} />
          <div className="bg-background w-full max-w-xl border-l border-border relative z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-border flex items-center justify-between bg-sidebar">
               <div>
                  <h2 className="text-2xl font-bold tracking-tighter">Identity Inspector</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">Audit Console</p>
               </div>
               <button onClick={() => setIsDetailOpen(false)} className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center transition-all">
                  <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
               {detailData ? (
                 <div className="space-y-8">
                    <section className="vercel-section">
                       <div className="vercel-section-header flex items-center justify-between">
                          <span className="font-black text-[10px] uppercase tracking-[0.2em]">Contextual Data</span>
                       </div>
                       <div className="vercel-section-content space-y-6">
                          <div>
                             <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 block">Canonical Reference</label>
                             <p className="text-2xl font-bold tracking-tighter leading-tight bg-secondary/50 p-4 border border-border rounded-md">{detailData.user?.name || detailData.deal?.title}</p>
                          </div>
                          <div>
                             <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 block">Electronic Identifier</label>
                             <p className="text-sm font-bold opacity-80">{detailData.user?.email || 'N/A'}</p>
                          </div>
                          <div className="pt-4 border-t border-border">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-1">Global ID</label>
                                   <p className="text-[10px] font-mono opacity-60 truncate">{(detailData.user?._id || detailData.deal?._id).toUpperCase()}</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </section>

                    {detailData.profile && (
                      <section className="vercel-section">
                        <div className="vercel-section-header">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Financial Controls</span>
                        </div>
                        <div className="vercel-section-content space-y-6">
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">Billing Scheme</label>
                              <div className="p-3 bg-secondary/50 border border-border rounded-md text-xs font-bold uppercase tracking-widest">
                                 {detailData.profile.billingPreference === 'card_on_file' ? 'Post-Paid (Card)' : 'Prepaid (Wallet)'}
                              </div>
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">Credit Limit for Post-Paid ($)</label>
                              <input 
                                type="number" min="0" 
                                value={editCreditLimit}
                                onChange={(e) => setEditCreditLimit(parseInt(e.target.value) || 0)}
                                className="w-full bg-background p-3 rounded-md border border-border text-xs font-bold focus:ring-1 focus:ring-foreground outline-none transition-all"
                              />
                           </div>
                        </div>
                      </section>
                    )}

                    {detailData.user && (
                      <section className="vercel-section">
                        <div className="vercel-section-header">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Regional Governance</span>
                        </div>
                        <div className="vercel-section-content space-y-8">
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">Operation Hub</label>
                              <select 
                                className="w-full bg-background p-3 rounded-md border border-border text-xs font-bold focus:ring-1 focus:ring-foreground outline-none transition-all"
                                value={editCountry}
                                onChange={(e) => setEditCountry(e.target.value)}
                              >
                                {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 block">Authorized Markets</label>
                              <div className="flex flex-wrap gap-2">
                                {COUNTRIES.map(c => (
                                  <button
                                    key={c.name}
                                    onClick={() => {
                                      setEditAccessCountries(prev => 
                                        prev.includes(c.name) ? prev.filter(cn => cn !== c.name) : [...prev, c.name]
                                      );
                                    }}
                                    className={cn(
                                      "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest border transition-all",
                                      editAccessCountries.includes(c.name) 
                                        ? "bg-foreground text-background border-foreground" 
                                        : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                                    )}
                                  >
                                    {c.name}
                                  </button>
                                ))}
                              </div>
                           </div>
                        </div>
                        <div className="vercel-section-footer bg-secondary/20">
                           <button 
                            onClick={handleUpdateUserLocations}
                            disabled={!!actionLoading}
                            className="w-full py-3 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                           >
                             {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile Configurations'}
                           </button>
                        </div>
                      </section>
                    )}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Compiling Data...</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* ── SHARED OVERLAY: ADMIN EDIT PANEL ── */}
      {editingAdminId && (() => {
        const editAdmin = admins.find((a: any) => a._id === editingAdminId);
        if (!editAdmin) return null;
        const AVAILABLE_PERMISSIONS = ['MANAGE_DEALS', 'MANAGE_CATEGORIES', 'MANAGE_MERCHANTS', 'MANAGE_PARTNERS', 'MANAGE_FINANCIALS', 'MANAGE_SUPPORT'];
        return (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in" onClick={() => setEditingAdminId(null)} />
            <div className="bg-background w-full max-w-xl border-l border-border relative z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300">
              <div className="p-8 border-b border-border flex items-center justify-between bg-sidebar">
                <div>
                  <h2 className="text-2xl font-bold tracking-tighter">Manage Admin</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">Role & Permission Control</p>
                </div>
                <button onClick={() => setEditingAdminId(null)} className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {/* Identity Card */}
                <section className="vercel-section">
                  <div className="vercel-section-header">
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Identity</span>
                  </div>
                  <div className="vercel-section-content">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold border border-border",
                        editAdmin.role === 'super_admin' ? "bg-amber-500/20 text-amber-400" : "bg-secondary"
                      )}>
                        {editAdmin.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xl font-bold tracking-tighter">{editAdmin.name}</p>
                        <p className="text-xs opacity-50">{editAdmin.email}</p>
                        <p className="text-[10px] font-mono opacity-30 mt-1">#{editAdmin._id?.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Role Assignment */}
                <section className="vercel-section">
                  <div className="vercel-section-header">
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Role Assignment</span>
                  </div>
                  <div className="vercel-section-content space-y-4">
                    <p className="text-xs opacity-50 leading-relaxed">Super Admins have unrestricted access. Admins require explicit permissions.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(['admin', 'super_admin'] as const).map(role => (
                        <button
                          key={role}
                          onClick={async () => {
                            setActionLoading(`role-${editAdmin._id}`);
                            try {
                              const res = await fetch(`/api/admin/admins/${editAdmin._id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ role }),
                              });
                              const json = await res.json();
                              if (res.ok) {
                                setAdmins(admins.map((a: any) => a._id === editAdmin._id ? { ...a, role } : a));
                                showNotification(`Role updated to ${role === 'super_admin' ? 'Super Admin' : 'Admin'}`);
                              } else {
                                showNotification(json.error || 'Failed to update role', 'error');
                              }
                            } catch (err: any) { showNotification(err.message, 'error'); }
                            finally { setActionLoading(null); }
                          }}
                          disabled={actionLoading === `role-${editAdmin._id}`}
                          className={cn(
                            "p-5 rounded-lg border-2 transition-all text-center",
                            editAdmin.role === role
                              ? role === 'super_admin'
                                ? "border-amber-500 bg-amber-500/10"
                                : "border-blue-500 bg-blue-500/10"
                              : "border-border hover:border-foreground/30 bg-secondary/20"
                          )}
                        >
                          <ShieldCheck className={cn(
                            "w-6 h-6 mx-auto mb-2",
                            editAdmin.role === role
                              ? role === 'super_admin' ? "text-amber-400" : "text-blue-400"
                              : "opacity-30"
                          )} />
                          <p className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            editAdmin.role === role ? "opacity-100" : "opacity-50"
                          )}>
                            {role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </p>
                          <p className="text-[9px] opacity-40 mt-1">
                            {role === 'super_admin' ? 'Full unrestricted access' : 'Permission-based access'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Granular Permissions */}
                {editAdmin.role === 'admin' && (
                  <section className="vercel-section">
                    <div className="vercel-section-header">
                      <span className="font-black text-[10px] uppercase tracking-[0.2em]">Granular Permissions</span>
                    </div>
                    <div className="vercel-section-content space-y-3">
                      <p className="text-xs opacity-50 leading-relaxed mb-4">Toggle which modules this administrator can access and manage.</p>
                      {AVAILABLE_PERMISSIONS.map(perm => {
                        const hasPermission = editAdmin.permissions?.includes(perm);
                        return (
                          <button
                            key={perm}
                            onClick={async () => {
                              const newPermissions = hasPermission
                                ? editAdmin.permissions.filter((p: string) => p !== perm)
                                : [...(editAdmin.permissions || []), perm];
                              setActionLoading(`perm-${perm}`);
                              try {
                                const res = await fetch(`/api/admin/admins/${editAdmin._id}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ permissions: newPermissions }),
                                });
                                if (res.ok) {
                                  setAdmins(admins.map((a: any) => a._id === editAdmin._id ? { ...a, permissions: newPermissions } : a));
                                  showNotification(`${perm} ${hasPermission ? 'revoked' : 'granted'}`);
                                } else {
                                  const json = await res.json();
                                  showNotification(json.error || 'Failed to update permissions', 'error');
                                }
                              } catch (err: any) { showNotification(err.message, 'error'); }
                              finally { setActionLoading(null); }
                            }}
                            disabled={actionLoading === `perm-${perm}`}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-lg border transition-all",
                              hasPermission
                                ? "border-emerald-500/30 bg-emerald-500/5"
                                : "border-border bg-secondary/10 hover:border-foreground/20"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded flex items-center justify-center text-xs transition-all",
                                hasPermission ? "bg-emerald-500/20 text-emerald-400" : "bg-secondary/50 opacity-40"
                              )}>
                                {actionLoading === `perm-${perm}` ? <Loader2 className="w-3 h-3 animate-spin" /> : hasPermission ? <Check className="w-4 h-4" /> : <X className="w-3 h-3" />}
                              </div>
                              <span className="text-xs font-bold tracking-tight">{perm.replace(/_/g, ' ')}</span>
                            </div>
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded",
                              hasPermission ? "text-emerald-400 bg-emerald-500/10" : "text-muted-foreground opacity-40"
                            )}>
                              {hasPermission ? 'Granted' : 'Revoked'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Danger Zone */}
                <section className="vercel-section border-red-500/20">
                  <div className="vercel-section-header">
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] text-red-500">Danger Zone</span>
                  </div>
                  <div className="vercel-section-content space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="text-sm font-bold">
                          {editAdmin.isActive ? 'Deactivate Account' : 'Reactivate Account'}
                        </p>
                        <p className="text-xs opacity-40 mt-0.5">
                          {editAdmin.isActive ? 'Lock this admin out of the system' : 'Restore access to this admin'}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          setActionLoading(`toggle-${editAdmin._id}`);
                          try {
                            const res = await fetch(`/api/admin/admins/${editAdmin._id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ isActive: !editAdmin.isActive }),
                            });
                            if (res.ok) {
                              setAdmins(admins.map((a: any) => a._id === editAdmin._id ? { ...a, isActive: !a.isActive } : a));
                              showNotification(`Admin ${!editAdmin.isActive ? 'activated' : 'deactivated'}`);
                            } else {
                              const json = await res.json();
                              showNotification(json.error || 'Error', 'error');
                            }
                          } catch (err: any) { showNotification(err.message, 'error'); }
                          finally { setActionLoading(null); }
                        }}
                        disabled={!!actionLoading}
                        className={cn(
                          "px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                          editAdmin.isActive
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-white"
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white"
                        )}
                      >
                        {actionLoading === `toggle-${editAdmin._id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : editAdmin.isActive ? 'Lock' : 'Unlock'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                      <div>
                        <p className="text-sm font-bold text-red-400">Delete Account</p>
                        <p className="text-xs opacity-40 mt-0.5">Permanently remove this admin from the system</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedItem(editAdmin);
                          setIsDeleteOpen(true);
                        }}
                        className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-red-600/10 text-red-500 border border-red-500/30 rounded-md hover:bg-red-600 hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        );
      })()}
      {/* ── SHARED OVERLAY: DELETE CONFIRMATION ── */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-background/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-background w-full max-w-md border border-border rounded-md shadow-none relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-10 text-center space-y-6">
                 <div className="w-16 h-16 bg-red-600/10 text-red-600 rounded-full flex items-center justify-center mx-auto">
                    <Ban className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold tracking-tighter mb-2">Critical Deletion</h3>
                    <p className="text-sm text-balance leading-relaxed opacity-70">
                       You are about to permanently purge <strong className="text-foreground">{selectedItem?.name || selectedItem?.title}</strong> from the primary source.
                    </p>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-secondary rounded-md hover:bg-muted transition-all">Abort</button>
                    <button 
                      onClick={handleDelete}
                      disabled={!!actionLoading}
                      className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-red-600 text-white rounded-md hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                       {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
