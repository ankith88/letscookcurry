
import { getRecipeById, getRecipeRatings } from "@/lib/recipes";
import RecipeClientPage from "./recipe-client-page";
import type { Recipe, Rating } from "@/lib/types";

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(params.id);
  const ratings = recipe ? await getRecipeRatings(params.id) : [];

  if (!recipe) {
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold">Recipe not found</h1>
            <p className="text-muted-foreground">The recipe you are looking for does not exist.</p>
        </div>
    )
  }

  return <RecipeClientPage initialRecipe={recipe} initialRatings={ratings} />;
}
