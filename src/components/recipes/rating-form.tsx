
"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

interface RatingFormProps {
  recipeId: string;
}

export function RatingForm({ recipeId }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<{ success?: boolean; errors?: any } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating === 0) {
        setFormState({ errors: { rating: ["Please select a rating."] }});
        return;
    };

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
                 setFormState(result || { success: false, errors: { _form: ["An unknown error occurred."] } });
                 return;
            }
            
            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Your review has been submitted. The page will now reload.",
                });
                // Force a reload to show fresh data and avoid HMR issues.
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                 setFormState(result);
            }
        } catch (error) {
             setFormState({ success: false, errors: { _form: ["An unexpected network error occurred."] } });
        }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {formState?.errors && (
         <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Submission Failed</AlertTitle>
          <AlertDescription>
            {formState.errors._form?.[0] || "Please check the form for errors."}
          </AlertDescription>
        </Alert>
       )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Your Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'w-8 h-8 cursor-pointer transition-colors',
                (hoverRating || rating) >= star
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-gray-300'
              )}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        {formState?.errors?.rating && (
            <p className="text-sm text-destructive mt-1">{formState.errors.rating[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
          Your Comment
        </label>
        <Textarea
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this recipe?"
          rows={4}
        />
        {formState?.errors?.comment && (
            <p className="text-sm text-destructive mt-1">{formState.errors.comment[0]}</p>
        )}
      </div>
      <Button type="submit" disabled={isPending || rating === 0}>
        {isPending ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
