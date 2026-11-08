import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame, HeartHandshake, UtensilsCrossed } from 'lucide-react';

const PILLARS = [
  {
    num: '01',
    icon: HeartHandshake,
    title: 'Family Heritage',
    description:
      'Created by Tanvi & Ankith to share generations of cherished Indian home recipes.',
  },
  {
    num: '02',
    icon: Flame,
    title: 'Authentic Spices',
    description:
      'Every dish tells a regional story across North, South, East, and West India.',
  },
  {
    num: '03',
    icon: UtensilsCrossed,
    title: 'Simple & Accessible',
    description:
      'Demystifying traditional techniques for modern home cooks and busy weeknights.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Section 1: Hero */}
      <section data-enter className="border-b border-border py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="enter-1 lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-semibold text-primary">
                <Flame className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>A Passion for Spice, A Love for Sharing</span>
              </div>

              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.04]">
                About Let&apos;s Cook Curry
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Welcome to <strong className="font-semibold text-foreground">Let&apos;s Cook Curry</strong>! For us, food has always been more than just a meal; it&apos;s a language of love, a bridge between generations, and the centerpiece of our most cherished memories.
              </p>
            </div>

            <div className="enter-2 lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/main_image-v2-2048%20(1).jpg?alt=media&token=c8e72a75-16ec-4f4e-91d0-aa0c8835e9f7"
                  alt="Regional Indian curries and whole spices on a kitchen table"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-7 flex flex-col justify-between gap-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="num font-headline text-xl text-muted-foreground">
                      {pillar.num}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-headline text-xl font-medium text-foreground">
                      {pillar.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Story Spread */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left 5 Columns: Pull Quote in Curry-Leaf Botanical Olive */}
            <div className="lg:col-span-5 rounded-2xl bg-[#38450f] text-[#fcf8ef] p-8 sm:p-10 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#f7a832]">
                From Our Kitchen to Yours
              </p>
              <blockquote className="font-headline text-2xl sm:text-3xl font-normal leading-snug text-[#fcf8ef]">
                &ldquo;There&apos;s a special kind of happiness found in the sizzle of spices in a hot pan, the aroma of a slow-cooked curry filling the home, and the shared smiles over a delicious meal.&rdquo;
              </blockquote>
              <div className="border-t border-[#fcf8ef]/15 pt-4 text-sm text-[#d4d9c1]">
                <p className="font-semibold text-[#fcf8ef]">Tanvi &amp; Ankith</p>
                <p className="text-xs mt-0.5">Let&apos;s Cook Curry</p>
              </div>
            </div>

            {/* Right 7 Columns: Story Copy & Call to Action */}
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-foreground/90 leading-relaxed">
              <h2 className="font-headline text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                Spices, Aroma &amp; Togetherness
              </h2>
              <p>
                We&apos;re Tanvi and Ankith, a husband-and-wife team based in beautiful Sydney, Australia. Our journey with cooking is deeply rooted in our Indian heritage, where every dish tells a story and every spice has a purpose.
              </p>
              <p>
                We&apos;ve always believed that good food has a unique power to warm the heart and bring people together. It was this simple, profound joy that inspired us to ask,{' '}
                <em>&ldquo;Why not share our love for cooking with the world?&rdquo;</em>
              </p>
              <p>
                And so, <strong className="font-semibold text-foreground">Let&apos;s Cook Curry</strong> was born. This website is our little corner of the internet where we share that passion with you. It&apos;s more than just a collection of recipes; it&apos;s an invitation into our kitchen. Whether you&apos;re a seasoned chef or just starting your culinary adventures, our goal is to empower you to create authentic, mouth-watering Indian dishes with confidence.
              </p>

              <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-headline text-xl font-medium text-primary">
                    Happy cooking! — Tanvi &amp; Ankith
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-7 h-12 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/#all-recipes">
                    <span>Explore Our Recipes</span>
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
