"use client";
import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from '@/components/cart/cart-sheet';
import { useState } from 'react';
import Image from 'next/image';

export function Header() {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center pl-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
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
        <nav className="flex-1 items-center space-x-2 text-sm font-medium hidden sm:flex">
          <Link href="/" className="text-foreground/80 transition-colors hover:text-white hover:bg-nav-hover px-3 py-2 rounded-full">
            Home
          </Link>
          <Link href="/about" className="text-foreground/80 transition-colors hover:text-white hover:bg-nav-hover px-3 py-2 rounded-full">
            About Us
          </Link>
          <Link href="/profile" className="text-foreground/80 transition-colors hover:text-white hover:bg-nav-hover px-3 py-2 rounded-full">
            Profile
          </Link>
        </nav>
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
