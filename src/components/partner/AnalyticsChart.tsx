'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ChartSeries {
  key: string;
  name: string;
  color: string;
  gradient?: boolean;
}

interface ChartProps {
  data: any[];
  series: ChartSeries[];
  height?: number;
}

export default function AnalyticsChart({ data, series, height = 400 }: ChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to ensure parent dimensions are settled in the DOM
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="w-full bg-secondary/20 animate-pulse rounded-2xl" style={{ height }} />;
  }

  return (
    <div 
      className="w-full overflow-hidden" 
      style={{ height, minHeight: height }}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {series.map(s => s.gradient && (
              <linearGradient key={`grad-${s.key}`} id={`color-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.922 0 0)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'oklch(0.556 0 0)', fontSize: 11 }} 
            dy={15}
            tickFormatter={(val) => {
              if (!val) return '';
              try {
                const date = new Date(val);
                return isNaN(date.getTime()) ? val : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
              } catch {
                return val;
              }
            }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'oklch(0.556 0 0)', fontSize: 11 }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              border: '1px solid oklch(0.922 0 0)',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
            }} 
          />
          {series.map(s => (
            <Area 
              key={s.key}
              type="monotone" 
              dataKey={s.key} 
              stroke={s.color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={s.gradient ? `url(#color-${s.key})` : 'transparent'} 
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
