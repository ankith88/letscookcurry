"use client";

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Drumstick,
  Leaf,
  MapPin,
  Sparkles,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { FilteredRecipeGrid } from '@/components/recipes/filtered-recipe-grid';
import { SpiceLevel } from '@/components/recipes/spice-level';
import { useSiteSettings } from '@/context/site-settings-context';
import type { Recipe, SiteSettings } from '@/lib/types';

const SCHEDULE_DAYS = [
  { step: '01', day: 'Monday', role: 'New weekly menu posted at 8am', active: true },
  { step: '02', day: 'Tuesday', role: 'Ordering open', active: true },
  { step: '03', day: 'Wednesday', role: 'Ordering open', active: true },
  { step: '04', day: 'Thursday', role: 'Weekly order cutoff', active: true },
  { step: '05', day: 'Fri to Sun', role: 'Kitchen preparation', active: false },
  { step: '06', day: 'Next Monday', role: 'Delivered to your door', highlight: true },
];

interface HomeContentProps {
  weeklyRecipes: Recipe[];
  allRecipes: Recipe[];
  initialSettings: SiteSettings;
}

export function HomeContent({
  weeklyRecipes,
  allRecipes,
  initialSettings,
}: HomeContentProps) {
  const { settings, loading, isOrdersOpen } = useSiteSettings();
  const effectiveSettings = loading ? initialSettings : settings;
  const orderingActive = effectiveSettings.orderingFeatureEnabled;
  const orderWindowMode = effectiveSettings.orderWindowMode;

  const hasWeeklyRecipes = orderingActive && weeklyRecipes.length > 0;
  const configuredFeaturedId = effectiveSettings.featuredRecipeId?.trim();
  const leadDish =
    (configuredFeaturedId &&
      (allRecipes.find((r) => r.id === configuredFeaturedId) ||
        weeklyRecipes.find((r) => r.id === configuredFeaturedId))) ||
    allRecipes.find((r) => r.isFeatured) ||
    (orderingActive && weeklyRecipes[0]) ||
    allRecipes[0];

  const getLiveOrderingStatusText = () => {
    if (orderWindowMode === 'open') {
      return 'Orders Open Now · Fresh Monday Delivery';
    }
    if (orderWindowMode === 'closed') {
      return 'Ordering Currently Paused · Browse Menu Below';
    }
    return isOrdersOpen
      ? 'Orders Open (Monday to Thursday) · Monday Delivery'
      : 'Ordering Closed · Opens Monday';
  };

  const getOrderingWindowLabel = () => {
    if (orderWindowMode === 'open') return 'Open Now';
    if (orderWindowMode === 'closed') return 'Currently Closed';
    return isOrdersOpen ? 'Open Now (Mon to Thu)' : 'Closed (Opens Mon)';
  };

  return (
    <>
      {/* Screen 1: Split Studio Hero */}
      <section
        data-enter
        className="relative border-b border-border bg-background py-8 sm:py-10 lg:py-12"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left 6 Columns: Editorial Warm Saffron & Cream Studio Panel */}
            <div className="enter-1 lg:col-span-6 rounded-2xl border border-border bg-secondary/75 p-7 sm:p-10 lg:p-12 flex flex-col justify-between gap-8">
              {/* Top Header Line inside Hero */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-primary">
                  <Leaf className="h-4 w-4 text-primary fill-primary/20" aria-hidden="true" />
                  <span>Home-Style Indian Recipes</span>
                </span>
                {orderingActive ? (
                  <span className="num inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-semibold text-foreground">
                    <span
                      className={
                        isOrdersOpen
                          ? 'h-2 w-2 rounded-full bg-primary'
                          : 'h-2 w-2 rounded-full bg-accent'
                      }
                      aria-hidden="true"
                    />
                    {getLiveOrderingStatusText()}
                  </span>
                ) : (
                  <span className="num text-xs font-medium text-muted-foreground">
                    Tested in Our Home Kitchen
                  </span>
                )}
              </div>

              {/* Main Headline ("From Our Table to Yours") & Description */}
              <div className="space-y-6 my-auto py-2">
                <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.03]">
                  From Our Table to Yours
                </h1>
                <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-xl">
                  {orderingActive
                    ? 'Home-style Indian curries cooked in small batches and delivered fresh every Monday.'
                    : 'The Indian recipes we grew up with and still cook every week, shared with clear measurements and easy-to-follow steps.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl px-7 h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-none"
                  >
                    <Link href={hasWeeklyRecipes ? '#recipes' : '#all-recipes'}>
                      <span>
                        {hasWeeklyRecipes ? "Explore This Week's Recipes" : 'Explore All Recipes'}
                      </span>
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  {hasWeeklyRecipes ? (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-xl px-6 h-12 text-base font-semibold border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-none"
                    >
                      <Link href="#all-recipes">Browse Full Menu</Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-xl px-6 h-12 text-base font-semibold border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-none"
                    >
                      <Link href="/about">Our Story</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Spice Photograph + Sleek Horizontal Featured Dish Card */}
            <div className="enter-2 lg:col-span-6 flex flex-col gap-5 justify-between">
              <div className="relative flex-1 min-h-[280px] sm:min-h-[320px] rounded-2xl overflow-hidden border border-border bg-card">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/main_image-v2-2048%20(1).jpg?alt=media&token=c8e72a75-16ec-4f4e-91d0-aa0c8835e9f7"
                  alt="Whole Indian spices arranged on spoons with dried chilies and curry leaves"
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint="indian food background"
                />
              </div>

              {leadDish && (
                <div className="taste-card group relative rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-stretch">
                    {/* Flush Left Dish Image (No Floating Vertical Gaps) */}
                    <Link
                      href={`/recipe/${leadDish.id}`}
                      className="relative sm:col-span-4 min-h-[200px] sm:min-h-full overflow-hidden bg-secondary/50 block focus-visible:outline-none"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <Image
                        src={leadDish.imageUrl}
                        alt={leadDish.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 220px"
                        className="taste-photo object-cover"
                        data-ai-hint={leadDish.imageHint || leadDish.name.toLowerCase()}
                      />
                    </Link>

                    {/* Structured 3-Row Right Content Column */}
                    <div className="sm:col-span-8 p-5 sm:p-6 flex flex-col justify-between gap-3.5">
                      {/* Row 1: Featured Pill + Rating / Price */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/25 border border-accent/40 px-3 py-0.5 text-xs font-semibold text-foreground">
                          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                          <span>
                            {orderingActive && leadDish.isWeekly
                              ? 'On the Stove This Week'
                              : 'Featured Recipe'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <div
                            className="num inline-flex items-center gap-1 text-xs font-bold text-foreground"
                            aria-label={`Rated ${(leadDish.rating || 5).toFixed(1)} out of 5 stars`}
                          >
                            <Star className="h-3.5 w-3.5 text-accent fill-accent" aria-hidden="true" />
                            <span>{(leadDish.rating || 5).toFixed(1)}</span>
                          </div>
                          {orderingActive && leadDish.price > 0 && (
                            <span className="num text-sm font-bold text-foreground border-l border-border pl-2.5">
                              ${Number(leadDish.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Dish Title & 2-Line Description */}
                      <div className="space-y-1">
                        <Link
                          href={`/recipe/${leadDish.id}`}
                          className="font-headline text-xl sm:text-2xl font-medium text-foreground hover:text-primary transition-colors block leading-snug focus-visible:outline-none focus-visible:underline"
                        >
                          {leadDish.name}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {leadDish.description?.replace(/\.{4,}$/, '...')}
                        </p>
                      </div>

                      {/* Row 3: Ruled Footer with Badges Left + CTA Anchored Right */}
                      <div className="flex items-center justify-between gap-3 border-t border-border/80 pt-3.5 mt-0.5">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          <Badge
                            variant="outline"
                            className="gap-1 text-xs font-medium bg-secondary/60 text-foreground border-border"
                          >
                            {leadDish.diet === 'Veg' ? (
                              <Leaf className="h-3 w-3 text-primary" aria-hidden="true" />
                            ) : (
                              <Drumstick className="h-3 w-3 text-primary" aria-hidden="true" />
                            )}
                            {leadDish.diet === 'Veg' ? 'Vegetarian' : 'Meat & Poultry'}
                          </Badge>
                          <Badge variant="outline" className="gap-1 text-xs bg-background">
                            <MapPin className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                            {leadDish.region}
                          </Badge>
                          {leadDish.spice && <SpiceLevel spice={leadDish.spice} />}
                        </div>

                        <Button
                          asChild
                          size="sm"
                          className="h-10 rounded-xl px-4 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-none shrink-0"
                        >
                          <Link href={`/recipe/${leadDish.id}`}>
                            <span>View Recipe</span>
                            <ArrowRight
                              className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Screen 2: Weekly Kitchen Cadence & 6-Day Board (When Ordering Active) */}
      {orderingActive && (
        <section
          aria-label="How Let's Cook Curry Works"
          className="border-b border-border bg-background py-16 lg:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h2 className="font-headline text-3xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.06]">
                  How Weekly Ordering Works
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Place your order between Monday and Thursday for fresh delivery the following Monday.
                </p>
              </div>

              <div className="lg:col-span-7 border-t-2 border-primary divide-y divide-border">
                <div className="py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:w-56 shrink-0">
                    <span className="num inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground">
                      01
                    </span>
                    <span className="num text-sm font-semibold text-foreground">
                      Monday to Thursday
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-headline text-xl font-medium text-foreground">
                      Choose Your Dishes
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Browse the weekly menu and place your order between Monday and Thursday.
                    </p>
                  </div>
                </div>

                <div className="py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:w-56 shrink-0">
                    <span className="num inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground">
                      02
                    </span>
                    <span className="num text-sm font-semibold text-foreground">
                      Friday to Sunday
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-headline text-xl font-medium text-foreground">
                      Prepared to Order
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Each dish is cooked fresh in small batches over the weekend.
                    </p>
                  </div>
                </div>

                <div className="py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:w-56 shrink-0">
                    <span className="num inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                      03
                    </span>
                    <span className="num text-sm font-semibold text-foreground">
                      Following Monday
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-headline text-xl font-medium text-foreground">
                      Monday Delivery
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Your order arrives on Monday, ready to heat and serve.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6-Day Weekly Kitchen Board */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
              {SCHEDULE_DAYS.map((slot) => (
                <div
                  key={slot.day}
                  className={
                    slot.highlight
                      ? 'rounded-xl bg-accent text-accent-foreground p-5 flex flex-col justify-between gap-4 border border-border'
                      : slot.active
                        ? 'rounded-xl bg-card p-5 border border-border flex flex-col justify-between gap-4'
                        : 'rounded-xl bg-primary text-primary-foreground p-5 flex flex-col justify-between gap-4'
                  }
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="opacity-85">
                      {slot.highlight
                        ? 'Delivery Day'
                        : slot.active
                          ? 'Orders Open'
                          : 'Kitchen Prep'}
                    </span>
                    <span className="num opacity-65">{slot.step}</span>
                  </div>
                  <div>
                    <p className="font-headline text-xl font-medium">{slot.day}</p>
                    <p className="text-xs mt-1 opacity-85 leading-relaxed">{slot.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Screen 3: Sticky Rail + Weekly Menu Curries */}
      {hasWeeklyRecipes && (
        <section
          id="recipes"
          className="border-b border-border bg-secondary/45 py-16 lg:py-24 scroll-mt-16"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl font-medium font-headline tracking-tight text-foreground sm:text-5xl">
                    This Week&apos;s Curries
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Select your favorite meals for the week. All orders are delivered fresh on the following Monday.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 space-y-3.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dishes available</span>
                    <span className="num font-bold text-foreground">{weeklyRecipes.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-border pt-3.5">
                    <span className="text-muted-foreground">Ordering status</span>
                    <span className="font-semibold text-foreground">{getOrderingWindowLabel()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-border pt-3.5">
                    <span className="text-muted-foreground">Delivery day</span>
                    <span className="font-semibold text-primary">Every Monday</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <RecipeGrid recipes={weeklyRecipes} cardType="cart" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Screen 4: Full Recipe Collection */}
      <section
        id="all-recipes"
        className="container mx-auto px-4 pb-20 sm:px-6 lg:pb-28 pt-16 lg:pt-24 scroll-mt-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-10 pb-6 border-b border-border">
          <div className="lg:col-span-6 space-y-2">
            <h2 className="text-3xl font-medium font-headline tracking-tight text-foreground sm:text-5xl">
              {orderingActive ? 'Explore Our Full Menu' : 'Explore Our Recipe Collection'}
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {orderingActive
                ? 'Craving something different? Filter by region, dietary preference, or spice level to browse our entire collection of authentic recipes.'
                : 'Filter by region, dietary preference, or spice level to browse our complete collection of authentic Indian home recipes.'}
            </p>
          </div>
        </div>
        <FilteredRecipeGrid recipes={allRecipes} />
      </section>
    </>
  );
}
