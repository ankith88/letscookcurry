
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { getAllRecipes, getWeeklyRecipes } from '@/lib/recipes';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown, CalendarClock, ChefHat, Sparkles, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FilteredRecipeGrid } from '@/components/recipes/filtered-recipe-grid';

export default async function Home() {
  const weeklyRecipes = await getWeeklyRecipes();
  const allRecipes = await getAllRecipes();

  const hasWeeklyRecipes = weeklyRecipes.length > 0;

  return (
    <>
      <section className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/main_image-v2-2048%20(1).jpg?alt=media&token=c8e72a75-16ec-4f4e-91d0-aa0c8835e9f7"
            alt="An assortment of delicious Indian curries and spices"
            fill
            className="object-cover"
            priority
            data-ai-hint="indian food background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />
        </div>
        <div className="relative z-10 px-4 py-16 max-w-3xl motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-medium text-amber-200 mb-6 shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span>Order Monday – Thursday • Fresh Delivery Every Monday</span>
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-white sm:text-6xl lg:text-7xl !leading-tight drop-shadow-2xl">
            From Our Kitchen to Yours
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/90 drop-shadow-lg leading-relaxed">
            Create unforgettable meals and lasting memories, one curry at a time. New authentic choices every single Monday to spice up your week!
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold shadow-lg">
              <Link href={hasWeeklyRecipes ? "#recipes" : "#all-recipes"} className="group">
                {hasWeeklyRecipes ? "Explore This Week's Recipes" : "Explore All Recipes"}
                <ArrowDown
                  className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5 motion-safe:animate-bounce"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            {hasWeeklyRecipes && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <Link href="#all-recipes">Browse Full Menu</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section aria-label="How Let's Cook Curry Works" className="border-b border-border/60 bg-card/80">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-start gap-4 p-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarClock className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-headline text-base font-bold text-foreground">
                  1. Weekly Menu Drops Monday
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explore our curated rotating menu and place your order between Monday and Thursday.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ChefHat className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-headline text-base font-bold text-foreground">
                  2. Handcrafted with Whole Spices
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Slow-simmered in small batches using authentic family recipes from across India.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-headline text-base font-bold text-foreground">
                  3. Delivered Fresh Next Monday
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your meals arrive fresh on Monday—ready to heat, serve, and enjoy around your table.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasWeeklyRecipes && (
        <>
          <section id="recipes" className="container mx-auto px-4 py-16 sm:px-6 lg:py-24 scroll-mt-16">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-2">
                Limited Weekly Selection
              </span>
              <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
                This Week&apos;s Curries
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                Select your favorite meals for the week. All orders are delivered fresh on the following Monday.
              </p>
            </div>
            <RecipeGrid recipes={weeklyRecipes} cardType="cart" />
          </section>
          <Separator className="w-1/2 mx-auto" />
        </>
      )}

      <section id="all-recipes" className="container mx-auto px-4 pb-16 sm:px-6 lg:pb-24 pt-16 scroll-mt-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Recipe Archive &amp; Inspiration
          </span>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
            Explore Our Full Menu
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
            Craving something different? Filter by region, dietary preference, or spice level to browse our entire collection of authentic recipes.
          </p>
        </div>
        <FilteredRecipeGrid recipes={allRecipes} />
      </section>
    </>
  );
}
