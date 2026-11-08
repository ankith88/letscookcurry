"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  MapPin,
  Leaf,
  Drumstick,
  Ban,
  ArrowLeft,
  Check,
  ChefHat,
  MessageSquare,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { RatingForm } from '@/components/recipes/rating-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { Recipe, Rating } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { event } from '@/lib/gtag';
import { SpiceLevel } from '@/components/recipes/spice-level';
import { useSiteSettings } from '@/context/site-settings-context';

interface RecipeClientPageProps {
  initialRecipe: Recipe;
  initialRatings: Rating[];
}

function formatReviewDate(isoDate?: string): string | null {
  if (!isoDate) return null;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RecipeClientPage({ initialRecipe, initialRatings }: RecipeClientPageProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [ratings, setRatings] = useState(initialRatings);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const {
    orderingFeatureEnabled,
    orderWindowMode,
    isOrdersOpen,
    loading: settingsLoading,
  } = useSiteSettings();

  const orderableState: 'loading' | 'orderable' | 'closed' = settingsLoading
    ? 'loading'
    : isOrdersOpen
      ? 'orderable'
      : 'closed';

  const storageKey = recipe?.id ? `lets_cook_curry_prep_${recipe.id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setCheckedIngredients(parsed);
        }
      }
    } catch {
      // Ignore sessionStorage errors in restricted browsing modes
    }
  }, [storageKey]);

  useEffect(() => {
    if (recipe) {
      event({
        action: 'view_recipe',
        category: 'engagement',
        label: recipe.name,
        value: 1,
      });
    }
  }, [recipe]);

  const handleReviewSubmitted = (newRating: Rating) => {
    setRatings((prev) => {
      const updated = [newRating, ...prev];
      const total = updated.reduce((acc, r) => acc + r.rating, 0);
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        rating: total / updated.length,
        reviews: updated.length,
      }));
      return updated;
    });
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = {
        ...prev,
        [index]: !prev[index],
      };
      if (storageKey) {
        try {
          window.sessionStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }
      }
      return next;
    });
  };

  const resetCheckedIngredients = () => {
    setCheckedIngredients({});
    if (storageKey) {
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        // Ignore storage errors
      }
    }
  };

  const renderOrderSection = () => {
    if (!orderingFeatureEnabled || !recipe?.isWeekly) return null;

    return (
      <div className="rounded-2xl bg-leaf text-leaf-ink p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between gap-4 border-b border-leaf-ink/20 pb-3.5 text-sm">
          <span className="inline-flex items-center gap-1.5 font-semibold text-leaf-ink">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>On the Stove This Week</span>
          </span>
          <span className="num text-leaf-ink/80">Delivered fresh Monday</span>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <div className="space-y-1">
            <p className="font-headline text-xl font-bold text-leaf-ink">
              Freshly Simmered Batch
            </p>
            <p className="text-sm text-leaf-ink/80 leading-relaxed">
              Slow-cooked from whole spices in our Sydney kitchen, ready to heat and serve.
            </p>
          </div>
          <span className="num text-3xl sm:text-4xl font-bold font-headline text-leaf-ink shrink-0">
            ${Number(recipe.price).toFixed(2)}
          </span>
        </div>

        {orderableState === 'loading' && <Skeleton className="h-11 w-full rounded-xl bg-leaf-ink/15" />}
        {orderableState === 'orderable' && <AddToCartButton recipe={recipe} onLeaf />}
        {orderableState === 'closed' && (
          <Button
            size="lg"
            variant="secondary"
            className="h-11 w-full rounded-xl font-semibold bg-leaf-ink/15 text-leaf-ink border border-leaf-ink/25"
            disabled
          >
            <Ban className="mr-2 h-4 w-4" aria-hidden="true" />
            {orderWindowMode === 'closed'
              ? 'Ordering Currently Closed'
              : 'Ordering Closed (Monday to Thursday)'}
          </Button>
        )}
      </div>
    );
  };

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold font-headline">Recipe not found</h1>
        <p className="mt-2 text-muted-foreground">The recipe you are looking for does not exist.</p>
        <Button asChild className="mt-6 rounded-xl h-11 px-6 font-semibold">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  const isVeg = recipe.diet === 'Veg';
  const totalIngredients = recipe.ingredients?.length || 0;
  const totalSteps = recipe.instructions?.length || 0;
  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
  const backHref = orderingFeatureEnabled && recipe.isWeekly ? '/#recipes' : '/#all-recipes';
  const backLabel =
    orderingFeatureEnabled && recipe.isWeekly ? "Back to This Week's Curries" : 'Back to Recipe Collection';

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-14 lg:space-y-20">
      {/* Back Navigation */}
      <div>
        <Button
          asChild
          variant="ghost"
          className="h-11 -ml-3 px-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            {backLabel}
          </Link>
        </Button>
      </div>

      {/* Split Studio Hero Overview */}
      <section aria-label="Recipe overview" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="diptych-left lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              width={900}
              height={675}
              priority
              className="aspect-[4/3] w-full object-cover"
              data-ai-hint={recipe.imageHint}
            />
          </div>
        </div>

        <div className="diptych-right lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="num flex items-center gap-1.5 text-sm font-semibold">
                <Star className="w-3.5 h-3.5 text-accent fill-accent" aria-hidden="true" />
                <span>
                  {(recipe.rating || 0).toFixed(1)} ({recipe.reviews || 0}{' '}
                  {recipe.reviews === 1 ? 'review' : 'reviews'})
                </span>
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'gap-1.5 text-sm font-medium',
                  isVeg
                    ? 'bg-secondary/60 text-foreground border-border'
                    : 'bg-accent/15 text-foreground border-primary/40'
                )}
              >
                {isVeg ? (
                  <Leaf className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                ) : (
                  <Drumstick className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                )}
                {isVeg ? 'Vegetarian' : 'Meat & Poultry'}
              </Badge>
              <Badge variant="outline" className="gap-1.5 text-sm">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                {recipe.region} India
              </Badge>
              {recipe.spice && <SpiceLevel spice={recipe.spice} />}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline tracking-tight text-foreground leading-[1.04]">
              {recipe.name}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {recipe.longDescription}
            </p>
          </div>

          {/* Ruled Culinary Specs Strip */}
          <div className="grid grid-cols-3 gap-4 border-y border-border py-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Ingredients</p>
              <p className="num font-headline text-lg font-bold text-foreground mt-0.5">
                {totalIngredients} Items
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kitchen Method</p>
              <p className="num font-headline text-lg font-bold text-foreground mt-0.5">
                {totalSteps} Steps
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Regional Style</p>
              <p className="font-headline text-lg font-bold text-foreground mt-0.5">
                {recipe.region} India
              </p>
            </div>
          </div>

          {renderOrderSection()}
        </div>
      </section>

      {/* Editorial Kitchen Spread: Sticky Left Ingredient Rail + Ruled Method Column */}
      <section
        aria-label="Ingredients and cooking method"
        className="border-t border-border pt-12 lg:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
      >
        <div className="lg:col-span-5 lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline flex items-center gap-2.5 text-foreground">
                <Leaf className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <span>Ingredients</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Tap each ingredient to check it off as you prep.
              </p>
            </div>

            {totalIngredients > 0 && (
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="num text-xs font-bold text-foreground bg-secondary/70 px-2.5 py-1 rounded-full border border-border">
                  {checkedCount} / {totalIngredients}
                </span>
                {checkedCount > 0 && (
                  <button
                    type="button"
                    onClick={resetCheckedIngredients}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-visible:outline-none"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>

          <ul className="space-y-1.5">
            {recipe.ingredients?.map((ingredient, index) => {
              const isChecked = !!checkedIngredients[index];
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => toggleIngredient(index)}
                    aria-pressed={isChecked}
                    className={cn(
                      'flex w-full min-h-[44px] items-center gap-3.5 rounded-xl px-3 py-2.5 text-left text-sm sm:text-base transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isChecked && 'text-muted-foreground line-through bg-muted/40'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                        isChecked
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-border bg-background'
                      )}
                    >
                      {isChecked && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="leading-snug">{ingredient}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-bold font-headline flex items-center gap-3 text-foreground">
              <ChefHat className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
              <span>Step-by-Step Method</span>
            </h2>
            <p className="text-base text-muted-foreground">
              Have your ingredients prepped and within reach before you turn on the stove.
            </p>
          </div>

          <ol className="border-t-2 border-foreground divide-y divide-border">
            {recipe.instructions?.map((step, index) => (
              <li key={index} className="py-6 flex items-start gap-4 sm:gap-5">
                <div
                  aria-hidden="true"
                  className="num flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mt-0.5"
                >
                  {index + 1}
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-foreground/90">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Editorial Community Reviews & Rating Spread */}
      <section
        aria-label="Community reviews and ratings"
        className="border-t border-border pt-12 lg:pt-16 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
      >
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
          <div className="space-y-1.5 border-b border-border pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">
              Rate this Recipe
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {orderingFeatureEnabled
                ? `Tried cooking or ordering ${recipe.name}? Share your tasting notes with the community.`
                : `Tried cooking ${recipe.name}? Share your tasting notes with the community.`}
            </p>
          </div>

          <RatingForm recipeId={recipe.id} onReviewSubmitted={handleReviewSubmitted} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-bold font-headline flex items-center gap-3 text-foreground">
              <MessageSquare className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
              <span className="num">Community Tasting Notes ({ratings.length})</span>
            </h2>
            <p className="text-base text-muted-foreground">
              Feedback and kitchen tips from home cooks and weekly subscribers.
            </p>
          </div>

          <div className="border-t-2 border-foreground divide-y divide-border">
            {ratings.length > 0 ? (
              ratings.map((rating, index) => {
                const formattedDate = formatReviewDate(rating.createdAt);
                return (
                  <div
                    key={`${rating.createdAt || 'review'}-${index}`}
                    className="py-6 flex gap-4 items-start"
                  >
                    <Avatar className="border border-border shrink-0" aria-hidden="true">
                      <AvatarFallback className="num bg-primary/15 text-foreground font-bold text-sm">
                        {rating.rating}★
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div
                          className="flex items-center gap-1"
                          aria-label={`Rated ${rating.rating} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              aria-hidden="true"
                              className={cn(
                                'w-4 h-4',
                                i < rating.rating
                                  ? 'text-accent fill-accent'
                                  : 'text-muted-foreground/30'
                              )}
                            />
                          ))}
                        </div>
                        {formattedDate && (
                          <span className="num text-xs text-muted-foreground">
                            {formattedDate}
                          </span>
                        )}
                      </div>
                      {rating.comment ? (
                        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                          {rating.comment}
                        </p>
                      ) : (
                        <p className="text-xs italic text-muted-foreground">
                          Left a {rating.rating}-star rating.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <p className="text-base text-muted-foreground">
                  No tasting notes yet. Be the first to share how your curry turned out!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
