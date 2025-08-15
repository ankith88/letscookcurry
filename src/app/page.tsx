import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { getAllRecipes, getWeeklyRecipes } from '@/lib/recipes';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown, ChefHat } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default async function Home() {
  const weeklyRecipes = await getWeeklyRecipes();
  const allRecipes = await getAllRecipes();

  return (
    <>
      <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/main_image-v2-2048%20(1).jpg?alt=media&token=c8e72a75-16ec-4f4e-91d0-aa0c8835e9f7"
            alt="An assortment of delicious curries"
            fill
            className="object-cover"
            priority
            data-ai-hint="indian food background"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 p-4 max-w-3xl">
          <h1 className="text-4xl font-bold font-headline tracking-tight text-white sm:text-5xl lg:text-7xl !leading-tight drop-shadow-lg">
            From Our Kitchen to Yours
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90 drop-shadow-md">
            Create unforgettable meals and lasting memories, one curry at a time. New choices to order every single Monday to spice up your week!
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="#recipes">
                Explore This Week's Recipes
                <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div id="recipes" className="container mx-auto px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline tracking-tight text-primary sm:text-5xl">
            This Week's Curries
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Select your favorite meals for the week. All orders are delivered fresh on the following Monday.
          </p>
        </div>
        {weeklyRecipes.length > 0 ? (
           <RecipeGrid recipes={weeklyRecipes} />
        ) : (
          <p className="text-center text-muted-foreground">No weekly specials at the moment. Check back soon!</p>
        )}
      </div>

      <Separator className="my-12 w-1/2 mx-auto" />

      <div id="all-recipes" className="container mx-auto px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="text-center mb-12">
           <h2 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
            Explore Our Full Menu
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Craving something different? Browse through our entire collection of authentic recipes.
          </p>
        </div>
        <RecipeGrid recipes={allRecipes} />
      </div>

    </>
  );
}
