
"use server";

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
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
    // 1. Add the new rating to the subcollection
    const ratingsColRef = collection(db, `recipes/${recipeId}/ratings`);
    await addDoc(ratingsColRef, {
      rating,
      comment: comment || "",
      createdAt: new Date(),
    });

    // 2. Update the aggregate rating on the recipe document
    const recipeRef = doc(db, 'recipes', recipeId);
    const recipeDoc = await getDoc(recipeRef);

    if (!recipeDoc.exists()) {
      throw new Error("Recipe not found.");
    }

    const currentData = recipeDoc.data();
    const currentRating = currentData.rating || 0;
    const currentReviews = currentData.reviews || 0;

    const newReviews = currentReviews + 1;
    const newRating = ((currentRating * currentReviews) + rating) / newReviews;

    await updateDoc(recipeRef, {
      reviews: newReviews,
      rating: newRating,
    });
    
    // 3. Revalidate paths to show the new data
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
