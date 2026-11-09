"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { OrderWindowMode, Recipe } from '@/lib/types';
import {
  Star,
  MapPin,
  Leaf,
  Drumstick,
  ArrowRight,
  Ban,
  UtensilsCrossed,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { SpiceLevel } from './spice-level';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/context/site-settings-context';

const RATING_FORMATTER = new Intl.NumberFormat('en-AU', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const PRICE_FORMATTER = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

interface RecipeCardProps {
  recipe: Recipe;
  cardType: 'cart' | 'view';
  featured?: boolean;
}

function CartAction({
  recipe,
  orderableState,
  orderWindowMode,
}: {
  recipe: Recipe;
  orderableState: 'loading' | 'orderable' | 'closed';
  orderWindowMode: OrderWindowMode;
}) {
  switch (orderableState) {
    case 'loading':
      return <Skeleton className="h-11 w-full rounded-xl" />;
    case 'orderable':
      return <AddToCartButton recipe={recipe} />;
    case 'closed':
      return (
        <Button className="w-full h-11 rounded-xl font-medium" variant="secondary" disabled>
          <Ban className="me-2 h-4 w-4 shrink-0" aria-hidden="true" />{' '}
          {orderWindowMode === 'closed'
            ? 'Ordering Currently Closed'
            : 'Ordering Closed (Monday to Thursday)'}
        </Button>
      );
  }
}

export function RecipeCard({ recipe, cardType, featured = false }: RecipeCardProps) {
  const {
    orderingFeatureEnabled,
    orderWindowMode,
    isOrdersOpen,
    loading,
  } = useSiteSettings();
  const [imageFailed, setImageFailed] = useState(false);

  const effectiveCardType = orderingFeatureEnabled ? cardType : 'view';
  const orderableState: 'loading' | 'orderable' | 'closed' = loading
    ? 'loading'
    : isOrdersOpen
      ? 'orderable'
      : 'closed';

  const isVeg = recipe.diet === 'Veg';
  const ingredientCount = recipe.ingredients?.length || 0;
  const stepCount = recipe.instructions?.length || 0;
  const recipeHref = recipe.id ? `/recipe/${encodeURIComponent(recipe.id)}` : '#all-recipes';
  const hasValidImage = Boolean(recipe.imageUrl?.trim()) && !imageFailed;

  const rawRating = Number(recipe.rating);
  const clampedRating =
    Number.isFinite(rawRating) && rawRating > 0
      ? Math.min(5, Math.max(1, rawRating))
      : 5;
  const formattedRating = RATING_FORMATTER.format(clampedRating);

  const rawPrice = Number(recipe.price);
  const formattedPrice =
    Number.isFinite(rawPrice) && rawPrice > 0
      ? PRICE_FORMATTER.format(rawPrice)
      : null;

  return (
    <Card
      className={cn(
        'taste-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-none hover:border-primary/50 min-w-0',
        featured && 'md:col-span-2 md:grid md:grid-cols-12'
      )}
    >
      <CardHeader
        className={cn(
          'p-0 relative overflow-hidden bg-secondary/50',
          featured ? 'md:col-span-7 min-h-[260px]' : ''
        )}
      >
        <Link
          href={recipeHref}
          className="block h-full overflow-hidden focus-visible:outline-none"
          tabIndex={-1}
          aria-hidden="true"
        >
          {hasValidImage ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              width={600}
              height={450}
              sizes={
                featured
                  ? '(max-width: 768px) 100vw, 55vw'
                  : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              }
              onError={() => setImageFailed(true)}
              className={cn(
                'taste-photo w-full object-cover',
                featured ? 'aspect-[4/3] md:aspect-auto md:h-full' : 'aspect-[4/3]'
              )}
              data-ai-hint={recipe.imageHint}
            />
          ) : (
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-2 bg-secondary/75 p-6 text-center',
                featured ? 'aspect-[4/3] md:aspect-auto md:h-full' : 'aspect-[4/3]'
              )}
            >
              <UtensilsCrossed className="h-8 w-8 text-primary/80" aria-hidden="true" />
              <span className="text-xs font-medium text-muted-foreground line-clamp-2 break-words">
                {recipe.name}
              </span>
            </div>
          )}
        </Link>
        {orderingFeatureEnabled && recipe.isWeekly && formattedPrice && (
          <div className="num absolute top-3.5 end-3.5 rounded-full bg-background/95 backdrop-blur-sm px-3.5 py-1 text-sm font-bold text-foreground border border-border">
            {formattedPrice}
          </div>
        )}
      </CardHeader>

      <div className={cn('flex flex-1 flex-col min-w-0', featured ? 'md:col-span-5 justify-between' : '')}>
        <CardContent className="flex-1 flex flex-col p-6 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2.5 min-w-0">
            <CardTitle
              className={cn(
                'font-headline font-bold leading-snug tracking-tight min-w-0',
                featured ? 'text-2xl sm:text-3xl' : 'text-xl'
              )}
            >
              <Link
                href={recipeHref}
                className="hover:text-primary transition-colors block break-words [overflow-wrap:anywhere] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:underline"
              >
                {recipe.name}
              </Link>
            </CardTitle>
            <Badge
              variant="secondary"
              className="num flex items-center gap-1 shrink-0 font-semibold"
              aria-label={`Rated ${formattedRating} out of 5 stars`}
            >
              <Star className="w-3.5 h-3.5 shrink-0 text-accent fill-accent" aria-hidden="true" />
              <span>{formattedRating}</span>
            </Badge>
          </div>

          <p
            className={cn(
              'text-muted-foreground text-sm leading-relaxed mb-5 break-words [overflow-wrap:anywhere]',
              featured ? 'line-clamp-3 text-base' : 'line-clamp-2'
            )}
          >
            {recipe.description?.replace(/\.{4,}$/, '...')}
          </p>

          <div className="mt-auto space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'gap-1 font-medium',
                  isVeg
                    ? 'bg-secondary/60 text-foreground border-border'
                    : 'bg-accent/15 text-foreground border-primary/40'
                )}
              >
                {isVeg ? (
                  <Leaf className="w-3 h-3 shrink-0 text-primary" aria-hidden="true" />
                ) : (
                  <Drumstick className="w-3 h-3 shrink-0 text-primary" aria-hidden="true" />
                )}
                <span>{isVeg ? 'Vegetarian' : 'Meat & Poultry'}</span>
              </Badge>
              {recipe.region && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{recipe.region}</span>
                </Badge>
              )}
              {recipe.spice && <SpiceLevel spice={recipe.spice} />}
            </div>

            {featured && (ingredientCount > 0 || stepCount > 0) && (
              <div className="num flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
                <span>{ingredientCount} whole spices &amp; ingredients</span>
                <span>{stepCount} method steps</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col gap-2">
          {effectiveCardType === 'cart' ? (
            <>
              <CartAction
                recipe={recipe}
                orderableState={orderableState}
                orderWindowMode={orderWindowMode}
              />
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full h-9 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <Link href={recipeHref}>
                  <span>Read Full Recipe &amp; Method</span>
                  <ArrowRight
                    className="ms-1.5 h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="w-full h-11 font-semibold rounded-xl border border-border bg-secondary/70 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
              variant="secondary"
            >
              <Link href={recipeHref}>
                <span>View Recipe</span>
                <ArrowRight
                  className="ms-2 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
