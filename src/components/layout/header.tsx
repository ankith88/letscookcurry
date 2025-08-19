"use client";
import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from '@/components/cart/cart-sheet';
import { useState } from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

function NavLinks() {
  return (
    <>
      <Link href="/" className="text-foreground/80 transition-colors hover:text-white hover:bg-nav-hover px-3 py-2 rounded-full">
        Home
      </Link>
      <Link href="/about" className="text-foreground/80 transition-colors hover:text-white hover:bg-nav-hover px-3 py-2 rounded-full">
        About Us
      </Link>
      <Link href="/profile" className="text-foreground/80 transition-colors hover:text-white hover:bg-nav-hover px-3 py-2 rounded-full">
        Profile
      </Link>
    </>
  )
}

export function Header() {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu */}
        <div className="flex items-center sm:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button
                variant="ghost"
                size="icon"
                className="hover:bg-nav-hover hover:text-white rounded-full"
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
                <nav className="flex flex-col gap-4 mt-8 text-lg font-medium">
                    <NavLinks />
                </nav>
            </SheetContent>
            </Sheet>
        </div>

        {/* Desktop Logo & Nav */}
        <div className="mr-auto hidden items-center sm:flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/letscookcurry-%20logo.png?alt=media&token=39f4c042-7108-4a35-8ce0-5ba1d2ab4314"
              alt="Let's Cook Curry Logo"
              width={40}
              height={40}
              className="rounded-full"
              data-ai-hint="logo curry"
            />
            <span className="font-bold font-headline inline-block">Let's Cook Curry</span>
          </Link>
        </div>
        
        <nav className="items-center space-x-2 text-sm font-medium hidden sm:flex">
          <NavLinks />
        </nav>

        {/* Centered Mobile Logo */}
        <div className="flex-1 flex justify-center sm:hidden">
            <Link href="/" className="flex items-center space-x-2">
                <Image
                src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/letscookcurry-%20logo.png?alt=media&token=39f4c042-7108-4a35-8ce0-5ba1d2ab4314"
                alt="Let's Cook Curry Logo"
                width={40}
                height={40}
                className="rounded-full"
                data-ai-hint="logo curry"
                />
            </Link>
        </div>


        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
           <Button variant="ghost" size="icon" className="hover:bg-nav-hover hover:text-white rounded-full" asChild>
             <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="hover:bg-nav-hover hover:text-white rounded-full" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Button>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {items.length}
              </span>
            )}
          </div>
        </div>
      </div>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}
