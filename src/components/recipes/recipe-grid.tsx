
import type { Recipe } from '@/lib/types';
import { RecipeCard } from './recipe-card';

interface RecipeGridProps {
  recipes: Recipe[];
  cardType: 'cart' | 'view';
}

export function RecipeGrid({ recipes, cardType }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} cardType={cardType} />
      ))}
    </div>
  );
}
