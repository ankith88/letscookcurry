"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types';
import { Star, PlusCircle, DollarSign, MapPin, Leaf } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/recipe/${recipe.id}`}>
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={recipe.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-xl font-headline leading-tight pr-2">
                <Link href={`/recipe/${recipe.id}`} className="hover:text-primary transition-colors">{recipe.name}</Link>
            </CardTitle>
            <div className='flex flex-col items-end gap-2'>
              <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{recipe.rating.toFixed(1)}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                  <DollarSign className="w-4 h-4" />
                  <span>{recipe.price}</span>
              </Badge>
            </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{recipe.description}</p>
        <div className="flex items-center gap-2">
           <Badge variant={recipe.diet === 'Veg' ? 'default' : 'destructive'} className="gap-1 bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
             <Leaf className="w-3 h-3"/>
             {recipe.diet}
           </Badge>
            <Badge variant="outline" className="gap-1">
                <MapPin className="w-3 h-3"/>
                {recipe.region}
            </Badge>
        </div>

      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" onClick={() => addItem(recipe)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
