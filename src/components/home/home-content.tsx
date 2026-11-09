"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Drumstick,
  Leaf,
  MapPin,
  Sparkles,
  Star,
  UtensilsCrossed,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { FilteredRecipeGrid } from '@/components/recipes/filtered-recipe-grid';
import { SpiceLevel } from '@/components/recipes/spice-level';
import { useSiteSettings } from '@/context/site-settings-context';
import type { Recipe, SiteSettings } from '@/lib/types';

const HERO_SPICE_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/main_image-v2-2048%20(1).jpg?alt=media&token=c8e72a75-16ec-4f4e-91d0-aa0c8835e9f7';

const RATING_FORMATTER = new Intl.NumberFormat('en-AU', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const PRICE_FORMATTER = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

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
  const [heroPhotoFailed, setHeroPhotoFailed] = useState(false);
  const [failedDishImageKey, setFailedDishImageKey] = useState<string | null>(null);

  const safeWeeklyRecipes = Array.isArray(weeklyRecipes) ? weeklyRecipes : [];
  const safeAllRecipes = Array.isArray(allRecipes) ? allRecipes : [];
  const effectiveSettings = loading ? initialSettings : settings;
  const orderingActive = Boolean(effectiveSettings?.orderingFeatureEnabled);
  const orderWindowMode = effectiveSettings?.orderWindowMode ?? 'auto';

  const hasWeeklyRecipes = orderingActive && safeWeeklyRecipes.length > 0;
  const configuredFeaturedId = effectiveSettings?.featuredRecipeId?.trim();
  const leadDish =
    (configuredFeaturedId &&
      (safeAllRecipes.find((r) => r?.id === configuredFeaturedId) ||
        safeWeeklyRecipes.find((r) => r?.id === configuredFeaturedId))) ||
    safeAllRecipes.find((r) => r?.isFeatured) ||
    (orderingActive && safeWeeklyRecipes[0]) ||
    safeAllRecipes[0] ||
    null;

  const leadDishId = leadDish?.id?.trim() || '';
  const leadDishHref = leadDishId ? `/recipe/${encodeURIComponent(leadDishId)}` : '#all-recipes';
  const leadDishName = leadDish?.name?.trim() || 'Featured Home-Style Curry';
  const leadDishDescription =
    leadDish?.description?.trim().replace(/\.{4,}$/, '...') ||
    'Traditional home-style Indian curry prepared in small batches with freshly ground whole spices.';
  const leadDishImageUrl = leadDish?.imageUrl?.trim() || '';
  const dishImageKey = `${leadDishId}:${leadDishImageUrl}`;
  const hasValidDishImage = Boolean(leadDishImageUrl) && failedDishImageKey !== dishImageKey;

  const rawRating = Number(leadDish?.rating);
  const clampedRating =
    Number.isFinite(rawRating) && rawRating > 0
      ? Math.min(5, Math.max(1, rawRating))
      : 5;
  const formattedRating = RATING_FORMATTER.format(clampedRating);

  const rawPrice = Number(leadDish?.price);
  const hasValidPrice = orderingActive && Number.isFinite(rawPrice) && rawPrice > 0;
  const formattedPrice = hasValidPrice ? PRICE_FORMATTER.format(rawPrice) : null;

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
        aria-labelledby="hero-heading"
        className="relative border-b border-border bg-background py-8 sm:py-10 lg:py-12"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left 6 Columns: Editorial Warm Saffron & Cream Studio Panel */}
            <div className="enter-1 min-w-0 lg:col-span-6 rounded-2xl border border-border bg-secondary/75 p-6 sm:p-10 lg:p-12 flex flex-col justify-between gap-8">
              {/* Top Header Line inside Hero */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 text-xs sm:text-sm min-w-0">
                <span className="inline-flex items-center gap-2 font-semibold text-primary min-w-0">
                  <Leaf className="h-4 w-4 shrink-0 text-primary fill-primary/20" aria-hidden="true" />
                  <span className="break-words">Home-Style Indian Recipes</span>
                </span>
                {orderingActive ? (
                  <span
                    role="status"
                    aria-live="polite"
                    className="num inline-flex items-center gap-2 rounded-2xl sm:rounded-full bg-card border border-border px-3 py-1 text-xs font-semibold text-foreground max-w-full min-w-0 leading-snug"
                  >
                    <span
                      className={
                        isOrdersOpen
                          ? 'h-2 w-2 shrink-0 rounded-full bg-primary'
                          : 'h-2 w-2 shrink-0 rounded-full bg-accent'
                      }
                      aria-hidden="true"
                    />
                    <span className="break-words">{getLiveOrderingStatusText()}</span>
                  </span>
                ) : (
                  <span className="num text-xs font-medium text-muted-foreground break-words">
                    Tested in Our Home Kitchen
                  </span>
                )}
              </div>

              {/* Main Headline ("From Our Table to Yours") & Description */}
              <div className="space-y-6 my-auto py-2 min-w-0">
                <h1
                  id="hero-heading"
                  className="font-headline text-[clamp(2.2rem,3.6vw+0.75rem,3.75rem)] font-medium tracking-tight text-foreground leading-[1.04] text-balance break-words"
                >
                  From Our Table to Yours
                </h1>
                <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-xl break-words">
                  {orderingActive
                    ? 'Home-style Indian curries cooked in small batches and delivered fresh every Monday.'
                    : 'The Indian recipes we grew up with and still cook every week, shared with clear measurements and easy-to-follow steps.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto min-h-12 h-auto py-2.5 rounded-xl px-7 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-none whitespace-normal text-center"
                  >
                    <Link href={hasWeeklyRecipes ? '#recipes' : '#all-recipes'}>
                      <span>
                        {hasWeeklyRecipes ? "Explore This Week's Recipes" : 'Explore All Recipes'}
                      </span>
                      <ArrowRight
                        className="ms-2 h-4 w-4 shrink-0 rtl:-scale-x-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                  {hasWeeklyRecipes ? (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto min-h-12 h-auto py-2.5 rounded-xl px-6 text-base font-semibold border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-none whitespace-normal text-center"
                    >
                      <Link href="#all-recipes">Browse Full Menu</Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto min-h-12 h-auto py-2.5 rounded-xl px-6 text-base font-semibold border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-none whitespace-normal text-center"
                    >
                      <Link href="/about">Our Story</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Spice Photograph + Sleek Horizontal Featured Dish Card */}
            <div className="enter-2 min-w-0 lg:col-span-6 flex flex-col gap-5 justify-between">
              <div className="relative flex-1 min-h-[240px] sm:min-h-[300px] rounded-2xl overflow-hidden border border-border bg-secondary/60">
                {!heroPhotoFailed ? (
                  <Image
                    src={HERO_SPICE_IMAGE_URL}
                    alt="Whole Indian spices arranged on spoons with dried chilies and curry leaves"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                    onError={() => setHeroPhotoFailed(true)}
                    data-ai-hint="indian food background"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label="Whole Indian spices and fresh curry leaves"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-secondary/85 p-6 text-center text-foreground/80"
                  >
                    <Leaf className="h-8 w-8 text-primary fill-primary/20" aria-hidden="true" />
                    <span className="font-headline text-lg font-medium text-foreground">
                      Whole Spices · Small-Batch Kitchen
                    </span>
                    <span className="text-xs text-muted-foreground max-w-xs">
                      Roasted whole spices, fresh curry leaves, and traditional regional recipes.
                    </span>
                  </div>
                )}
              </div>

              {leadDish ? (
                <div className="taste-card group relative rounded-2xl border border-border bg-card overflow-hidden min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-stretch">
                    {/* Flush Left Dish Image (With Graceful Fallback on Missing/Error) */}
                    <Link
                      href={leadDishHref}
                      className="relative sm:col-span-4 min-h-[200px] sm:min-h-[190px] h-full overflow-hidden bg-secondary/50 block focus-visible:outline-none"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {hasValidDishImage ? (
                        <Image
                          src={leadDishImageUrl}
                          alt={leadDishName}
                          fill
                          sizes="(max-width: 640px) 100vw, 220px"
                          className="taste-photo object-cover"
                          onError={() => setFailedDishImageKey(dishImageKey)}
                          data-ai-hint={leadDish.imageHint || leadDishName.toLowerCase()}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-secondary/75 p-4 text-center">
                          <UtensilsCrossed
                            className="h-7 w-7 text-primary/80"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-medium text-muted-foreground line-clamp-2 break-words">
                            {leadDishName}
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Structured 3-Row Right Content Column */}
                    <div className="sm:col-span-8 min-w-0 p-5 sm:p-6 flex flex-col justify-between gap-3.5">
                      {/* Row 1: Featured Pill + Rating / Price */}
                      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/25 border border-accent/40 px-3 py-0.5 text-xs font-semibold text-foreground max-w-full min-w-0">
                          <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                          <span className="truncate">
                            {orderingActive && leadDish.isWeekly
                              ? 'On the Stove This Week'
                              : 'Featured Recipe'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 ms-auto">
                          <div
                            className="num inline-flex items-center gap-1 text-xs font-bold text-foreground"
                            aria-label={`Rated ${formattedRating} out of 5 stars`}
                          >
                            <Star
                              className="h-3.5 w-3.5 shrink-0 text-accent fill-accent"
                              aria-hidden="true"
                            />
                            <span>{formattedRating}</span>
                          </div>
                          {formattedPrice && (
                            <span className="num text-sm font-bold text-foreground border-s border-border ps-2.5">
                              {formattedPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Dish Title & 2-Line Description */}
                      <div className="space-y-1 min-w-0">
                        <Link
                          href={leadDishHref}
                          className="font-headline text-xl sm:text-2xl font-medium text-foreground hover:text-primary transition-colors block leading-snug line-clamp-2 break-words [overflow-wrap:anywhere] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:underline"
                        >
                          {leadDishName}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                          {leadDishDescription}
                        </p>
                      </div>

                      {/* Row 3: Ruled Footer with Badges Left + CTA Anchored Right */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-3.5 mt-0.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          <Badge
                            variant="outline"
                            className={
                              leadDish.diet === 'Veg'
                                ? 'gap-1 text-xs font-medium bg-secondary/60 text-foreground border-border'
                                : 'gap-1 text-xs font-medium bg-accent/15 text-foreground border-primary/40'
                            }
                          >
                            {leadDish.diet === 'Veg' ? (
                              <Leaf className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                            ) : (
                              <Drumstick className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                            )}
                            <span>{leadDish.diet === 'Veg' ? 'Vegetarian' : 'Meat & Poultry'}</span>
                          </Badge>
                          {leadDish.region && (
                            <Badge variant="outline" className="gap-1 text-xs bg-background">
                              <MapPin
                                className="h-3 w-3 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                              />
                              <span>{leadDish.region}</span>
                            </Badge>
                          )}
                          {leadDish.spice && <SpiceLevel spice={leadDish.spice} />}
                        </div>

                        <Button
                          asChild
                          size="sm"
                          className="w-full sm:w-auto ms-auto min-h-10 h-auto py-2 rounded-xl px-4 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-none shrink-0"
                        >
                          <Link href={leadDishHref}>
                            <span>View Recipe</span>
                            <ArrowRight
                              className="ms-1.5 h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                              aria-hidden="true"
                            />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Kitchen Recipe Collection</span>
                    </div>
                    <h2 className="font-headline text-xl font-medium text-foreground">
                      Fresh Recipes Coming Soon
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We are updating our weekly stove rotation and regional recipe cards.
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="min-h-10 h-auto py-2 rounded-xl px-4 font-semibold border-border bg-secondary/50 text-foreground hover:bg-primary hover:text-primary-foreground shrink-0"
                  >
                    <Link href="/about">Our Story</Link>
                  </Button>
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
                      ? 'min-w-0 rounded-xl bg-accent text-accent-foreground p-5 flex flex-col justify-between gap-4 border border-border'
                      : slot.active
                        ? 'min-w-0 rounded-xl bg-card p-5 border border-border flex flex-col justify-between gap-4'
                        : 'min-w-0 rounded-xl bg-primary text-primary-foreground p-5 flex flex-col justify-between gap-4'
                  }
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                    <span className="opacity-85 truncate">
                      {slot.highlight
                        ? 'Delivery Day'
                        : slot.active
                          ? 'Orders Open'
                          : 'Kitchen Prep'}
                    </span>
                    <span className="num opacity-65 shrink-0">{slot.step}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline text-xl font-medium break-words">{slot.day}</p>
                    <p className="text-xs mt-1 opacity-85 leading-relaxed break-words">{slot.role}</p>
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
                  <h2 className="text-3xl font-medium font-headline tracking-tight text-foreground sm:text-5xl leading-[1.06] text-balance">
                    This Week&apos;s Curries
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Select your favorite meals for the week. All orders are delivered fresh on the following Monday.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 space-y-3.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dishes available</span>
                    <span className="num font-bold text-foreground">{safeWeeklyRecipes.length}</span>
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

              <div className="lg:col-span-8 min-w-0">
                <RecipeGrid recipes={safeWeeklyRecipes} cardType="cart" />
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
            <h2 className="text-3xl font-medium font-headline tracking-tight text-foreground sm:text-5xl leading-[1.06] text-balance">
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
        <FilteredRecipeGrid recipes={safeAllRecipes} />
      </section>
    </>
  );
}
