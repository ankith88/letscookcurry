"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { OrderWindowMode, Recipe } from '@/lib/types';
import { Star, MapPin, Leaf, Drumstick, ArrowRight, Ban } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { SpiceLevel } from './spice-level';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/context/site-settings-context';

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
          <Ban className="mr-2 h-4 w-4" aria-hidden="true" />{' '}
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

  const effectiveCardType = orderingFeatureEnabled ? cardType : 'view';
  const orderableState: 'loading' | 'orderable' | 'closed' = loading
    ? 'loading'
    : isOrdersOpen
      ? 'orderable'
      : 'closed';

  const isVeg = recipe.diet === 'Veg';
  const ingredientCount = recipe.ingredients?.length || 0;
  const stepCount = recipe.instructions?.length || 0;

  return (
    <Card
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-1 hover:border-primary/50',
        featured && 'md:col-span-2 md:grid md:grid-cols-12'
      )}
    >
      <CardHeader
        className={cn(
          'p-0 relative overflow-hidden bg-muted/40',
          featured ? 'md:col-span-7 min-h-[280px]' : ''
        )}
      >
        <Link
          href={`/recipe/${recipe.id}`}
          className="block h-full overflow-hidden focus-visible:outline-none"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            width={600}
            height={450}
            className={cn(
              'w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]',
              featured ? 'aspect-[4/3] md:aspect-auto md:h-full' : 'aspect-[4/3]'
            )}
            data-ai-hint={recipe.imageHint}
          />
        </Link>
        {orderingFeatureEnabled && recipe.isWeekly && (
          <div className="num absolute top-3.5 right-3.5 rounded-full bg-background/95 backdrop-blur-sm px-3.5 py-1 text-sm font-bold text-foreground border border-border">
            ${Number(recipe.price).toFixed(2)}
          </div>
        )}
      </CardHeader>

      <div className={cn('flex flex-1 flex-col', featured ? 'md:col-span-5 justify-between' : '')}>
        <CardContent className="flex-1 flex flex-col p-6">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <CardTitle
              className={cn(
                'font-headline font-bold leading-snug tracking-tight',
                featured ? 'text-2xl sm:text-3xl' : 'text-xl'
              )}
            >
              <Link
                href={`/recipe/${recipe.id}`}
                className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
              >
                {recipe.name}
              </Link>
            </CardTitle>
            <Badge
              variant="secondary"
              className="num flex items-center gap-1 shrink-0 font-semibold"
              aria-label={`Rated ${(recipe.rating || 0).toFixed(1)} out of 5 stars`}
            >
              <Star className="w-3.5 h-3.5 text-accent fill-accent" aria-hidden="true" />
              <span>{(recipe.rating || 0).toFixed(1)}</span>
            </Badge>
          </div>

          <p
            className={cn(
              'text-muted-foreground text-sm leading-relaxed mb-5',
              featured ? 'line-clamp-3 text-base' : 'line-clamp-2'
            )}
          >
            {recipe.description}
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
                  <Leaf className="w-3 h-3 text-primary" aria-hidden="true" />
                ) : (
                  <Drumstick className="w-3 h-3 text-primary" aria-hidden="true" />
                )}
                {isVeg ? 'Vegetarian' : 'Meat & Poultry'}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <MapPin className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                {recipe.region}
              </Badge>
              {recipe.spice && <SpiceLevel spice={recipe.spice} />}
            </div>

            {featured && (ingredientCount > 0 || stepCount > 0) && (
              <div className="num flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
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
                <Link href={`/recipe/${recipe.id}`}>
                  <span>Read Full Recipe &amp; Method</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="w-full h-11 font-semibold rounded-xl border border-border bg-secondary/70 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
              variant="secondary"
            >
              <Link href={`/recipe/${recipe.id}`}>
                <span>View Recipe</span>
                <ArrowRight
                  className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
