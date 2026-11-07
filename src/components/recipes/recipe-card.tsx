
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types';
import { Star, PlusCircle, MapPin, Leaf, Drumstick, Eye, Ban } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { SpiceLevel } from './spice-level';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  cardType: 'cart' | 'view';
}

function CartButton({
  recipe,
  orderableState,
}: {
  recipe: Recipe;
  orderableState: 'loading' | 'orderable' | 'closed';
}) {
  const { addItem } = useCart();

  switch (orderableState) {
    case 'loading':
      return <Skeleton className="h-10 w-full" />;
    case 'orderable':
      return (
        <Button className="w-full font-semibold" onClick={() => addItem(recipe)}>
          <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" /> Add to Cart
        </Button>
      );
    case 'closed':
      return (
        <Button className="w-full" variant="secondary" disabled>
          <Ban className="mr-2 h-4 w-4" aria-hidden="true" /> Ordering Closed (Mon–Thu)
        </Button>
      );
  }
}

export function RecipeCard({ recipe, cardType }: RecipeCardProps) {
  const [orderableState, setOrderableState] = useState<'loading' | 'orderable' | 'closed'>('loading');

  useEffect(() => {
    const today = new Date().getDay();
    // Monday to Thursday (1-4)
    setOrderableState(today >= 1 && today <= 4 ? 'orderable' : 'closed');
  }, []);

  const isVeg = recipe.diet === 'Veg';

  return (
    <Card className="group flex flex-col overflow-hidden border-border/70 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative overflow-hidden bg-muted/30">
        <Link href={`/recipe/${recipe.id}`} className="block overflow-hidden">
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            width={600}
            height={450}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            data-ai-hint={recipe.imageHint}
          />
        </Link>
        {recipe.isWeekly && orderableState === 'orderable' && (
          <div className="absolute top-3 right-3 rounded-full bg-background/95 backdrop-blur px-3 py-1 text-sm font-bold text-foreground shadow-md border border-border/60">
            ${Number(recipe.price).toFixed(2)}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-xl font-headline leading-snug">
            <Link
              href={`/recipe/${recipe.id}`}
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
            >
              {recipe.name}
            </Link>
          </CardTitle>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 shrink-0 font-semibold"
            aria-label={`Rated ${(recipe.rating || 0).toFixed(1)} out of 5 stars`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
            <span>{(recipe.rating || 0).toFixed(1)}</span>
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
          {recipe.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <Badge
            variant="outline"
            className={cn(
              'gap-1 font-medium',
              isVeg
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
            )}
          >
            {isVeg ? (
              <Leaf className="w-3 h-3 text-emerald-600" aria-hidden="true" />
            ) : (
              <Drumstick className="w-3 h-3 text-amber-700" aria-hidden="true" />
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
        {cardType === 'cart' ? (
          <CartButton recipe={recipe} orderableState={orderableState} />
        ) : (
          <Button asChild className="w-full font-semibold" variant="secondary">
            <Link href={`/recipe/${recipe.id}`}>
              <Eye className="mr-2 h-4 w-4" aria-hidden="true" /> View Recipe
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
