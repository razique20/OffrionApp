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
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsForm() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
               <User className="w-4 h-4" /> Personal Info
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-xl">
               <Shield className="w-4 h-4" /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-xl">
               <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-xl">
               <Globe className="w-4 h-4" /> Billing
            </button>
          </nav>
        </aside>

        <main className="md:col-span-3 space-y-8">
          <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border">
               <h3 className="text-xl font-bold">Profile Details</h3>
               <p className="text-sm text-muted-foreground">General information about your account.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Changes saved successfully!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
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
                        type="email" 
                        required
                        className="w-full bg-secondary/50 border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                 <button 
                  type="submit" 
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                 >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                 </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 bg-secondary/30 border border-border rounded-2xl">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Membership Role</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                      {user.role?.[0]?.toUpperCase()}
                   </div>
                   <span className="font-bold capitalize">{user.role}</span>
                </div>
             </div>
             <div className="p-6 bg-secondary/30 border border-border rounded-2xl">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Member Since</p>
                <p className="font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}
