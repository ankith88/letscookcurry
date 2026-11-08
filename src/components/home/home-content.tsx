"use client";

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarClock,
  ChefHat,
  Drumstick,
  Leaf,
  MapPin,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { FilteredRecipeGrid } from '@/components/recipes/filtered-recipe-grid';
import { SpiceLevel } from '@/components/recipes/spice-level';
import { useSiteSettings } from '@/context/site-settings-context';
import type { Recipe, SiteSettings } from '@/lib/types';

const SCHEDULE_DAYS = [
  { day: 'Monday', role: 'New weekly menu drops at 8am', active: true },
  { day: 'Tuesday', role: 'Ordering open all day', active: true },
  { day: 'Wednesday', role: 'Ordering open all day', active: true },
  { day: 'Thursday', role: 'Final weekly order cutoff', active: true },
  { day: 'Fri to Sun', role: 'Whole spices roasted & simmered', active: false },
  { day: 'Next Monday', role: 'Fresh delivery to your door', highlight: true },
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

  const getHeroOrderBannerText = () => {
    if (!orderingActive) {
      return 'Authentic Home-Style Indian Recipe Collection';
    }
    if (orderWindowMode === 'open') {
      return 'Orders are currently open — fresh Monday delivery.';
    }
    if (orderWindowMode === 'closed') {
      return 'Ordering is currently paused — browse our menu below.';
    }
    return 'Orders open Monday to Thursday, delivered fresh Monday.';
  };

  const getOrderingWindowLabel = () => {
    if (orderWindowMode === 'open') return 'Open Now';
    if (orderWindowMode === 'closed') return 'Currently Closed';
    return isOrdersOpen ? 'Open (Mon–Thu)' : 'Closed (Open Mon–Thu)';
  };

  return (
    <>
      {/* Split Studio Diptych Hero */}
      <section className="relative border-b border-border/80 bg-background py-8 sm:py-12 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[540px]">
            {/* Left Half: Deep Curry-Leaf Architectural Studio Panel */}
            <div className="diptych-left lg:col-span-6 rounded-2xl bg-leaf text-leaf-ink p-8 sm:p-10 lg:p-12 flex flex-col justify-between gap-10">
              <div className="flex items-center justify-between gap-4 border-b border-leaf-ink/20 pb-5 text-sm">
                <span className="font-semibold">Sydney Culinary Studio</span>
                <span className="num text-leaf-ink/80">{getHeroOrderBannerText()}</span>
              </div>

              <div className="space-y-6 my-auto">
                <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-leaf-ink leading-[1.02]">
                  From Our Kitchen to Yours
                </h1>
                <p className="text-lg sm:text-xl text-leaf-ink/85 leading-relaxed max-w-lg">
                  {orderingActive
                    ? 'Small-batch Indian curries roasted from whole spices, delivered fresh every Monday.'
                    : 'Explore our family collection of authentic regional Indian curries, roasted from whole spices and crafted for home kitchens.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl px-7 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  >
                    <Link href={hasWeeklyRecipes ? '#recipes' : '#all-recipes'}>
                      {hasWeeklyRecipes ? "Explore This Week's Recipes" : 'Explore All Recipes'}
                    </Link>
                  </Button>
                  {hasWeeklyRecipes && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-xl px-6 text-base font-semibold border-leaf-ink/35 bg-transparent text-leaf-ink hover:bg-leaf-ink/10 hover:text-leaf-ink"
                    >
                      <Link href="#all-recipes">Browse Full Menu</Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-leaf-ink/20 pt-5 text-sm">
                <div>
                  <p className="text-xs text-leaf-ink/70">
                    {orderingActive ? 'Weekly rotation' : 'Featured dishes'}
                  </p>
                  <p className="num font-headline text-xl font-bold text-leaf-ink mt-0.5">
                    {orderingActive
                      ? hasWeeklyRecipes
                        ? `${weeklyRecipes.length} Curries`
                        : 'Fresh Menu'
                      : `${weeklyRecipes.length || allRecipes.length} Curries`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-leaf-ink/70">Recipe archive</p>
                  <p className="num font-headline text-xl font-bold text-leaf-ink mt-0.5">
                    {allRecipes.length} Dishes
                  </p>
                </div>
                <div>
                  <p className="text-xs text-leaf-ink/70">Regions covered</p>
                  <p className="num font-headline text-xl font-bold text-leaf-ink mt-0.5">
                    4 Regions
                  </p>
                </div>
              </div>
            </div>

            {/* Right Half: Unobstructed Culinary Proof Panel */}
            <div className="diptych-right lg:col-span-6 flex flex-col gap-5 justify-between">
              <div className="relative flex-1 min-h-[340px] rounded-2xl overflow-hidden border border-border bg-card">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/main_image-v2-2048%20(1).jpg?alt=media&token=c8e72a75-16ec-4f4e-91d0-aa0c8835e9f7"
                  alt="An assortment of delicious Indian curries and spices"
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint="indian food background"
                />
              </div>

              {leadDish && (
                <div className="group relative rounded-2xl border border-primary/35 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-primary/60 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                    {/* Dish Thumbnail */}
                    <Link
                      href={`/recipe/${leadDish.id}`}
                      className="relative h-44 sm:h-28 sm:w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40 block"
                    >
                      <Image
                        src={leadDish.imageUrl}
                        alt={leadDish.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={leadDish.imageHint || leadDish.name.toLowerCase()}
                      />
                      <div
                        className="num absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/95 backdrop-blur-sm px-2 py-0.5 text-[11px] font-bold text-foreground shadow-sm border border-border/80"
                        aria-label={`Rated ${(leadDish.rating || 5).toFixed(1)} out of 5 stars`}
                      >
                        <Star className="h-3 w-3 text-primary fill-primary" aria-hidden="true" />
                        <span>{(leadDish.rating || 5).toFixed(1)}</span>
                      </div>
                    </Link>

                    {/* Dish Details & Metadata */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-foreground">
                          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                          <span>
                            {orderingActive && leadDish.isWeekly
                              ? 'On the Stove This Week'
                              : 'Featured Recipe'}
                          </span>
                        </div>
                        {orderingActive && leadDish.price > 0 && (
                          <span className="num text-sm font-bold text-foreground">
                            ${Number(leadDish.price).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div>
                        <Link
                          href={`/recipe/${leadDish.id}`}
                          className="font-headline text-xl sm:text-2xl font-bold text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {leadDish.name}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                          {leadDish.description?.replace(/\.{4,}$/, '...')}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className="gap-1 text-xs font-medium bg-secondary/50 text-foreground border-border"
                          >
                            {leadDish.diet === 'Veg' ? (
                              <Leaf className="h-3 w-3 text-primary" aria-hidden="true" />
                            ) : (
                              <Drumstick className="h-3 w-3 text-primary" aria-hidden="true" />
                            )}
                            {leadDish.diet === 'Veg' ? 'Vegetarian' : 'Meat & Poultry'}
                          </Badge>
                          <Badge variant="outline" className="gap-1 text-xs">
                            <MapPin className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                            {leadDish.region}
                          </Badge>
                          {leadDish.spice && <SpiceLevel spice={leadDish.spice} />}
                        </div>

                        <Button
                          asChild
                          size="sm"
                          className="w-full sm:w-auto rounded-xl px-4 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shrink-0"
                        >
                          <Link href={`/recipe/${leadDish.id}`}>
                            <span>View Recipe</span>
                            <ArrowRight
                              className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
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

      {/* Diptych Section 2: Scrub-Linked Statement, Ruled Schedule & 6-Day Kitchen Board (Only when Ordering Process is Active) */}
      {orderingActive && (
        <section
          aria-label="How Let's Cook Curry Works"
          className="border-b border-border/80 bg-background py-16 lg:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h2 className="statement-wipe font-headline text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.06]">
                  One kitchen schedule, three deliberate steps.
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Every batch is roasted and slow-cooked to order in Sydney so your Monday table gets freshly tempered spices.
                </p>
              </div>

              <div className="lg:col-span-7 border-t-2 border-foreground divide-y divide-border">
                <div className="py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:w-56 shrink-0">
                    <CalendarClock className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                    <span className="num text-sm font-bold text-foreground">Monday to Thursday</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-headline text-xl font-bold text-foreground">
                      1. Weekly Menu Drops Monday
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Explore our curated rotating menu and place your order between Monday and Thursday.
                    </p>
                  </div>
                </div>

                <div className="py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:w-56 shrink-0">
                    <ChefHat className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                    <span className="num text-sm font-bold text-foreground">Friday to Sunday</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-headline text-xl font-bold text-foreground">
                      2. Handcrafted with Whole Spices
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Slow-simmered in small batches using authentic family recipes from across India.
                    </p>
                  </div>
                </div>

                <div className="py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:w-56 shrink-0">
                    <Truck className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                    <span className="num text-sm font-bold text-foreground">Following Monday</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-headline text-xl font-bold text-foreground">
                      3. Delivered Fresh Next Monday
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Your meals arrive fresh on Monday, ready to heat, serve, and enjoy around your table.
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
                      ? 'rounded-2xl bg-primary text-primary-foreground p-5 flex flex-col justify-between gap-3 shadow-sm'
                      : slot.active
                      ? 'rounded-2xl bg-card p-5 border-2 border-primary/45 flex flex-col justify-between gap-3'
                      : 'rounded-2xl bg-leaf text-leaf-ink p-5 flex flex-col justify-between gap-3'
                  }
                >
                  <span className="text-xs font-bold opacity-80">
                    {slot.highlight ? 'Delivery Day' : slot.active ? 'Orders Open' : 'Kitchen Prep'}
                  </span>
                  <div>
                    <p className="font-headline text-xl font-bold">{slot.day}</p>
                    <p className="text-xs mt-1 opacity-85">{slot.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Diptych Section 3: Sticky Left Studio Rail + Scrolling Weekly Curries (Only when Ordering Process is Active) */}
      {hasWeeklyRecipes && (
        <section
          id="recipes"
          className="border-b border-border/80 bg-secondary/25 py-16 lg:py-24 scroll-mt-16"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
                    This Week&apos;s Curries
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Select your favorite meals for the week. All orders are delivered fresh on the following Monday.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dishes available</span>
                    <span className="num font-bold text-foreground">{weeklyRecipes.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-border/60 pt-3">
                    <span className="text-muted-foreground">Ordering status</span>
                    <span className="font-semibold text-foreground">{getOrderingWindowLabel()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-border/60 pt-3">
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

      {/* Diptych Section 4: Full Archive Index */}
      <section
        id="all-recipes"
        className="container mx-auto px-4 pb-20 sm:px-6 lg:pb-28 pt-16 lg:pt-24 scroll-mt-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
              {orderingActive ? 'Explore Our Full Menu' : 'Explore Our Recipe Collection'}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base sm:text-lg text-muted-foreground">
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

