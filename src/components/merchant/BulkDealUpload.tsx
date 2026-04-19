'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  Check, 
  X, 
  Loader2, 
  AlertCircle,
  Table as TableIcon,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RawDeal {
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  categoryName: string;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  tags: string[];
}

export function BulkDealUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedDeals, setParsedDeals] = useState<RawDeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to parse CSV manually (client-side)
  const parseCSV = (text: string): RawDeal[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) throw new Error('CSV is empty or missing headers');
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const deals: RawDeal[] = [];

    // Robust Regex to handle quoted fields with commas: /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
    const rowRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(rowRegex).map(v => v.trim().replace(/^"|"$/g, ''));
      if (values.length < headers.length) continue;

      const deal: any = {};
      headers.forEach((header, index) => {
        if (header === 'tags') {
          deal[header] = values[index].split('|').map(t => t.trim());
        } else if (['originalprice', 'discountedprice', 'usagelimit'].includes(header)) {
          // Map to camelCase
          const key = header === 'originalprice' ? 'originalPrice' : 
                      header === 'discountedprice' ? 'discountedPrice' : 'usageLimit';
          deal[key] = parseFloat(values[index]) || 0;
        } else if (header === 'category') {
          deal['categoryName'] = values[index];
        } else if (['validfrom', 'validuntil'].includes(header)) {
          const key = header === 'validfrom' ? 'validFrom' : 'validUntil';
          deal[key] = values[index];
        } else {
          deal[header] = values[index];
        }
      });
      deals.push(deal as RawDeal);
    }
    return deals;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setLoading(true);
    setError(null);
    setFile(selectedFile);

    try {
      const text = await selectedFile.text();
      const parsed = parseCSV(text);
      setParsedDeals(parsed);
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (parsedDeals.length === 0) return;
    
    setUploading(true);
    setError(null);
    setSuccessCount(null);

    try {
      const res = await fetch('/api/merchant/deals/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deals: parsedDeals }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bulk upload failed');

      setSuccessCount(data.count);
      setParsedDeals([]);
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = 'title,description,originalPrice,discountedPrice,category,validFrom,validUntil,usageLimit,tags\n';
    const sample = 'Sample High-End Deal,Luxury experience at 50% off,100,50,Dining,2024-01-01,2024-12-31,100,luxury|dining|half-off\n';
    const blob = new Blob([headers + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'offrion_bulk_deals_template.csv';
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Bulk Deal Batching</h1>
          <p className="text-muted-foreground text-sm">Upload dozens of deals simultaneously via CSV.</p>
        </div>
        <button 
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-5 py-2.5 bg-secondary border border-border rounded-md text-xs font-bold hover:bg-secondary/80 transition-all"
        >
          <Download className="w-4 h-4" /> Download CSV Template
        </button>
      </div>

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="p-16 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer bg-card/30"
        >
          <div className="w-20 h-20 bg-secondary rounded-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-none shadow-primary/5">
            <Upload className="w-10 h-10 text-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">Drop your CSV here</h3>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs">Drag and drop or click to select your bulk deals file (.csv only)</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            accept=".csv"
            onChange={handleFileChange}
          />
          <button className="px-8 py-3 bg-secondary text-foreground border border-border rounded-md text-xs font-bold shadow-none">Select File</button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-md">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold">{file.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{parsedDeals.length} Deals Detected</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setParsedDeals([]); }}
              className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Table */}
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-foreground" /> Preview Data
              </h3>
              <span className="text-[10px] bg-secondary px-2 py-0.5 rounded font-mono">Row check active</span>
            </div>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/50 sticky top-0">
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 font-bold">Title</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold">Original</th>
                    <th className="px-6 py-4 font-bold">Discounted</th>
                    <th className="px-6 py-4 font-bold">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {parsedDeals.map((deal, i) => (
                    <tr key={i} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 font-medium truncate max-w-[200px]">{deal.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{deal.categoryName}</td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">${deal.originalPrice}</td>
                      <td className="px-6 py-4 font-bold text-foreground">${deal.discountedPrice}</td>
                      <td className="px-6 py-4 text-muted-foreground">{deal.validUntil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <button 
              disabled={uploading}
              onClick={() => { setFile(null); setParsedDeals([]); }} 
              className="px-8 py-3 text-xs font-bold border border-border rounded-md hover:bg-secondary transition-all"
             >
                Cancel
             </button>
             <button 
              onClick={handleUpload}
              disabled={uploading || parsedDeals.length === 0}
              className="px-8 py-3 bg-secondary text-foreground border border-border rounded-md text-xs font-bold shadow-none hover:scale-[1.02] transition-all flex items-center gap-2"
             >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {uploading ? 'Injecting Deals...' : `Confirm Upload (${parsedDeals.length} Deals)`}
             </button>
          </div>
        </div>
      )}

      {/* Result Alerts */}
      {error && (
        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-md flex items-center gap-4 text-red-500">
           <AlertCircle className="w-6 h-6 flex-shrink-0" />
           <p className="text-xs font-medium">{error}</p>
        </div>
      )}

      {successCount !== null && (
        <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-md flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
           <div className="w-16 h-16 bg-emerald-500/10 rounded-md flex items-center justify-center shadow-none shadow-emerald-500/5">
              <Check className="w-8 h-8 text-emerald-500" />
           </div>
           <div>
              <h3 className="text-xl font-bold">Bulk Sequence Completed</h3>
              <p className="text-xs text-muted-foreground">Successfully injected <strong>{successCount}</strong> deals into the ecosystem ledger.</p>
           </div>
           <button 
            onClick={() => setSuccessCount(null)}
            className="px-6 py-2 bg-secondary rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/80 transition-all"
           >
              Dismiss
           </button>
        </div>
      )}
    </div>
  );
}
