"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import type { Rating } from '@/lib/types';

interface RatingFormProps {
  recipeId: string;
  onReviewSubmitted?: (newRating: Rating) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: '1 Star: Needs Improvement',
  2: '2 Stars: Fair',
  3: '3 Stars: Good',
  4: '4 Stars: Very Delicious',
  5: '5 Stars: Absolutely Amazing',
};

export function RatingForm({ recipeId, onReviewSubmitted }: RatingFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<{ success?: boolean; errors?: any } | null>(null);
  const { toast } = useToast();

  const activeRating = hoverRating || rating;

  const handleStarKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, star: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(5, (rating || star) + 1);
      setRating(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(1, (rating || star) - 1);
      setRating(prev);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating === 0) {
      setFormState({ errors: { rating: ['Please select a star rating before submitting.'] } });
      return;
    }

    setFormState(null);

    const formData = {
      recipeId,
      rating,
      comment,
    };

    startTransition(async () => {
      try {
        const response = await fetch('/api/ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          setFormState(result || { success: false, errors: { _form: ['An unknown error occurred.'] } });
          return;
        }

        if (result.success) {
          toast({
            title: 'Thank you for your review!',
            description: 'Your rating and tasting notes have been shared.',
          });
          onReviewSubmitted?.({
            rating,
            comment,
            createdAt: new Date().toISOString(),
          });
          setRating(0);
          setHoverRating(0);
          setComment('');
          router.refresh();
        } else {
          setFormState(result);
        }
      } catch (error) {
        setFormState({
          success: false,
          errors: { _form: ['Network error while saving your review. Please try submitting again.'] },
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formState?.errors?._form && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Submission Failed</AlertTitle>
          <AlertDescription>
            {formState.errors._form?.[0] || 'Please check the form for errors.'}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <span id="rating-group-label" className="block text-sm font-semibold text-foreground">
            Your Rating <span className="text-destructive">*</span>
          </span>
          {activeRating > 0 && (
            <span className="num text-xs font-semibold text-foreground" aria-live="polite">
              {RATING_LABELS[activeRating]}
            </span>
          )}
        </div>
        <div
          role="radiogroup"
          aria-labelledby="rating-group-label"
          className="flex items-center gap-1"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-label={`Rate ${star} out of 5 stars`}
              aria-checked={rating === star}
              onClick={() => setRating(star)}
              onKeyDown={(e) => handleStarKeyDown(e, star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Star
                aria-hidden="true"
                className={cn(
                  'w-7 h-7 transition-colors',
                  activeRating >= star
                    ? 'text-accent fill-accent'
                    : 'text-muted-foreground/35'
                )}
              />
            </button>
          ))}
        </div>
        {formState?.errors?.rating && (
          <p className="text-sm text-destructive mt-1.5" role="alert">
            {formState.errors.rating[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-semibold text-foreground mb-2">
          Tasting Notes <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Textarea
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How did your curry turn out? Share spice adjustments, pairings, or thoughts..."
          rows={4}
          className="rounded-xl bg-background border-border"
        />
        {formState?.errors?.comment && (
          <p className="text-sm text-destructive mt-1.5" role="alert">
            {formState.errors.comment[0]}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-11 w-full sm:w-auto px-6 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-none"
        disabled={isPending || rating === 0}
      >
        {isPending ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
