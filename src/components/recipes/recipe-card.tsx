"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types';
import { Star, PlusCircle } from 'lucide-react';
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
        <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl font-headline leading-tight">
                <Link href={`/recipe/${recipe.id}`} className="hover:text-primary transition-colors">{recipe.name}</Link>
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{recipe.rating.toFixed(1)}</span>
            </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{recipe.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" onClick={() => addItem(recipe)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
