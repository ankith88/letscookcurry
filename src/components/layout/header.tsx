"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, ShieldCheck } from 'lucide-react';
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
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/context/site-settings-context';

const BASE_NAV_ITEMS = [
  { href: '/', label: 'Home' },
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
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'transition-colors px-3.5 py-2 rounded-full font-medium inline-flex items-center gap-1.5',
              mobile ? 'text-base w-full' : 'text-sm',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground/85 hover:text-white hover:bg-nav-hover'
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
    currentUser,
    isAdmin,
    canBootstrapAdmin,
  } = useSiteSettings();

  const showAdminLink = isAdmin || canBootstrapAdmin;
  const profileHref = currentUser ? '/profile' : '/login';
  const profileLabel = currentUser
    ? `Profile (${currentUser.displayName || currentUser.email || 'Signed in'})`
    : 'Sign in to your account';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Mobile Menu */}
        <div className="flex items-center sm:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-nav-hover hover:text-white rounded-full"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader className="text-left pb-4 border-b">
                <SheetTitle className="font-headline text-xl flex items-center gap-2.5">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/letscookcurry-%20logo.png?alt=media&token=39f4c042-7108-4a35-8ce0-5ba1d2ab4314"
                    alt="Let's Cook Curry Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  Let&apos;s Cook Curry
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobile Navigation"
                className="flex flex-col gap-2 mt-6"
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

        {/* Desktop Logo */}
        <div className="hidden items-center sm:flex">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/letscookcurry-%20logo.png?alt=media&token=39f4c042-7108-4a35-8ce0-5ba1d2ab4314"
              alt="Let's Cook Curry Logo"
              width={40}
              height={40}
              className="rounded-full"
              data-ai-hint="logo curry"
            />
            <span className="font-bold font-headline text-lg tracking-tight inline-block transition-colors duration-200 group-hover:text-primary">
              Let&apos;s Cook Curry
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav
          aria-label="Primary Navigation"
          className="items-center space-x-1 hidden sm:flex"
        >
          <NavLinks pathname={pathname} showAdmin={showAdminLink} />
        </nav>

        {/* Centered Mobile Logo */}
        <div className="flex-1 flex justify-center sm:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/letscookcurry-%20logo.png?alt=media&token=39f4c042-7108-4a35-8ce0-5ba1d2ab4314"
              alt="Let's Cook Curry Logo"
              width={36}
              height={36}
              className="rounded-full"
              data-ai-hint="logo curry"
            />
            <span className="font-bold font-headline text-base">
              Let&apos;s Cook Curry
            </span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end space-x-1.5 sm:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-nav-hover hover:text-white rounded-full"
            asChild
          >
            <Link href={profileHref} aria-label={profileLabel}>
              <User className="h-5 w-5" aria-hidden="true" />
              {currentUser && (
                <span
                  className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background"
                  aria-hidden="true"
                />
              )}
            </Link>
          </Button>
          {orderingFeatureEnabled && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-nav-hover hover:text-white rounded-full"
                aria-label={
                  totalItems > 0
                    ? `Shopping Cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`
                    : 'Shopping Cart, empty'
                }
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              </Button>
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] px-1 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-sm"
                >
                  {totalItems}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {orderingFeatureEnabled && (
        <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      )}
    </header>
  );
}
