import React from 'react';
import Image from 'next/image';
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
        "relative flex items-center justify-center rounded-xl overflow-hidden transform group-hover:scale-105 transition-all duration-300",
        currentSize.box
      )}>
        <Image 
          src="/offrion-logo.png" 
          alt="Offrion Logo" 
          width={48}
          height={48}
          className="object-contain"
          priority
        />
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
