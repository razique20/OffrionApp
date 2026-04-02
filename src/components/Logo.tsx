import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className, iconOnly = false, size = 'md' }: LogoProps) => {
  const sizeMap = {
    sm: { box: 'w-6 h-6', text: 'text-lg', icon: 'w-4 h-4' },
    md: { box: 'w-8 h-8', text: 'text-xl', icon: 'w-5 h-5' },
    lg: { box: 'w-12 h-12', text: 'text-3xl', icon: 'w-8 h-8' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20 overflow-hidden transform group-hover:scale-105 transition-all duration-300",
        currentSize.box
      )}>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Modern 'O' SVG Mark */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={cn("text-white drop-shadow-sm", currentSize.icon)}
        >
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
          <path d="M12 2v4" className="text-white/60" />
          <path d="M12 18v4" className="text-white/60" />
          <path d="M4.93 4.93l2.83 2.83" className="text-white/60" />
          <path d="M16.24 16.24l2.83 2.83" className="text-white/60" />
           {/* 'Deal/Tag' slash */}
          <path d="M9 15l6-6" strokeWidth="2.5" />
        </svg>
      </div>

      {!iconOnly && (
        <span className={cn(
          "font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300",
          currentSize.text
        )}>
          Offrion<span className="text-primary">.</span>
        </span>
      )}
    </div>
  );
};
