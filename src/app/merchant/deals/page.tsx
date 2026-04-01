'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Tag,
  MapPin,
  Clock
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export default function MerchantDealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/merchant/deals', { credentials: 'include' })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch deals');
        return json;
      })
      .then(json => {
        if (Array.isArray(json)) {
          setDeals(json);
        } else {
          console.error('Expected array, got:', json);
          setDeals([]);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    
    const res = await fetch(`/api/merchant/deals/${id}`, { 
      method: 'DELETE',
      credentials: 'include'
    });
    if (res.ok) {
      setDeals(deals.filter(d => d._id !== id));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Loading deals...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-[32px] text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Deals Error</h3>
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search deals..." 
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <Link 
            href="/merchant/deals/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            New Deal
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-card border border-dashed border-border rounded-2xl">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold">No deals found</h3>
            <p className="text-muted-foreground mt-1">Start by creating your first deal.</p>
            <Link 
              href="/merchant/deals/new"
              className="inline-block mt-6 text-primary font-bold hover:underline"
            >
              Create New Deal
            </Link>
          </div>
        ) : (
          deals.map((deal) => (
            <div key={deal._id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-video bg-secondary">
                {deal.images?.[0] ? (
                  <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="w-12 h-12 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-border">
                  {deal.isActive ? (
                    <span className="text-emerald-500">Active</span>
                  ) : (
                    <span className="text-destructive">Inactive</span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">{deal.title}</h3>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/merchant/deals/edit/${deal._id}`}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(deal._id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{deal.description}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    Until {formatDate(deal.validUntil)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    Nearby
                  </div>
                </div>
                
                <div className="flex justify-between items-end border-t border-border pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">{formatCurrency(deal.discountedPrice)}</span>
                      <span className="text-xs text-muted-foreground line-through">{formatCurrency(deal.originalPrice)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Commission</p>
                    <span className="text-sm font-bold text-primary">{deal.commissionPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
