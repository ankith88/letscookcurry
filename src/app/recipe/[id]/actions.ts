
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
  const recipeRef = doc(db, 'recipes', recipeId);

  try {
    await runTransaction(db, async (transaction) => {
        const recipeDoc = await transaction.get(recipeRef);
        if (!recipeDoc.exists()) {
            throw "Document does not exist!";
        }

        // Add the new rating to a 'ratings' subcollection
        const newRatingRef = doc(collection(db, 'recipes', recipeId, 'ratings'));
        transaction.set(newRatingRef, { 
            rating, 
            comment, 
            createdAt: new Date() 
        });

        // Update the aggregate rating on the recipe document
        const currentData = recipeDoc.data();
        const newReviews = (currentData.reviews || 0) + 1;
        const newRating = ((currentData.rating || 0) * (currentData.reviews || 0) + rating) / newReviews;

        transaction.update(recipeRef, { 
            reviews: newReviews,
            rating: newRating
        });
    });

    revalidatePath(`/recipe/${recipeId}`);
    revalidatePath('/'); // Also revalidate home page in case the recipe is there

    return {
      message: "Thank you for your feedback!",
    };

  } catch (e) {
    console.error("Transaction failed: ", e);
    return {
        errors: { _form: ["Failed to submit rating. Please try again."] }
    }
  }
}
