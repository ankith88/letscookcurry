"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { OrderWindowMode, Recipe } from '@/lib/types';
import { Star, PlusCircle, MapPin, Leaf, Drumstick, Eye, Ban } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Skeleton } from '../ui/skeleton';
import { SpiceLevel } from './spice-level';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/context/site-settings-context';

interface RecipeCardProps {
  recipe: Recipe;
  cardType: 'cart' | 'view';
  featured?: boolean;
}

function CartButton({
  recipe,
  orderableState,
  orderWindowMode,
}: {
  recipe: Recipe;
  orderableState: 'loading' | 'orderable' | 'closed';
  orderWindowMode: OrderWindowMode;
}) {
  const { addItem } = useCart();

  switch (orderableState) {
    case 'loading':
      return <Skeleton className="h-11 w-full rounded-xl" />;
    case 'orderable':
      return (
        <Button className="w-full h-11 font-semibold rounded-xl" onClick={() => addItem(recipe)}>
          <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" /> Add to Cart
        </Button>
      );
    case 'closed':
      return (
        <Button className="w-full h-11 rounded-xl" variant="secondary" disabled>
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

  return (
    <Card
      className={cn(
        'group flex flex-col overflow-hidden border-border/80 bg-card transition-transform duration-200 hover:-translate-y-1',
        featured && 'md:col-span-2 md:grid md:grid-cols-12'
      )}
    >
      <CardHeader
        className={cn(
          'p-0 relative overflow-hidden bg-muted/40',
          featured ? 'md:col-span-7 min-h-[260px]' : ''
        )}
      >
        <Link href={`/recipe/${recipe.id}`} className="block h-full overflow-hidden">
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            width={600}
            height={450}
            className={cn(
              'w-full object-cover',
              featured ? 'aspect-[4/3] md:aspect-auto md:h-full' : 'aspect-[4/3]'
            )}
            data-ai-hint={recipe.imageHint}
          />
        </Link>
        {orderingFeatureEnabled && recipe.isWeekly && orderableState === 'orderable' && (
          <div className="num absolute top-3 right-3 rounded-full bg-background px-3.5 py-1 text-sm font-bold text-foreground shadow-sm border border-border">
            ${Number(recipe.price).toFixed(2)}
          </div>
        )}
      </CardHeader>
      <div className={cn('flex flex-1 flex-col', featured ? 'md:col-span-5 justify-between' : '')}>
        <CardContent className="flex-1 p-6">
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <CardTitle className={cn('font-headline leading-snug', featured ? 'text-2xl' : 'text-xl')}>
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
              <Star className="w-3.5 h-3.5 text-primary fill-primary" aria-hidden="true" />
              <span>{(recipe.rating || 0).toFixed(1)}</span>
            </Badge>
          </div>
          <p className={cn('text-muted-foreground text-sm leading-relaxed mb-5', featured ? 'line-clamp-3' : 'line-clamp-2')}>
            {recipe.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-auto">
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
        </CardContent>
        <CardFooter className="p-6 pt-0">
          {effectiveCardType === 'cart' ? (
            <CartButton
              recipe={recipe}
              orderableState={orderableState}
              orderWindowMode={orderWindowMode}
            />
          ) : (
            <Button asChild className="w-full h-11 font-semibold rounded-xl" variant="secondary">
              <Link href={`/recipe/${recipe.id}`}>
                <Eye className="mr-2 h-4 w-4" aria-hidden="true" /> View Recipe
              </Link>
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
