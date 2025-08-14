import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { getWeeklyRecipes } from '@/lib/recipes';

export default function Home() {
  const recipes = getWeeklyRecipes();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary sm:text-5xl lg:text-6xl">
          This Week's Curries
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          Delicious, easy-to-make curry recipes delivered to your door. New recipes every Monday!
        </p>
      </div>
      <RecipeGrid recipes={recipes} />
    </div>
  );
}
