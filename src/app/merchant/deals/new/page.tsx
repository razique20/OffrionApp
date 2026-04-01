'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Percent,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewDealPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    originalPrice: '',
    discountedPrice: '',
    commissionPercentage: '10',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    usageLimit: '0',
    lat: '',
    lng: '',
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/merchant/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Token would be injected by a client-side wrapper or handled via cookies
        },
        body: JSON.stringify({
          ...formData,
          originalPrice: Number(formData.originalPrice),
          discountedPrice: Number(formData.discountedPrice),
          commissionPercentage: Number(formData.commissionPercentage),
          usageLimit: Number(formData.usageLimit),
          location: {
            type: 'Point',
            coordinates: [Number(formData.lng), Number(formData.lat)],
          }
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/merchant/deals'), 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold">Deal Created Successfully!</h2>
        <p className="text-muted-foreground mt-2">Redirecting to your deals list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deals
      </button>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-8 border-b border-border">
          <h2 className="text-xl font-bold">Create New Deal</h2>
          <p className="text-sm text-muted-foreground">Fill in the details to publish your deal.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Basic Information</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Deal Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 50% Off Gourmet Burger"
                  className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Describe the deal and any terms..."
                  className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  required
                  className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing & Logistics */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pricing & Logistics</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Original Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="number" 
                      required
                      className="w-full bg-secondary border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discounted Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="number" 
                      required
                      className="w-full bg-secondary border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Commission Percentage</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="number" 
                    className="w-full bg-secondary border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.commissionPercentage}
                    onChange={(e) => setFormData({...formData, commissionPercentage: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Latitude</label>
                  <input 
                    type="number" step="any"
                    required
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.lat}
                    onChange={(e) => setFormData({...formData, lat: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Longitude</label>
                  <input 
                    type="number" step="any"
                    required
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.lng}
                    onChange={(e) => setFormData({...formData, lng: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valid From</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valid Until</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Deal...' : 'Publish Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
