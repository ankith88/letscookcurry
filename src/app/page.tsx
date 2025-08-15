import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { getWeeklyRecipes } from '@/lib/recipes';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export default async function Home() {
  const recipes = await getWeeklyRecipes();

  return (
    <>
      <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://placehold.co/1920x1080.png"
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
            Authentic Indian Flavors, Delivered Weekly
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90 drop-shadow-md">
            Discover delicious, easy-to-make curry recipes. New choices every single Monday to spice up your week!
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
        <RecipeGrid recipes={recipes} />
      </div>
    </>
  );
}
