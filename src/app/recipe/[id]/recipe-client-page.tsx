
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

interface RecipeClientPageProps {
  initialRecipe: Recipe;
  initialRatings: Rating[];
}

export default function RecipeClientPage({ initialRecipe, initialRatings }: RecipeClientPageProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [ratings, setRatings] = useState(initialRatings);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [orderableState, setOrderableState] = useState<'loading' | 'orderable' | 'closed'>('loading');

  useEffect(() => {
    // Day check is done on client to avoid hydration mismatch
    const today = new Date().getDay();
    // Monday to Thursday (1-4)
    setOrderableState(today >= 1 && today <= 4 ? 'orderable' : 'closed');

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
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderOrderSection = () => {
    if (!recipe?.isWeekly) return null;

    return (
      <div className="rounded-xl border border-border/80 bg-secondary/40 p-5 space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Featured on This Week&apos;s Menu
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Freshly prepared &amp; delivered Monday
            </p>
          </div>
          <span className="text-3xl font-bold font-headline text-foreground">
            ${Number(recipe.price).toFixed(2)}
          </span>
        </div>

        {orderableState === 'loading' && <Skeleton className="h-12 w-full" />}
        {orderableState === 'orderable' && <AddToCartButton recipe={recipe} />}
        {orderableState === 'closed' && (
          <Button size="lg" variant="secondary" className="w-full" disabled>
            <Ban className="mr-2 h-5 w-5" aria-hidden="true" />
            Ordering Closed (Open Mon–Thu)
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
        <Button asChild className="mt-6">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  const isVeg = recipe.diet === 'Veg';

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb / Back Navigation */}
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/#all-recipes">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Recipes
          </Link>
        </Button>
      </div>

      {/* Hero Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7">
          <Card className="overflow-hidden border-border/70 shadow-md">
            <CardContent className="p-0">
              <Image
                src={recipe.imageUrl}
                alt={recipe.name}
                width={900}
                height={675}
                priority
                className="aspect-[4/3] w-full object-cover"
                data-ai-hint={recipe.imageHint}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="flex items-center gap-1 text-sm font-semibold">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
                <span>
                  {(recipe.rating || 0).toFixed(1)} ({recipe.reviews || 0}{' '}
                  {recipe.reviews === 1 ? 'review' : 'reviews'})
                </span>
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'gap-1 text-sm font-medium',
                  isVeg
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                )}
              >
                {isVeg ? (
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Drumstick className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                )}
                {isVeg ? 'Vegetarian' : 'Meat & Poultry'}
              </Badge>
              <Badge variant="outline" className="gap-1 text-sm">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                {recipe.region}
              </Badge>
              {recipe.spice && <SpiceLevel spice={recipe.spice} />}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline tracking-tight text-foreground">
              {recipe.name}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {recipe.longDescription}
            </p>
          </div>

          {renderOrderSection()}
        </div>
      </div>

      <Separator />

      {/* Ingredients & Instructions Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <Card className="lg:col-span-5 border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" aria-hidden="true" />
              Ingredients
            </CardTitle>
            <CardDescription>
              Click an ingredient to check it off as you prep.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {recipe.ingredients?.map((ingredient, index) => {
                const isChecked = !!checkedIngredients[index];
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => toggleIngredient(index)}
                      aria-pressed={isChecked}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg p-2.5 text-left text-sm sm:text-base transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isChecked && 'text-muted-foreground line-through bg-muted/40'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                          isChecked
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border bg-background'
                        )}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span>{ingredient}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" aria-hidden="true" />
              Step-by-Step Instructions
            </CardTitle>
            <CardDescription>
              Follow these steps to bring out the full aroma of the spices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-6">
              {recipe.instructions?.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div
                    aria-hidden="true"
                    className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm"
                  >
                    {index + 1}
                  </div>
                  <p className="pt-1 text-base leading-relaxed text-foreground/90">{step}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Reviews & Rating Form Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <Card className="lg:col-span-5 border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Rate this Recipe</CardTitle>
            <CardDescription>
              Tried cooking or ordering {recipe.name}? Let the community know what you thought!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RatingForm recipeId={recipe.id} onReviewSubmitted={handleReviewSubmitted} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
              What Others Are Saying ({ratings.length})
            </CardTitle>
            <CardDescription>
              Community reviews and tasting notes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {ratings.length > 0 ? (
              ratings.map((rating, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-6 last:pb-0 border-b last:border-b-0 border-border/60"
                >
                  <Avatar className="border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {rating.rating}★
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1.5">
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
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-muted-foreground/30'
                          )}
                        />
                      ))}
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
