'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ArrowRight, 
  ShoppingBag, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronDown,
  Moon,
  Sun,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { UserRole } from '@/lib/constants';

export const Navbar = () => {
  const { user, loading, logout } = useUser();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/ecosystem" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Ecosystem</Link>
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
          <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground mr-1"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          {loading ? (
            <div className="w-20 h-8 bg-secondary animate-pulse rounded-xl"></div>
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl hover:bg-secondary transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-premium-gradient flex items-center justify-center text-white border border-white/20">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-none">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {pathname.startsWith('/admin') ? 'Platform Admin' : 
                     pathname.startsWith('/merchant') ? 'Merchant' : 
                     pathname.startsWith('/partner') ? 'Partner' : 
                     (user.roles && user.roles.length > 1 
                        ? user.roles.filter((r: string) => r !== 'user').join(' + ') 
                        : user.role)}
                  </p>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showDropdown && "rotate-180")} />
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <Link 
                      href={pathname.startsWith('/merchant') ? '/merchant/dashboard' : 
                            pathname.startsWith('/admin') ? '/admin/dashboard' : 
                            pathname.startsWith('/partner') ? '/partner/dashboard' : 
                            `/${user.role}/dashboard`}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    {(() => {
                      const availableViews = [
                        { role: UserRole.MERCHANT, label: 'Merchant', href: '/merchant/dashboard', color: 'text-primary', icon: User },
                        { role: UserRole.PARTNER, label: 'Partner', href: '/partner/dashboard', color: 'text-primary/80', icon: User },
                        { role: UserRole.ADMIN, label: 'Platform Admin', href: '/admin/dashboard', color: 'text-primary', icon: ShieldCheck },
                      ].filter(view => {
                        const userRoles = (user?.roles && user.roles.length > 0) ? user.roles : (user?.role ? [user.role] : []);
                        if (userRoles.includes(UserRole.SUPER_ADMIN) || userRoles.includes(UserRole.ADMIN)) return true;
                        return userRoles.includes(view.role);
                      });

                      if (availableViews.length <= 1) return null;

                      return (
                        <div className="border-t border-border my-1 pt-1">
                          <p className="px-4 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Switch View</p>
                          {availableViews.map((view) => (
                            <Link 
                              key={view.href}
                              href={view.href}
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                              onClick={() => setShowDropdown(false)}
                            >
                              <view.icon className={cn("w-4 h-4", view.color)} />
                              {view.label}
                            </Link>
                          ))}
                        </div>
                      );
                    })()}

                    <div className="border-t border-border my-1"></div>
                    <button 
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center">
              <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors pr-5">Sign In</Link>
              <Link 
                href="/auth/register" 
                className="px-4 py-2 bg-premium-gradient text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
          
          <button 
            className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors text-foreground ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background/98 backdrop-blur-xl border-b border-border shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
          <Link href="/ecosystem" className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Ecosystem</Link>
          <Link href="/docs" className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Docs</Link>
          <Link href="/#pricing" className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          
          {!user && (
            <div className="flex flex-col gap-3 pt-6 mt-2 border-t border-border">
              <Link 
                href="/auth/login" 
                className="w-full py-3.5 text-center rounded-xl bg-secondary font-bold hover:bg-secondary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="w-full py-3.5 text-center rounded-xl bg-premium-gradient text-white font-bold shadow-md hover:opacity-90 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
