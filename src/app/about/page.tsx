
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, HeartHandshake, MapPin, UtensilsCrossed } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <Card className="max-w-4xl mx-auto overflow-hidden border-border/70 shadow-md">
        <div className="bg-secondary/50 border-b border-border/60 px-8 py-10 md:px-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary mb-4">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Sydney, Australia</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-headline text-foreground">
            About Let&apos;s Cook Curry
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-primary font-medium">
            A Passion for Spice, A Love for Sharing
          </p>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1.5">
              <HeartHandshake className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="font-headline font-bold text-base">Family Heritage</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Created by Tanvi &amp; Ankith to share generations of cherished Indian home recipes.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1.5">
              <Flame className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="font-headline font-bold text-base">Authentic Spices</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every dish tells a regional story across North, South, East, and West India.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1.5">
              <UtensilsCrossed className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="font-headline font-bold text-base">Simple &amp; Accessible</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Demystifying traditional techniques for modern home cooks and busy weeknights.
              </p>
            </div>
          </div>

          <div className="space-y-6 text-foreground/90 text-base sm:text-lg leading-relaxed">
            <p>
              Welcome to <strong>Let&apos;s Cook Curry</strong>! We&apos;re Tanvi and Ankith, a husband-and-wife team based in beautiful Sydney, Australia. For us, food has always been more than just a meal; it&apos;s a language of love, a bridge between generations, and the centerpiece of our most cherished memories. Our journey with cooking is deeply rooted in our Indian heritage, where every dish tells a story and every spice has a purpose.
            </p>
            <h2 className="text-2xl font-headline font-bold pt-6 border-t border-border/60 text-foreground">
              Spices, Aroma &amp; Togetherness
            </h2>
            <p>
              We&apos;ve always believed that good food has a unique power to warm the heart and bring people together. There&apos;s a special kind of happiness found in the sizzle of spices in a hot pan, the aroma of a slow-cooked curry filling the home, and the shared smiles over a delicious, home-cooked meal. It was this simple, profound joy that inspired us to ask, <em>&ldquo;Why not share our love for cooking with the world?&rdquo;</em>
            </p>
            <p>
              And so, <strong>Let&apos;s Cook Curry</strong> was born. This website is our little corner of the internet where we share that passion with you. It&apos;s more than just a collection of recipes; it&apos;s an invitation into our kitchen. We aim to demystify Indian cooking, breaking down traditional techniques into simple, accessible steps for the modern home cook. Whether you&apos;re a seasoned chef or just starting your culinary adventures, our goal is to empower you to create authentic, mouth-watering Indian dishes with confidence.
            </p>
            <p>
              Thank you for being here. We&apos;re so excited to have you join our community. We hope our recipes bring as much warmth and happiness to your table as they do to ours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border/60">
            <p className="font-headline text-xl font-bold text-primary">
              Happy cooking! — Tanvi &amp; Ankith
            </p>
            <Button asChild size="lg" className="font-semibold">
              <Link href="/#recipes">Explore Our Weekly Menu</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
