"use client";

import Link from 'next/link';
import Image from 'next/image';
import { CalendarClock, Flame, UtensilsCrossed, ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '@/context/site-settings-context';

export function Footer() {
  const { orderingFeatureEnabled, orderWindowMode, currentUser } = useSiteSettings();

  const getScheduleStatusLabel = () => {
    if (orderWindowMode === 'open') return 'Orders Open Now';
    if (orderWindowMode === 'closed') return 'Ordering Currently Paused';
    return 'Orders Open: Monday to Thursday';
  };

  return (
    <footer className="border-t border-border bg-[var(--p-inv-bg)] text-[var(--p-inv-ink)]">
      <div className="container mx-auto px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 pb-12 border-b border-[var(--p-inv-ink)]/15">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/letscookcurry-%20logo.png?alt=media&token=39f4c042-7108-4a35-8ce0-5ba1d2ab4314"
                alt="Let's Cook Curry Logo"
                width={44}
                height={44}
                className="rounded-full border border-[var(--p-inv-accent)]/40"
              />
              <span className="font-headline text-2xl font-medium tracking-tight text-[var(--p-inv-ink)] block leading-none">
                Let&apos;s Cook Curry
              </span>
            </Link>
            <p className="text-sm sm:text-base text-[var(--p-inv-muted)] max-w-md leading-relaxed">
              {orderingFeatureEnabled
                ? 'Home-style Indian curries and weekly menus delivered from our kitchen to yours.'
                : 'Sharing home-style regional Indian recipes from our kitchen to yours.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-headline text-base font-medium text-[var(--p-inv-accent)] tracking-tight">
              Quick Links
            </h2>
            <ul className="space-y-2.5 text-sm text-[var(--p-inv-muted)]">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 hover:text-[var(--p-inv-accent)] transition-colors"
                >
                  <span>{orderingFeatureEnabled ? 'Home & Weekly Menu' : 'Home'}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#all-recipes"
                  className="inline-flex items-center gap-1 hover:text-[var(--p-inv-accent)] transition-colors"
                >
                  <span>Explore All Recipes</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 hover:text-[var(--p-inv-accent)] transition-colors"
                >
                  <span>About Us (Tanvi &amp; Ankith)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-1 hover:text-[var(--p-inv-accent)] transition-colors"
                >
                  <span>{orderingFeatureEnabled ? 'Profile & Order History' : 'My Profile'}</span>
                </Link>
              </li>
              {!currentUser && (
                <li>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 hover:text-[var(--p-inv-accent)] transition-colors"
                  >
                    <span>Sign In</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Schedule or Heritage Card */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-headline text-base font-medium text-[var(--p-inv-accent)] tracking-tight">
              {orderingFeatureEnabled ? 'Weekly Ordering Schedule' : 'Our Culinary Heritage'}
            </h2>

            {orderingFeatureEnabled ? (
              <div className="rounded-xl border border-[var(--p-inv-ink)]/15 bg-[var(--p-inv-surface)] p-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarClock
                    className="h-4 w-4 text-[var(--p-inv-accent)] mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[var(--p-inv-ink)]">{getScheduleStatusLabel()}</p>
                    <p className="text-xs text-[var(--p-inv-muted)] mt-0.5 leading-relaxed">
                      New curated weekly curries are posted every Monday morning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-t border-[var(--p-inv-ink)]/10 pt-3.5">
                  <UtensilsCrossed
                    className="h-4 w-4 text-[var(--p-inv-accent)] mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[var(--p-inv-ink)]">Fresh Delivery: Following Monday</p>
                    <p className="text-xs text-[var(--p-inv-muted)] mt-0.5 leading-relaxed">
                      Slow-cooked, freshly spiced, and delivered ready to enjoy.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--p-inv-ink)]/15 bg-[var(--p-inv-surface)] p-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Flame
                    className="h-4 w-4 text-[var(--p-inv-accent)] mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[var(--p-inv-ink)]">Four Regions of India</p>
                    <p className="text-xs text-[var(--p-inv-muted)] mt-0.5 leading-relaxed">
                      Traditional North, South, East, and West Indian recipes with step-by-step instructions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-t border-[var(--p-inv-ink)]/10 pt-3.5">
                  <UtensilsCrossed
                    className="h-4 w-4 text-[var(--p-inv-accent)] mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[var(--p-inv-ink)]">Made for Home Kitchens</p>
                    <p className="text-xs text-[var(--p-inv-muted)] mt-0.5 leading-relaxed">
                      Interactive ingredient checklists and community reviews on every recipe.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--p-inv-muted)]">
          <p>&copy; {new Date().getFullYear()} Let&apos;s Cook Curry. All rights reserved.</p>
          <p>From Our Kitchen to Yours</p>
        </div>
      </div>
    </footer>
  );
}
