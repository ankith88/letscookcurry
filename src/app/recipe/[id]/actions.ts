
"use server";

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, runTransaction, getDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const ratingSchema = z.object({
  recipeId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters long.").max(500, "Comment cannot exceed 500 characters.").optional().or(z.literal('')),
});

export async function submitRating(formData: FormData) {
  const validatedFields = ratingSchema.safeParse({
    recipeId: formData.get('recipeId'),
    rating: formData.get('rating'),
    comment: formData.get('comment'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { recipeId, rating, comment } = validatedFields.data;
  
  try {
    const recipeRef = doc(db, 'recipes', recipeId);
    
    await runTransaction(db, async (transaction) => {
        const recipeDoc = await transaction.get(recipeRef);
        if (!recipeDoc.exists()) {
            throw new Error("Recipe not found.");
        }

        const currentData = recipeDoc.data();
        const currentRating = currentData.rating || 0;
        const currentReviews = currentData.reviews || 0;

        // Calculate the new average rating
        const newReviews = currentReviews + 1;
        const newRating = (currentRating * currentReviews + rating) / newReviews;
        
        // Update the recipe document with new average rating and review count
        transaction.update(recipeRef, { 
            reviews: newReviews,
            rating: newRating
        });

        // Add the new rating to the 'ratings' subcollection
        const newRatingRef = doc(collection(db, 'recipes', recipeId, 'ratings'));
        transaction.set(newRatingRef, { 
            rating, 
            comment: comment || "", // Ensure comment is not undefined
            createdAt: new Date() 
        });
    });

    revalidatePath(`/recipe/${recipeId}`);
    revalidatePath('/'); 

    return {
      message: "Thank you for your feedback!",
    };

  } catch (e: any) {
    console.error("Transaction failed: ", e);
    return {
        errors: { _form: [e.message || "Failed to submit rating. Please try again."] }
    }
  }
}
