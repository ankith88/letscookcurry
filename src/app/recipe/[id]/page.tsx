
import { getRecipeById, getRecipeRatings } from '@/lib/recipes';
import RecipeClientPage from './recipe-client-page';
import { notFound } from 'next/navigation';

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(params.id);
  
  if (!recipe) {
    notFound();
  }
  
  const ratings = await getRecipeRatings(params.id);

  return <RecipeClientPage initialRecipe={recipe} initialRatings={ratings} />;
}
