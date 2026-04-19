'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Premium Fluid 'O' Logo Component
 * Derived from user's handwritten reference with a vibrant gradient.
 */
export const Logo = ({ className, iconOnly = false, size = 'md' }: LogoProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const sizeMap = {
    sm: { box: 'w-6 h-6', text: 'text-lg' },
    md: { box: 'w-8 h-8', text: 'text-xl' },
    lg: { box: 'w-10 h-10', text: 'text-2xl' },
    xl: { box: 'w-14 h-14', text: 'text-4xl' },
  };

  const currentSize = sizeMap[size];
  const gradientId = React.useId().replace(/:/g, '');

  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className={cn(
        "relative flex items-center justify-center transform group-hover:scale-105 transition-all duration-500 ease-out",
        currentSize.box
      )}>
        {/* Fluid 'O' SVG Icon */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-none"
        >
          <defs>
            <linearGradient id={`grad-${gradientId}`} x1="20" y1="0" x2="80" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A855F7" /> {/* Purple */}
              <stop offset="35%" stopColor="#F97316" /> {/* Orange */}
              <stop offset="65%" stopColor="#EF4444" /> {/* Red */}
              <stop offset="100%" stopColor="#22C55E" /> {/* Green */}
            </linearGradient>
            
            <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Fluid hand-drawn O-stroke */}
          <path
            d="M50 15 C 20 15, 10 45, 20 70 C 30 95, 75 90, 85 70 C 95 50, 85 15, 50 15 C 30 15, 25 35, 45 40 C 65 45, 75 35, 75 35"
            stroke={`url(#grad-${gradientId})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
            style={{ 
              filter: (mounted && theme === 'dark') ? `url(#glow-${gradientId})` : 'none',
              strokeDasharray: '300',
              strokeDashoffset: '0'
            }}
          />
          
          {/* Subtle accent dot */}
          <circle cx="75" cy="35" r="4" fill="#EF4444" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </svg>
      </div>

      {!iconOnly && (
        <span className={cn(
          "font-black tracking-tighter text-foreground group-hover:text-white transition-colors duration-300",
          currentSize.text
        )}>
          Offrion<span className="text-foreground italic">.</span>
        </span>
      )}
    </div>
  );
};
