import { getRecipeById } from '@/lib/recipes';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, Soup, PlusCircle, DollarSign, MapPin, Leaf } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { RatingForm } from '@/components/recipes/rating-form';
import { submitRating } from './actions';

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    notFound();
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

              <div className="flex items-center justify-between mb-6">
                 <span className="text-3xl font-bold flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    {recipe.price}
                 </span>
              </div>
              
              <AddToCartButton recipe={recipe} />
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
                <RatingForm recipeId={recipe.id} submitRating={submitRating} />
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
