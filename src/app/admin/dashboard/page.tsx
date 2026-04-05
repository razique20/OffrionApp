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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'merchants' | 'partners' | 'deals' | 'categories' | 'admins';

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
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

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
    else if (activeTab !== 'overview') fetchData(activeTab);
  }, [activeTab]);

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
  const handleModerateDeal = async (dealId: string, approve: boolean) => {
    setActionLoading(dealId);
    try {
      const res = await fetch(`/api/admin/deals/${dealId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: approve }),
      });
      if (res.ok) {
        setData(data.map(d => d._id === dealId ? { ...d, isActive: approve } : d));
        showNotification(`Deal ${approve ? 'approved' : 'rejected'} successfully`);
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

  const handleViewDetail = async (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
    setDetailData(null);
    try {
      // Use Admin API for both users and deals to avoid API Key requirements
      const endpoint = activeTab === 'deals' ? `/api/admin/deals/${item._id}` : `/api/admin/users/${item._id}`;
      const res = await fetch(endpoint);
      const json = await res.json();
      if (res.ok) setDetailData(json);
      else console.error('Fetch error:', json.error);
    } catch (err) {
      console.error(err);
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
      else endpoint = `/api/admin/users/${selectedItem._id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      const json = await res.json();

      if (res.ok) {
        if (activeTab === 'categories') setCategories(categories.filter(c => c._id !== selectedItem._id));
        else setData(data.filter(i => i._id !== selectedItem._id));
        
        showNotification(`${activeTab === 'categories' ? 'Category' : 'Item'} removed permanently`);
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
    { name: 'Revenue', value: `$${stats?.revenue?.toLocaleString() || '0'}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Active Deals', value: stats?.deals || '0', icon: Layers, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Detail Modal */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
          <div className="bg-card w-full max-w-2xl border border-border rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-border flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                   <div className="w-10 h-10 bg-premium-gradient rounded-xl flex items-center justify-center">
                      {activeTab === 'deals' ? <Layers className="text-white w-5 h-5" /> : <Users className="text-white w-5 h-5" />}
                   </div>
                   {activeTab === 'deals' ? 'Deal Verification' : 'User Insight'}
                </h2>
                <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-all"><X className="w-6 h-6" /></button>
             </div>
             
             <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                {!detailData ? (
                  <div className="flex flex-col items-center py-20 gap-4">
                     <Loader2 className="w-8 h-8 text-primary animate-spin" />
                     <p className="text-xs text-muted-foreground font-medium">Retrieving Context...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Public Identity</label>
                           <p className="text-lg font-bold">{activeTab === 'deals' ? detailData.deal?.title : detailData.user?.name}</p>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Registry Contact</label>
                           <p className="text-sm font-medium">{activeTab === 'deals' ? (detailData.deal?.merchantId?.name || 'Unknown') : detailData.user?.email}</p>
                        </div>
                     </div>

                    {activeTab === 'merchants' && detailData.profile && (
                      <div className="p-6 bg-secondary/30 rounded-[32px] border border-border space-y-4">
                         <h4 className="text-xs font-bold text-gradient uppercase tracking-widest flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> Merchant Protocol
                         </h4>
                         <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs">
                            <div><span className="text-muted-foreground">Business:</span> <p className="font-bold">{detailData.profile.businessName}</p></div>
                            <div><span className="text-muted-foreground">Phone:</span> <p className="font-bold">{detailData.profile.contactPhone}</p></div>
                            <div className="col-span-2"><span className="text-muted-foreground">Address:</span> <p className="font-bold">{detailData.profile.address}</p></div>
                            <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <p className="leading-relaxed opacity-80">{detailData.profile.description}</p></div>
                         </div>
                      </div>
                    )}

                    {activeTab === 'deals' && detailData.deal && (
                       <div className="space-y-4">
                          <p className="text-sm leading-relaxed text-muted-foreground">{detailData.deal.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                             <div><span className="text-[10px] text-muted-foreground">Original:</span> <p className="font-bold font-mono">${detailData.deal.originalPrice}</p></div>
                             <div><span className="text-[10px] text-muted-foreground">Discount:</span> <p className="font-bold text-emerald-500">{detailData.deal.discountPercentage}% Off</p></div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                             {detailData.deal.tags?.map((t: string) => (
                               <span key={t} className="px-2 py-1 bg-secondary rounded-lg text-[10px] font-mono">#{t}</span>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
              )}
           </div>

             <div className="p-6 border-t border-border bg-secondary/30 flex justify-end gap-3">
                <button onClick={() => setIsDetailOpen(false)} className="px-6 py-2.5 text-xs font-bold bg-secondary rounded-xl hover:bg-secondary/80 transition-all text-muted-foreground">Dismiss</button>
                <button 
                  onClick={() => setIsDetailOpen(false)} 
                  className="px-6 py-2.5 text-xs font-bold bg-premium-gradient text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Confirm Review
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
           <div className="bg-card w-full max-w-sm border border-border rounded-[40px] shadow-2xl relative z-10 overflow-hidden p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
                 <Ban className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Danger Zone</h3>
                <p className="text-xs text-muted-foreground leading-relaxed px-4">
                  Permanently remove <strong>{activeTab === 'deals' ? selectedItem?.title : selectedItem?.name}</strong>? This action cannot be reversed.
                </p>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-3 text-xs font-bold bg-secondary rounded-xl hover:bg-secondary/80 transition-all">Cancel</button>
                 <button 
                  disabled={!!actionLoading}
                  onClick={handleDelete} 
                  className="flex-1 py-3 text-xs font-bold bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                   {actionLoading === selectedItem?._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Delete Permanently'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Governance</h1>
          <p className="text-muted-foreground text-sm">Overview and management of the Offrion ecosystem.</p>
        </div>
        
        <div className="flex bg-secondary/50 p-1 rounded-2xl border border-border overflow-x-auto no-scrollbar">
          {(['overview', 'merchants', 'partners', 'deals', 'categories', 'admins'] as TabType[])
            .filter(tab => tab !== 'admins' || me?.role === 'super_admin')
            .map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat) => (
              <div key={stat.name} className="p-6 bg-card border border-border rounded-[32px] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                  <stat.icon className="w-16 h-16" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className={cn("p-3 rounded-2xl", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.name}</p>
                    <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 bg-card border border-border rounded-[40px] flex flex-col items-center justify-center text-center py-20">
               <div className="w-16 h-16 bg-premium-gradient/10 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-emerald-500" />
               </div>
               <h3 className="text-xl font-bold mb-2 text-gradient">Revenue Trending</h3>
               <p className="text-sm text-muted-foreground mb-8 max-w-xs">Detailed revenue charts will appear here as transaction data accumulates.</p>
               <button className="px-6 py-2 bg-secondary text-xs font-bold rounded-xl hover:bg-secondary/80 transition-all">View Full Report</button>
            </div>
            
            <div className="p-8 bg-card border border-border rounded-[40px] space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                   Security Alerts
                </h3>
                <div className="space-y-4">
                   {[
                     { msg: "New Merchant Application: 'Urban Eats'", time: "2h ago" },
                     { msg: "Deals Priority Audit Completed", time: "5h ago" },
                     { msg: "High Traffic Alert: Partner 'Travelo'", time: "Yesterday" }
                   ].map((alert, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/50 text-xs text-muted-foreground">
                        <span>{alert.msg}</span>
                        <span className="font-mono opacity-50">{alert.time}</span>
                     </div>
                   ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Data Table for Merchants / Partners / Deals */}
      {activeTab !== 'overview' && activeTab !== 'categories' && (
        <div className="p-8 bg-card border border-border rounded-[40px] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-bold capitalize">{activeTab} Management</h3>
             <div className="flex gap-2">
                <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                   <input 
                     type="text" 
                     placeholder="Search..."
                     className="pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-xs w-64 focus:ring-2 focus:ring-primary/20 transition-all"
                   />
                </div>
                <button className="p-2 bg-secondary rounded-xl border border-border"><Filter className="w-4 h-4" /></button>
             </div>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground font-medium">Fetching {activeTab} Records...</p>
             </div>
          ) : data.length === 0 ? (
             <div className="text-center py-20 text-muted-foreground italic text-sm">
                No records found for {activeTab}.
             </div>
          ) : (
            <div className="min-h-[450px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    <th className="px-4 py-4">{activeTab === 'deals' ? 'Deal Title' : 'Member Name'}</th>
                    <th className="px-4 py-4">{activeTab === 'deals' ? 'Merchant' : 'Email Address'}</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.map((item) => (
                    <tr key={item._id} className="border-b border-border/50 group hover:bg-secondary/10 transition-colors relative hover:z-40">
                      <td className="px-4 py-5 font-bold text-xs">
                        {activeTab === 'deals' ? item.title : item.name}
                      </td>
                      <td className="px-4 py-5 text-xs text-muted-foreground">
                        {activeTab === 'deals' ? (item.merchantId?.name || 'N/A') : item.email}
                      </td>
                      <td className="px-4 py-5">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider",
                          item.isActive 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                        )}>
                          {item.isActive ? (activeTab === 'deals' ? 'Active' : 'Verified') : (activeTab === 'deals' ? 'Rejected' : 'Deactivated')}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 pr-2">
                           <button 
                            disabled={actionLoading === item._id}
                            onClick={() => activeTab === 'deals' ? handleModerateDeal(item._id, !item.isActive) : handleToggleUser(item._id, item.isActive)}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              item.isActive ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            )}>
                              {actionLoading === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : item.isActive ? <Ban className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                           </button>
                           
                           {/* User Actions Menu */}
                           <div className="relative inline-block">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item._id ? null : item._id); }}
                                className={cn(
                                  "p-2 rounded-lg transition-all",
                                  openMenuId === item._id ? "bg-primary/10 text-primary" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                              >
                                 <MoreVertical className="w-4 h-4" />
                              </button>
                              
                              {openMenuId === item._id && (
                                <>
                                  <div className="fixed inset-0 z-[90]" onClick={() => setOpenMenuId(null)} />
                                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
                                     <button 
                                      onClick={(e) => { e.stopPropagation(); handleViewDetail(item); setOpenMenuId(null); }}
                                      className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary flex items-center gap-3 transition-colors text-muted-foreground hover:text-foreground">
                                        <Search className="w-4 h-4 text-emerald-500" /> View Detailed Registry
                                     </button>
                                     {activeTab === 'deals' && (
                                       <button 
                                        onClick={(e) => { e.stopPropagation(); handleViewDetail(item); setOpenMenuId(null); }}
                                        className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary flex items-center gap-3 transition-colors text-muted-foreground hover:text-foreground">
                                          <ExternalLink className="w-4 h-4 text-blue-500" /> Preview Deal Page
                                       </button>
                                     )}
                                     <div className="border-t border-border" />
                                     <button 
                                      onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsDeleteOpen(true); setOpenMenuId(null); }}
                                      className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 flex items-center gap-3 transition-colors text-red-500">
                                        <Ban className="w-4 h-4" /> Permanent Removal
                                     </button>
                                  </div>
                                </>
                              )}
                           </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Categories Tab (Merged earlier logic with new styling) */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="lg:col-span-2 p-8 bg-card border border-border rounded-[40px] shadow-sm">
              <h3 className="text-xl font-bold mb-8">Category Taxonomy</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Slug</th>
                      <th className="px-4 py-4">Visibility</th>
                      <th className="px-4 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="border-b border-border/50 group hover:bg-secondary/10 transition-colors relative hover:z-40">
                        <td className="px-4 py-5 font-bold text-xs">{cat.name}</td>
                        <td className="px-4 py-5 font-mono text-[10px] text-muted-foreground">{cat.slug}</td>
                        <td className="px-4 py-5">
                           <span className={cn(
                             "px-2 py-0.5 text-[9px] font-bold rounded-md uppercase shadow-sm",
                             cat.isActive ? "bg-premium-gradient text-white" : "bg-red-500/10 text-red-500 border border-red-500/20"
                           )}>
                             {cat.isActive ? 'Public' : 'Hidden'}
                           </span>
                        </td>
                        <td className="px-4 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 pr-2">
                             <button 
                              disabled={actionLoading === cat._id}
                              onClick={() => handleToggleCategory(cat._id, cat.isActive)}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                cat.isActive ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                              )}>
                                {actionLoading === cat._id ? <Loader2 className="w-4 h-4 animate-spin" /> : cat.isActive ? <Ban className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                             </button>
                             
                             <div className="relative inline-block">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === cat._id ? null : cat._id); }}
                                  className={cn(
                                    "p-2 rounded-lg transition-all",
                                    openMenuId === cat._id ? "bg-primary/10 text-primary" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                                  )}
                                >
                                   <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {openMenuId === cat._id && (
                                  <>
                                    <div className="fixed inset-0 z-[90]" onClick={() => setOpenMenuId(null)} />
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
                                       <div className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">Category Actions</div>
                                       <button 
                                        onClick={(e) => { e.stopPropagation(); setSelectedItem(cat); setIsDeleteOpen(true); setOpenMenuId(null); }}
                                        className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 flex items-center gap-3 transition-colors text-red-500">
                                          <Ban className="w-4 h-4" /> Permanent Removal
                                       </button>
                                    </div>
                                  </>
                                )}
                             </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>

           <div className="p-8 bg-card border border-border rounded-[40px] h-fit sticky top-8 shadow-xl">
             <div className="w-12 h-12 bg-premium-gradient rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <Plus className="w-6 h-6 text-white" />
             </div>
             <h3 className="text-xl font-bold mb-2">New Context</h3>
             <p className="text-xs text-muted-foreground mb-8">Add a global category for merchants to group their deals.</p>
             
             <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] ml-1 font-bold uppercase tracking-widest text-muted-foreground">Display Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:bg-secondary transition-all"
                    placeholder="e.g. Health & Fitness"
                    value={newCat.name}
                    onChange={(e) => setNewCat({...newCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] ml-1 font-bold uppercase tracking-widest text-muted-foreground">URL Slug</label>
                  <input 
                    type="text" 
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-mono text-xs"
                    value={newCat.slug}
                    readOnly
                  />
                </div>
                <button 
                  disabled={actionLoading === 'new-cat'}
                  className="w-full py-4 bg-premium-gradient text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2">
                   {actionLoading === 'new-cat' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Initialize Category'}
                </button>
             </form>
           </div>
        </div>
      )}
      {/* Admins Tab (Super Admin Only) */}
      {activeTab === 'admins' && me?.role === 'super_admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="lg:col-span-2 p-8 bg-card border border-border rounded-[40px] shadow-sm">
              <h3 className="text-xl font-bold mb-8">Administrative Registry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      <th className="px-4 py-4">Identity</th>
                      <th className="px-4 py-4">Role</th>
                      <th className="px-4 py-4">Permissions</th>
                      <th className="px-4 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {admins.map((adm) => (
                      <tr key={adm._id} className="border-b border-border/50 group hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-5 font-bold text-xs">
                           {adm.name}
                           <div className="text-[10px] font-normal text-muted-foreground">{adm.email}</div>
                        </td>
                        <td className="px-4 py-5">
                           <span className={cn(
                             "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                             adm.role === 'super_admin' ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                           )}>
                             {adm.role}
                           </span>
                        </td>
                        <td className="px-4 py-5">
                           <div className="flex flex-wrap gap-1">
                              {adm.permissions?.length > 0 ? adm.permissions.map((p: string) => (
                                <span key={p} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[8px] font-bold border border-blue-500/20">{p}</span>
                              )) : <span className="text-[9px] italic opacity-50">Standard Restricted</span>}
                           </div>
                        </td>
                        <td className="px-4 py-5 text-right flex items-center justify-end gap-2">
                           {adm._id !== me._id && (
                             <>
                               <button 
                                 onClick={() => { 
                                   setEditingAdminId(adm._id);
                                   setNewAdmin({ name: adm.name, email: adm.email, password: '', role: adm.role, permissions: adm.permissions || [] });
                                 }}
                                 className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-all">
                                  <Edit2 className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => { setSelectedItem(adm); setIsDeleteOpen(true); }}
                                 className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                                  <Ban className="w-4 h-4" />
                               </button>
                             </>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>

           <div className="p-8 bg-card border border-border rounded-[40px] shadow-xl space-y-6">
              <div className="w-12 h-12 bg-premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                 <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">{editingAdminId ? 'Modify Principal' : 'New Security Principal'}</h3>
              <p className="text-xs text-muted-foreground">{editingAdminId ? "Update access levels or identify for this administrative account." : "Provision a new administrative account with specific bypass capabilities."}</p>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                setActionLoading('new-adm');
                
                const method = editingAdminId ? 'PATCH' : 'POST';
                const endpoint = editingAdminId ? `/api/admin/users/${editingAdminId}` : '/api/admin/admins';
                
                const res = await fetch(endpoint, {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(editingAdminId ? { name: newAdmin.name, role: newAdmin.role, permissions: newAdmin.permissions } : newAdmin),
                });
                
                if (res.ok) {
                   const json = await res.json();
                   if (editingAdminId) {
                      setAdmins(admins.map(a => a._id === editingAdminId ? json.user : a));
                      setEditingAdminId(null);
                      showNotification('Principal access levels updated');
                   } else {
                      setAdmins([json.user, ...admins]);
                      showNotification('New security principal initialized');
                   }
                   setNewAdmin({ name: '', email: '', password: '', role: 'admin', permissions: [] });
                } else {
                   const json = await res.json();
                   showNotification(json.error || 'Failed to update principal', 'error');
                }
                setActionLoading(null);
              }} className="space-y-4">
                 <input type="text" placeholder="Full Name" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-xs" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} required />
                 {!editingAdminId && <input type="email" placeholder="Email Address" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-xs" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} required />}
                 {!editingAdminId && <input type="password" placeholder="Secure Password" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-xs" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required />}
                 
                 {editingAdminId && (
                   <button 
                    type="button"
                    onClick={() => { setEditingAdminId(null); setNewAdmin({ name: '', email: '', password: '', role: 'admin', permissions: [] }); }}
                    className="text-[10px] text-blue-500 font-bold hover:underline">
                      Cancel Editing & Create New Instead
                   </button>
                 )}
                 
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Permissions Matrix</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['MANAGE_DEALS', 'MANAGE_USERS', 'MANAGE_CATEGORIES', 'VIEW_REVENUE'].map(perm => (
                         <button
                           key={perm}
                           type="button"
                           onClick={() => {
                             const perms = newAdmin.permissions.includes(perm) 
                               ? newAdmin.permissions.filter(p => p !== perm)
                               : [...newAdmin.permissions, perm];
                             setNewAdmin({...newAdmin, permissions: perms});
                           }}
                           className={cn(
                             "px-3 py-2 rounded-lg text-[8px] font-bold border transition-all text-left",
                             newAdmin.permissions.includes(perm) ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" : "bg-secondary/50 border-border text-muted-foreground"
                           )}
                         >
                            {perm.replace('_', ' ')}
                         </button>
                       ))}
                    </div>
                 </div>

                 <button 
                  disabled={actionLoading === 'new-adm'}
                  className="w-full py-4 bg-premium-gradient text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    {actionLoading === 'new-adm' ? <Loader2 className="w-4 h-4 animate-spin" /> : editingAdminId ? 'Update Admin Access' : 'Initialize Admin Account'}
                 </button>
              </form>
           </div>
         </div>
       )}

       {/* Toast Notification */}
       {notification && (
         <div className={cn(
           "fixed bottom-8 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-[24px] border shadow-2xl animate-in slide-in-from-right-10 duration-300",
           notification.type === 'success' 
            ? "bg-emerald-500 text-white border-emerald-400" 
            : "bg-red-500 text-white border-red-400"
         )}>
           {notification.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
           <span className="text-xs font-bold tracking-wide">{notification.message}</span>
           <button onClick={() => setNotification(null)} className="ml-4 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
         </div>
       )}
    </div>
  );
}
