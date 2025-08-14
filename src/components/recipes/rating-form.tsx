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
  submitRating: (formData: FormData) => Promise<{ message?: string; errors?: any }>;
}

export function RatingForm({ recipeId, submitRating }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<{ message?: string; errors?: any } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('rating', rating.toString());
    
    startTransition(async () => {
      const result = await submitRating(formData);
      setFormState(result);
      if (result.message) {
        toast({
            title: "Success!",
            description: result.message,
        });
        setRating(0);
        setComment('');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {formState?.message && !formState.errors && (
         <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <AlertCircle className="h-4 w-4 !text-green-600 dark:!text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-200">Success</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {formState.message}
          </AlertDescription>
        </Alert>
       )}

      <input type="hidden" name="recipeId" value={recipeId} />
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
          Your Comment (optional)
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
