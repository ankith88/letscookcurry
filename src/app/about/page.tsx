
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 relative min-h-[300px] md:min-h-0">
             <Image
                src="https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/PXL_20231210_143941853.jpg?alt=media&token=9db8e8c0-8806-46ff-84c1-79421d0bb1fa"
                alt="Tanvi and Ankith"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover"
                data-ai-hint="couple cooking"
              />
          </div>
          <div className="md:w-1/2 p-8 md:p-12">
            <h1 className="text-4xl font-bold font-headline text-primary mb-2">
              About Us
            </h1>
            <p className="text-lg text-muted-foreground font-semibold mb-6">
              A Passion for Spice, A Love for Sharing
            </p>
            <div className="space-y-6 text-foreground/90 text-base leading-relaxed">
                <p>
                    Welcome to Let's Cook Curry! We're Tanvi and Ankith, a husband-and-wife team based in beautiful Sydney, Australia. For us, food has always been more than just a meal; it's a language of love, a bridge between generations, and the centerpiece of our most cherished memories. Our journey with cooking is deeply rooted in our Indian heritage, where every dish tells a story and every spice has a purpose.
                </p>
                <h2 className="text-2xl font-headline font-semibold pt-4 border-t mt-8">Spices and ingredients</h2>
                <p>
                    We've always believed that good food has a unique power to warm the heart and bring people together. There's a special kind of happiness found in the sizzle of spices in a hot pan, the aroma of a slow-cooked curry filling the home, and the shared smiles over a delicious, home-cooked meal. It was this simple, profound joy that inspired us to ask, "Why not share our love for cooking with the world?"
                </p>
                <p>
                    And so, 'Let's Cook Curry' was born. This website is our little corner of the internet where we share that passion with you. It's more than just a collection of recipes; it's an invitation into our kitchen. We aim to demystify Indian cooking, breaking down traditional techniques into simple, accessible steps for the modern home cook. Whether you're a seasoned chef or just starting your culinary adventures, our goal is to empower you to create authentic, mouth-watering Indian dishes with confidence.
                </p>
                <p>
                    Thank you for being here. We're so excited to have you join our community. We hope our recipes bring as much warmth and happiness to your table as they do to ours.
                </p>
                <p className="font-semibold text-primary">
                    Happy cooking!
                </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
