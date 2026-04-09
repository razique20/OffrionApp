'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  maxFiles?: number;
  existingImages?: string[];
  onRemoveImage?: (url: string) => void;
}

export function CloudinaryUpload({ 
  onUploadSuccess, 
  maxFiles = 3, 
  existingImages = [],
  onRemoveImage
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (existingImages.length >= maxFiles) {
      setError(`Maximum ${maxFiles} images allowed.`);
      return;
    }

    setIsUploading(true);
    setError(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary configuration is missing. Check .env.local');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errMessage = 'Upload failed';
        try {
          const errData = await response.json();
          errMessage = errData.error?.message || errMessage;
        } catch (_) {}
        throw new Error(errMessage);
      }

      const data = await response.json();
      onUploadSuccess(data.secure_url);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone / Button */}
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all",
          isUploading ? "border-muted bg-secondary/50 cursor-not-allowed" : "border-border hover:border-primary/50 hover:bg-secondary/50",
          existingImages.length >= maxFiles && "opacity-50 pointer-events-none"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-bold text-foreground">Uploading image...</p>
            <p className="text-xs text-muted-foreground mt-1">Please wait</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-foreground">Click to upload image</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 5MB (Max {maxFiles})</p>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Image Gallery */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {existingImages.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
              <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
              {onRemoveImage && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveImage(url); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
