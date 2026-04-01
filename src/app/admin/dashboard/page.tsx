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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetch('/api/categories')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch categories');
        return json;
      })
      .then(json => {
        if (Array.isArray(json)) {
          setCategories(json);
        } else {
          console.error('Expected array, got:', json);
          setCategories([]);
        }
      })
      .catch(err => {
        console.error('Categories fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    });
    if (res.ok) {
      const json = await res.json();
      setCategories([...categories, json.category]);
      setNewCat({ name: '', slug: '', description: '' });
    }
  };

  const stats = [
    { name: 'Total Merchants', value: '1,280', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    { name: 'Total Partners', value: '450', icon: Users, color: 'text-purple-600', bg: 'bg-purple-600/10' },
    { name: 'Platform Revenue', value: '$124,500', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
    { name: 'Active Deals', value: '5,600', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-600/10' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Loading system data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-[32px] text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Platform Error</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-card border border-border rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Category Distribution</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-secondary rounded-lg"><Search className="w-4 h-4" /></button>
                <button className="p-2 bg-secondary rounded-lg"><Filter className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3">Category Name</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="border-b border-border group hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-4 font-medium">{cat.name}</td>
                      <td className="px-4 py-4 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded uppercase">Active</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="p-2 hover:bg-secondary rounded-lg"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Create Category Form */}
        <div className="p-8 bg-card border border-border rounded-2xl h-fit sticky top-8">
          <h3 className="text-lg font-bold mb-6">Create New Category</h3>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm"
                placeholder="e.g. Food & Drinks"
                value={newCat.name}
                onChange={(e) => setNewCat({...newCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug</label>
              <input 
                type="text" 
                required
                className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm font-mono"
                placeholder="food-drinks"
                value={newCat.slug}
                onChange={(e) => setNewCat({...newCat, slug: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
              <textarea 
                rows={3}
                className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm"
                placeholder="Category description..."
                value={newCat.description}
                onChange={(e) => setNewCat({...newCat, description: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
