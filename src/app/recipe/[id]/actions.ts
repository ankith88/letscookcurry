
"use server";

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, getDoc, runTransaction } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const ratingSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required."),
  rating: z.coerce.number().min(1, "Rating is required.").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters long.").max(500, "Comment cannot exceed 500 characters.").optional().or(z.literal('')),
});

export async function submitRating(formData: FormData) {
  const validatedFields = ratingSchema.safeParse({
    recipeId: formData.get('recipeId'),
    rating: formData.get('rating'),
    comment: formData.get('comment'),
  });

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
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

        // Calculate new average rating
        const currentData = recipeDoc.data();
        const currentRating = currentData.rating || 0;
        const currentReviews = currentData.reviews || 0;

        const newReviews = currentReviews + 1;
        const newRating = ((currentRating * currentReviews) + rating) / newReviews;

        // Update the recipe document
        transaction.update(recipeRef, {
            reviews: newReviews,
            rating: newRating,
        });

        // Add the new rating to the subcollection
        const newRatingRef = doc(collection(db, `recipes/${recipeId}/ratings`));
        transaction.set(newRatingRef, {
            rating,
            comment: comment || "",
            createdAt: new Date(),
        });
    });
    
    // Revalidate paths to show the new data
    revalidatePath(`/recipe/${recipeId}`);
    revalidatePath('/');

    return {
      message: "Thank you for your feedback!",
    };

  } catch (e: any) {
    console.error("Error submitting rating: ", e);
    return {
        errors: { _form: [e.message || "An unexpected error occurred. Please try again."] }
    }
  }
}
