"use client";

import Link from 'next/link';
import Image from 'next/image';
import { CalendarClock, Flame, MapPin, UtensilsCrossed } from 'lucide-react';
import { useSiteSettings } from '@/context/site-settings-context';

export function Footer() {
  const { orderingFeatureEnabled, orderWindowMode } = useSiteSettings();

  const getScheduleStatusLabel = () => {
    if (orderWindowMode === 'open') return 'Orders Open Now';
    if (orderWindowMode === 'closed') return 'Ordering Currently Paused';
    return 'Orders Open: Monday to Thursday';
  };

  return (
    <footer className="border-t border-border/60 bg-secondary/40 text-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/letscookcurry-%20logo.png?alt=media&token=39f4c042-7108-4a35-8ce0-5ba1d2ab4314"
                alt="Let's Cook Curry Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-headline text-xl font-bold tracking-tight">
                Let&apos;s Cook Curry
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {orderingFeatureEnabled
                ? 'Authentic home-style Indian curries and recipe kits crafted with love in Sydney. Fresh weekly menus delivered straight from our kitchen to yours.'
                : 'Authentic home-style Indian curries crafted with love in Sydney. Sharing cherished regional recipes from our family kitchen to yours.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              <span>Sydney, Australia</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-headline text-base font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  {orderingFeatureEnabled ? 'Home & Weekly Menu' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/#all-recipes" className="hover:text-primary transition-colors">
                  Explore Full Recipe Collection
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Our Story (Tanvi &amp; Ankith)
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary transition-colors">
                  {orderingFeatureEnabled ? 'My Profile & Order History' : 'My Profile'}
                </Link>
              </li>
            </ul>
          </div>

          {orderingFeatureEnabled ? (
            <div className="space-y-3">
              <h3 className="font-headline text-base font-bold">Weekly Ordering Schedule</h3>
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5 text-sm shadow-sm">
                <div className="flex items-start gap-2.5">
                  <CalendarClock className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">{getScheduleStatusLabel()}</p>
                    <p className="text-xs text-muted-foreground">
                      New curated weekly curries are posted every Monday morning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <UtensilsCrossed className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">Fresh Delivery: Following Monday</p>
                    <p className="text-xs text-muted-foreground">
                      Slow-cooked, freshly spiced, and delivered ready to enjoy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-headline text-base font-bold">Our Culinary Heritage</h3>
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5 text-sm shadow-sm">
                <div className="flex items-start gap-2.5">
                  <Flame className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">Four Regions of India</p>
                    <p className="text-xs text-muted-foreground">
                      Explore traditional North, South, East, and West Indian recipes with step-by-step instructions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <UtensilsCrossed className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">Made for Home Kitchens</p>
                    <p className="text-xs text-muted-foreground">
                      Interactive ingredient checklists and community tasting notes on every recipe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Let&apos;s Cook Curry. All rights reserved.</p>
          <p>Made with warmth &amp; authentic spices in Sydney.</p>
        </div>
      </div>
    </footer>
  );
}
