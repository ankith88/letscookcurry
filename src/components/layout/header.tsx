"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from '@/components/cart/cart-sheet';
import { useState } from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/context/site-settings-context';

const BASE_NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/#all-recipes', label: 'Recipes' },
  { href: '/about', label: 'About Us' },
  { href: '/profile', label: 'Profile' },
];

function NavLinks({
  pathname,
  showAdmin,
  onNavigate,
  mobile = false,
}: {
  pathname: string;
  showAdmin: boolean;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const navItems = showAdmin
    ? [...BASE_NAV_ITEMS, { href: '/admin', label: 'Admin Studio' }]
    : BASE_NAV_ITEMS;

  return (
    <>
      {navItems.map((item) => {
        const isHashLink = item.href.includes('#');
        const isActive = isHashLink
          ? false
          : item.href === '/'
          ? pathname === '/'
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'transition-all duration-150 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-1.5',
              mobile ? 'text-base w-full py-2.5' : 'text-sm',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground/85 hover:text-primary-foreground hover:bg-primary/90'
            )}
          >
            {item.href === '/admin' && <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function Header() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    orderingFeatureEnabled,
    orderWindowMode,
    isOrdersOpen,
    currentUser,
    isAdmin,
    canBootstrapAdmin,
  } = useSiteSettings();

  const showAdminLink = isAdmin || canBootstrapAdmin;
  const profileHref = currentUser ? '/profile' : '/login';
  const profileLabel = currentUser
    ? `Profile (${currentUser.displayName || currentUser.email || 'Signed in'})`
    : 'Sign in to your account';

  const getOrderingBadgeText = () => {
    if (orderWindowMode === 'open') return 'Orders Open Now · Monday Delivery';
    if (orderWindowMode === 'closed') return 'Ordering Currently Closed';
    return isOrdersOpen
      ? 'Orders Open (Mon to Thu) · Monday Delivery'
      : 'Ordering Closed (Opens Monday)';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 flex h-[4.5rem] items-center justify-between gap-4">
        {/* Left: Mobile Menu + Logo & Brand Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary hover:text-primary-foreground rounded-lg h-10 w-10"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[290px] bg-background border-r border-border">
                <SheetHeader className="text-left pb-5 border-b border-border">
                  <SheetTitle className="font-headline text-xl flex items-center gap-3">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/letscookcurry-%20logo.png?alt=media&token=39f4c042-7108-4a35-8ce0-5ba1d2ab4314"
                      alt="Let's Cook Curry Logo"
                      width={38}
                      height={38}
                      className="rounded-full"
                    />
                    <span>Let&apos;s Cook Curry</span>
                  </SheetTitle>
                </SheetHeader>
                <nav
                  aria-label="Mobile Navigation"
                  className="flex flex-col gap-1.5 mt-6"
                >
                  <NavLinks
                    pathname={pathname}
                    showAdmin={showAdminLink}
                    onNavigate={() => setIsMobileMenuOpen(false)}
                    mobile
                  />
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/letscookcurry-%20logo.png?alt=media&token=39f4c042-7108-4a35-8ce0-5ba1d2ab4314"
              alt="Let's Cook Curry Logo"
              width={42}
              height={42}
              className="rounded-full transition-transform duration-200 group-hover:scale-105"
              data-ai-hint="logo curry"
            />
            <span className="font-headline text-lg sm:text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
              Let&apos;s Cook Curry
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="items-center gap-1.5 hidden md:flex"
        >
          <NavLinks pathname={pathname} showAdmin={showAdminLink} />
        </nav>

        {/* Right: Account + Cart */}
        <div className="flex items-center justify-end gap-2">
          {orderingFeatureEnabled && (
            <div className="hidden xl:inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-medium text-foreground">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  isOrdersOpen ? 'bg-primary' : 'bg-accent'
                )}
                aria-hidden="true"
              />
              <span className="num">{getOrderingBadgeText()}</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="relative border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg h-10 px-3.5 gap-2 text-foreground"
            asChild
          >
            <Link href={profileHref} aria-label={profileLabel}>
              <User className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline text-sm font-medium">
                {currentUser ? currentUser.displayName?.split(' ')[0] || 'Profile' : 'Sign In'}
              </span>
              {currentUser && (
                <span
                  className="h-2 w-2 rounded-full bg-accent"
                  aria-hidden="true"
                />
              )}
            </Link>
          </Button>

          {orderingFeatureEnabled && (
            <Button
              variant="default"
              size="sm"
              className="relative h-10 rounded-lg px-3.5 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm"
              aria-label={
                totalItems > 0
                  ? `Shopping Cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`
                  : 'Shopping Cart, empty'
              }
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline text-sm">Cart</span>
              <span
                aria-hidden="true"
                className="num inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground"
              >
                {totalItems}
              </span>
            </Button>
          )}
        </div>
      </div>

      {orderingFeatureEnabled && (
        <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      )}
    </header>
  );
}
