'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  BarChart3,
  LayoutDashboard,
  Tag,
  Key,
  BookOpen,
  Settings,
  LifeBuoy,
  Users,
  ShieldCheck,
  TrendingUp,
  Globe,
  Zap,
  ShoppingBag,
  Bell,
  ScanLine,
  Wallet,
  Moon,
  Sun,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { useTheme } from 'next-themes';

export const iconMap = {
  dashboard: LayoutDashboard,
  deals: Tag,
  analytics: BarChart3,
  keys: Key,
  docs: BookOpen,
  settings: Settings,
  support: LifeBuoy,
  merchants: ShoppingBag,
  partners: Handshake,
  users: Users,
  security: ShieldCheck,
  trending: TrendingUp,
  globe: Globe,
  zap: Zap,
  notifications: Bell,
  scan: ScanLine,
  wallet: Wallet
};

import { Handshake } from 'lucide-react';

export type IconName = keyof typeof iconMap;

export interface SidebarItem {
  name: string;
  icon: IconName;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
  role?: 'merchant' | 'partner' | 'admin';
}

export default function Sidebar({ items, role = 'merchant' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setMe(data))
      .catch(console.error);
  }, []);

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const actualLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Find the most specific (longest) matching item for the current path
  const matchingItems = items
    .filter(item => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length);
  
  const activeItemHref = matchingItems[0]?.href;

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) {
    return (
      <div className={cn(
        "bg-card/40 border-r border-border h-screen flex flex-col sticky top-0 transition-all duration-300 frost-glass",
        isMinimized ? "w-20" : "w-64"
      )}>
        <div className="p-6">
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center justify-center">
            <Logo size="sm" />
          </Link>
        </div>
      </div>
    );
  }

  const userRoles = me?.roles || (me?.role ? [me?.role] : []);
  const isSuperAdmin = userRoles.includes('super_admin');

  const renderItems = (itemsToRender: SidebarItem[], label?: string) => (
    <nav className={cn("space-y-1 w-full", isMinimized ? "px-2" : "px-4")}>
      {!isMinimized && label && itemsToRender.length > 0 && (
        <p className="px-3 mb-2 mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-50">
          {label}
        </p>
      )}
      {itemsToRender.map((item) => {
        const isActive = activeItemHref === item.href;
        const Icon = iconMap[item.icon] || LayoutDashboard;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={isMinimized ? item.name : undefined}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium transition-all group",
              isMinimized ? "md:justify-center p-3" : "gap-3 px-3 py-2",
              isActive 
                ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className={cn("flex-shrink-0", isMinimized ? "md:w-6 md:h-6 w-5 h-5" : "w-5 h-5")} />
            {(!isMinimized || isMobileOpen) && (
              <div className="flex-1 flex items-center justify-between">
                <span className="truncate">{item.name}</span>
              </div>
            )}
            {(!isMinimized || isMobileOpen) && isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <button 
        className="md:hidden fixed top-4 right-4 z-[60] p-2 bg-card rounded-md border border-border shadow-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-[70] animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        "bg-card/40 border-r border-border h-[100svh] flex-col z-[80] transition-transform duration-300 frost-glass",
        // Desktop
        "md:sticky md:top-0 md:translate-x-0 hidden md:flex",
        isMinimized ? "md:w-20 md:items-center md:px-2" : "md:w-64",
        // Mobile
        "fixed top-0 left-0 w-64 shadow-2xl md:shadow-none flex",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      <div className={cn("p-6 flex items-center relative", isMinimized ? "md:justify-center justify-between" : "justify-between")}>
        {(!isMinimized || isMobileOpen) && (
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size="sm" />
          </Link>
        )}
        {isMinimized && !isMobileOpen && (
          <Link href="/" className="hover:opacity-90 transition-opacity font-bold text-2xl text-primary mt-2">
            O.
          </Link>
        )}
        <button 
          className="md:hidden p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className={cn("flex-1 space-y-2 w-full", isMinimized ? "px-0" : "px-0")}>
        {renderItems(items.filter(i => !['docs', 'support', 'settings', 'api-keys', 'playground'].some(k => i.href.includes(k))), "Insights")}
        {renderItems(items.filter(i => i.href.includes('api-keys')), "Connectivity")}
        {renderItems(items.filter(i => ['docs'].some(k => i.href.includes(k))), "Development")}
        {renderItems(items.filter(i => ['settings', 'support'].some(k => i.href.includes(k))), "Account")}

        {isSuperAdmin && role !== 'admin' && (
          <nav className={cn("space-y-1 w-full mt-8", isMinimized ? "px-2" : "px-4")}>
             {isMinimized && <div className="border-t border-border my-4 w-1/2 mx-auto"></div>}
             <Link 
              href="/admin/dashboard" 
              title={isMinimized ? "Admin Governance" : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all text-primary hover:bg-primary/10",
                isMinimized ? "justify-center p-3" : "gap-3 px-3 py-2"
              )}>
                <ShieldCheck className={cn("flex-shrink-0", isMinimized ? "w-6 h-6" : "w-5 h-5")} />
                {!isMinimized && <span className="font-bold">Admin Governance</span>}
             </Link>
          </nav>
        )}

        {/* Multi-Role Switcher */}
        {userRoles.includes('merchant') && userRoles.includes('partner') && (
          <nav className={cn("space-y-1 w-full mt-8", isMinimized ? "px-2" : "px-4")}>
            {!isMinimized && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                Switch Role
              </p>
            )}
            <Link 
              href={role === 'merchant' ? '/partner/dashboard' : '/merchant/dashboard'} 
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10",
                isMinimized ? "justify-center p-3" : "gap-3 px-3 py-2"
              )}>
                {role === 'merchant' ? <Handshake className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                {!isMinimized && <span>Switch to {role === 'merchant' ? 'Partner' : 'Merchant'}</span>}
            </Link>
          </nav>
        )}
      </div>

      <div className={cn("p-4 border-t border-border mt-auto w-full", isMinimized ? "px-2" : "")}>
        {!isMinimized && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
             <div>
               <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold leading-none mb-1">Session Role</p>
               <p className="text-xs font-bold capitalize leading-none">{isSuperAdmin ? 'Super Admin' : role}</p>
             </div>
             {isSuperAdmin && <Zap className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" />}
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          title={isMinimized ? "Logout" : undefined}
          className={cn(
            "flex items-center w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all",
            isMinimized ? "justify-center p-3 mb-2" : "gap-3 px-3 py-2 mb-2"
          )}
        >
          <LogOut className={cn("flex-shrink-0", isMinimized ? "w-6 h-6" : "w-5 h-5")} />
          {!isMinimized && <span>Logout</span>}
        </button>

        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={isMinimized ? "Toggle Theme" : undefined}
          className={cn(
            "flex items-center w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-all",
            isMinimized ? "justify-center p-3 mb-2" : "gap-3 px-3 py-2 mb-2"
          )}
        >
          {theme === 'dark' ? <Sun className={cn("flex-shrink-0", isMinimized ? "w-6 h-6" : "w-5 h-5")} /> : <Moon className={cn("flex-shrink-0", isMinimized ? "w-6 h-6" : "w-5 h-5")} />}
          {!isMinimized && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className={cn(
            "flex items-center w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-all",
            isMinimized ? "justify-center p-3" : "gap-3 px-3 py-2"
          )}
        >
          {isMinimized ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-5 h-5" />}
          {!isMinimized && <span>Collapse</span>}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsLogoutConfirmOpen(false)} />
          <div className="bg-card w-full max-w-sm border border-border rounded-[40px] shadow-2xl relative z-[10000] overflow-hidden p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-destructive/10">
              <LogOut className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">End Session?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed px-4">
                Are you sure you want to log out of the Offrion governance ecosystem?
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsLogoutConfirmOpen(false)} 
                className="flex-1 py-3 text-xs font-bold bg-secondary rounded-xl hover:bg-secondary/80 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={actualLogout} 
                className="flex-1 py-3 text-xs font-bold bg-destructive text-destructive-foreground rounded-xl shadow-lg shadow-destructive/20 hover:bg-destructive/90 transition-all flex items-center justify-center gap-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
