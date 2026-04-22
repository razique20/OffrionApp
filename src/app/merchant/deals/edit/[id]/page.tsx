'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Percent,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CloudinaryUpload } from '@/components/CloudinaryUpload';
import { UAE_EMIRATES } from '@/constants/locations';

export default function EditDealPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    originalPrice: '',
    discountedPrice: '',
    commissionPercentage: '10',
    validFrom: '',
    validUntil: '',
    usageLimit: '0',
    lat: '',
    lng: '',
    emirate: '',
    landmark: '',
    images: [] as string[],
    eventType: 'general',
    dealType: 'percentage',
    targetAudience: ['all'] as string[],
  });

  useEffect(() => {
    // 1. Fetch Categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));

    // 2. Fetch Deal Data
    fetch(`/api/merchant/deals/${id}`, { credentials: 'include' })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch deal');
        return json;
      })
      .then(deal => {
        setFormData({
          title: deal.title,
          description: deal.description,
          categoryId: deal.categoryId,
          originalPrice: deal.originalPrice.toString(),
          discountedPrice: deal.discountedPrice.toString(),
          commissionPercentage: deal.commissionPercentage.toString(),
          validFrom: new Date(deal.validFrom).toISOString().split('T')[0],
          validUntil: new Date(deal.validUntil).toISOString().split('T')[0],
          usageLimit: deal.usageLimit.toString(),
          lat: deal.location.coordinates[1].toString(),
          lng: deal.location.coordinates[0].toString(),
          emirate: deal.emirate || '',
          landmark: deal.landmark || '',
          images: deal.images || [],
          eventType: deal.eventType || 'general',
          dealType: deal.dealType || 'percentage',
          targetAudience: deal.targetAudience || ['all'],
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/merchant/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Update failed');
      }

      setSuccess(true);
      setTimeout(() => router.push('/merchant/deals'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString()
        }));
      },
      () => {
        alert('Unable to retrieve your location. Please enter coordinates manually.');
      }
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-foreground mb-4" />
      <p className="text-muted-foreground">Loading deal data...</p>
    </div>
  );

  if (error && !formData.title) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-2xl font-bold">Error Loading Deal</h2>
      <p className="text-muted-foreground mt-2">{error}</p>
      <button onClick={() => router.back()} className="mt-6 text-foreground font-bold hover:underline">Back to Deals</button>
    </div>
  );

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-secondary text-foreground rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold">Deal Updated Successfully!</h2>
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

      <div className="bg-card border border-border rounded-md overflow-hidden">
        <div className="p-8 border-b border-border">
          <h2 className="text-xl font-bold">Edit Deal</h2>
          <p className="text-sm text-muted-foreground">Modify the details of your published deal.</p>
        </div>

        {error && (
          <div className="mx-8 mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-3 text-destructive text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Basic Information</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Deal Title</label>
                <input 
                  type="text" required
                  className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  required rows={4}
                  className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  required
                  className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Type</label>
                  <select 
                    required
                    className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary font-medium"
                    value={formData.eventType}
                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="holiday">Holiday</option>
                    <option value="flash">Flash Deal</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="clearance">Clearance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deal Type</label>
                  <select 
                    required
                    className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary font-medium"
                    value={formData.dealType}
                    onChange={(e) => setFormData({...formData, dealType: e.target.value})}
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="flat">Flat Amount Off</option>
                    <option value="bogo">BOGO (Buy One Get One)</option>
                    <option value="free-item">Free Item with Purchase</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-secondary/50 rounded-md border border-border/30">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Audience</label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'student', 'senior', 'member'].map(audience => (
                    <label key={audience} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={formData.targetAudience.includes(audience)}
                        onChange={(e) => {
                          const updated = e.target.checked 
                            ? [...formData.targetAudience, audience]
                            : formData.targetAudience.filter(a => a !== audience);
                          setFormData({...formData, targetAudience: updated});
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-background"
                      />
                      <span className="text-xs capitalize font-medium group-hover:text-foreground transition-colors">
                        {audience}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pricing & Logistics</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Original Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="number" required
                      className="w-full bg-secondary border-none rounded-md pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary"
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
                      type="number" required
                      className="w-full bg-secondary border-none rounded-md pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Commission Percentage (Min 10%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="number" 
                    min="10"
                    required
                    className="w-full bg-secondary border-none rounded-md pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.commissionPercentage}
                    onChange={(e) => setFormData({...formData, commissionPercentage: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Location Coordinates</label>
                  <button 
                    type="button"
                    onClick={detectLocation}
                    className="text-[10px] font-black uppercase tracking-widest text-foreground hover:opacity-70 transition-opacity flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3" />
                    Detect My Location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <input 
                      type="number" step="any"
                      required
                      placeholder="Latitude"
                      className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                      value={formData.lat}
                      onChange={(e) => setFormData({...formData, lat: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="number" step="any"
                      required
                      placeholder="Longitude"
                      className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                      value={formData.lng}
                      onChange={(e) => setFormData({...formData, lng: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Detailed Location (UAE)</label>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.emirate}
                    onChange={(e) => setFormData({...formData, emirate: e.target.value})}
                  >
                    <option value="">Select Emirate</option>
                    {UAE_EMIRATES.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                  <input 
                    type="text"
                    placeholder="Nearest Landmark"
                    className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.landmark}
                    onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valid From</label>
                  <input 
                    type="date" required
                    className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valid Until</label>
                  <input 
                    type="date" required
                    className="w-full bg-secondary border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-border">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">Deal Images</h3>
              <p className="text-xs text-muted-foreground mb-6">Manage high-quality images to attract more customers. The first image will be the cover.</p>
            </div>
            
            <CloudinaryUpload 
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
              existingImages={formData.images}
              onRemoveImage={(url) => setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }))}
              maxFiles={4}
            />
          </div>

          <div className="pt-6 border-t border-border">
            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-secondary text-foreground border border-border font-bold py-4 rounded-md shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
