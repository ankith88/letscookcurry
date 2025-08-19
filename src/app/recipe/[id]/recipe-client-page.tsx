
"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, DollarSign, MapPin, Leaf, Ban, Loader2 } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { RatingForm } from '@/components/recipes/rating-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { Recipe, Rating } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface RecipeClientPageProps {
  initialRecipe: Recipe;
  initialRatings: Rating[];
}

export default function RecipeClientPage({ initialRecipe, initialRatings }: RecipeClientPageProps) {
  const [recipe] = useState(initialRecipe);
  const [ratings] = useState(initialRatings);
  const [orderableState, setOrderableState] = useState<'loading' | 'orderable' | 'closed'>('loading');

  useEffect(() => {
    // Day check is done on client to avoid hydration mismatch
    const today = new Date().getDay();
    // Monday to Thursday (1-4)
    setOrderableState(today >= 1 && today <= 4 ? 'orderable' : 'closed');
  }, []);
  
  const renderOrderButton = () => {
     if (!recipe?.isWeekly) return null;

     switch (orderableState) {
        case 'loading':
            return <Skeleton className="h-12 w-full" />;
        case 'orderable':
            return <AddToCartButton recipe={recipe} />;
        case 'closed':
            return (
                <Button size="lg" className="w-full" disabled>
                    <Ban className="mr-2 h-5 w-5" />
                    Ordering Closed
                </Button>
            );
     }
  }
  
  if (!recipe) {
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold">Recipe not found</h1>
            <p className="text-muted-foreground">The recipe you are looking for does not exist.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={recipe.imageUrl}
                alt={recipe.name}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                data-ai-hint={recipe.imageHint}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold font-headline mb-4">{recipe.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{(recipe.rating || 0).toFixed(1)} ({recipe.reviews || 0} reviews)</span>
                </Badge>
                <Badge variant={recipe.diet === 'Veg' ? 'default' : 'destructive'} className="gap-1 text-sm bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                  <Leaf className="w-3 h-3"/>
                  {recipe.diet}
                </Badge>
                <Badge variant="outline" className="gap-1 text-sm">
                  <MapPin className="w-3 h-3"/>
                  {recipe.region}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-6">{recipe.longDescription}</p>

              {orderableState === 'orderable' && (
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      {recipe.price}
                  </span>
                </div>
              )}
              
              {renderOrderButton()}

            </div>

            <Separator />

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-headline font-semibold mb-3">Ingredients</h2>
                <ul className="list-disc list-inside space-y-1 text-foreground/90">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-headline font-semibold mb-3">Instructions</h2>
                <div className="space-y-4">
                  {recipe.instructions?.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Card className="mt-8">
                <CardHeader>
                <CardTitle>Rate this Recipe</CardTitle>
                </CardHeader>
                <CardContent>
                <RatingForm recipeId={recipe.id} />
                </CardContent>
            </Card>
             <Card className="mt-8">
              <CardHeader>
              <CardTitle>What Others Are Saying</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {ratings.length > 0 ? (
                    ratings.map((rating, index) => (
                      <div key={index} className="flex gap-4">
                        <Avatar>
                           <AvatarFallback>{rating.rating}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <div className="flex items-center gap-2 mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'w-4 h-4',
                                    i < rating.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                                  )}
                                />
                              ))}
                           </div>
                           {rating.comment && <p className="text-sm text-muted-foreground">{rating.comment}</p>}
                        </div>
                      </div>
                    ))
                 ) : (
                  <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
                 )}
              </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
