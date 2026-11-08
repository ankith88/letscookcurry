
import { getRecipeById, getRecipeRatings } from '@/lib/recipes';
import RecipeClientPage from './recipe-client-page';
import { notFound } from 'next/navigation';
import type { Rating } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let recipe = await getRecipeById(id);
  
  if (!recipe) {
    notFound();
  }
  
  const ratings = await getRecipeRatings(id);

  // Dynamically calculate rating and reviews count on the server
  if (ratings.length > 0) {
    const totalRating = ratings.reduce((acc: number, rating: Rating) => acc + rating.rating, 0);
    const averageRating = totalRating / ratings.length;
    recipe.rating = averageRating;
    recipe.reviews = ratings.length;
  } else {
    recipe.rating = 0;
    recipe.reviews = 0;
  }

  return <RecipeClientPage initialRecipe={recipe} initialRatings={ratings} />;
}
