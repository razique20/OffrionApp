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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80  py-3 shadow-none" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
          <Logo size="md" />
        </Link>

        <div className="hidden md:flex items-center gap-8 ml-12 flex-1">
          {[
            { label: 'Ecosystem', href: '/ecosystem' },
            { label: 'Docs', href: '/docs' },
            { label: 'Pricing', href: '/#pricing' },
          ].map((link) => (
            <Link 
              key={link.label}
              href={link.href} 
              className={cn(
                "text-sm font-bold tracking-tight transition-all",
                pathname === link.href 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

          {loading ? (
            <div className="w-10 h-10 bg-secondary animate-pulse rounded-full"></div>
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 pl-3 rounded-full hover:bg-secondary transition-all group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black leading-none">{user.name}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground border border-white/20 shadow-none transition-transform group-hover:scale-105">
                  <User className="w-5 h-5" />
                </div>
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-card/95  border border-border/50 rounded-md shadow-none z-20 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-2 border-b border-border/10 mb-1">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Active Identity</p>
                       <p className="text-sm font-bold truncate">{user.name}</p>
                    </div>

                    <Link 
                      href={pathname.startsWith('/merchant') ? '/merchant/dashboard' : 
                            pathname.startsWith('/admin') ? '/admin/dashboard' : 
                            pathname.startsWith('/partner') ? '/partner/dashboard' : 
                            user.role === 'super_admin' ? '/admin/dashboard' : `/${user.role}/dashboard`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-secondary transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    {(() => {
                      const availableViews = [
                        { role: UserRole.MERCHANT, label: 'Merchant Center', href: '/merchant/dashboard', icon: ShoppingBag },
                        { role: UserRole.PARTNER, label: 'Partner API', href: '/partner/dashboard', icon: User },
                        { role: UserRole.ADMIN, label: 'Admin Panel', href: '/admin/dashboard', icon: ShieldCheck },
                      ].filter(view => {
                        const userRoles = (user?.roles && user.roles.length > 0) ? user.roles : (user?.role ? [user.role] : []);
                        if (userRoles.includes(UserRole.SUPER_ADMIN) || userRoles.includes(UserRole.ADMIN)) return true;
                        return userRoles.includes(view.role);
                      });

                      if (availableViews.length <= 1) return null;

                      return (
                        <div className="border-t border-border/10 my-1 pt-1">
                          <p className="px-4 py-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Perspective</p>
                          {availableViews.map((view) => (
                            <Link 
                              key={view.href}
                              href={view.href}
                              className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
                              onClick={() => setShowDropdown(false)}
                            >
                              <view.icon className="w-4 h-4" />
                              {view.label}
                            </Link>
                          ))}
                        </div>
                      );
                    })()}

                    <div className="border-t border-border/10 my-1 pt-1">
                       <button 
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/5 transition-colors"
                       >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/auth/login" className="text-sm font-bold hover:text-foreground transition-colors">Sign In</Link>
              <Link 
                href="/auth/register" 
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-black shadow-none hover:shadow-none hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Get Started
              </Link>
            </div>
          )}
          
          <button 
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95  border-b border-border p-8 flex flex-col gap-8 shadow-none animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-6">
            {[
              { label: 'Ecosystem', href: '/ecosystem' },
              { label: 'Docs', href: '/docs' },
              { label: 'Pricing', href: '/#pricing' },
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className="text-3xl font-black tracking-tighter text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {!user && (
            <div className="flex flex-col gap-4 mt-4 pt-8 border-t border-border/30">
              <Link 
                href="/auth/login" 
                className="w-full py-4 text-center rounded-md bg-secondary text-sm font-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="w-full py-4 text-center rounded-md bg-primary text-foreground text-sm font-black shadow-none shadow-primary/20"
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
