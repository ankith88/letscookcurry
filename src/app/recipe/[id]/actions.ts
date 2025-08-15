
"use server";

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, doc, runTransaction, writeBatch, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const ratingSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required."),
  rating: z.coerce.number().min(1, "Rating is required.").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters long.").max(500, "Comment cannot exceed 500 characters.").optional().or(z.literal('')),
});

export async function submitRating(formData: FormData) {
  console.log("Submit rating function started.");

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
  console.log(`Validated data: recipeId=${recipeId}, rating=${rating}`);
  
  try {
    const recipeRef = doc(db, 'recipes', recipeId);
    const newRatingRef = doc(collection(db, `recipes/${recipeId}/ratings`));

    console.log("Step 1: Creating new rating document.");
    await setDoc(newRatingRef, {
        rating,
        comment: comment || "",
        createdAt: new Date(),
    });
    console.log("Successfully created new rating document:", newRatingRef.id);

    console.log("Step 2: Updating recipe document.");
    const recipeDoc = await getDoc(recipeRef);
    if (!recipeDoc.exists()) {
        throw new Error("Recipe not found during update step.");
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
    console.log("Successfully updated recipe document.");
    
    // Revalidate paths to show the new data immediately
    revalidatePath(`/recipe/${recipeId}`);
    revalidatePath('/');

    console.log("Rating submission process completed successfully.");
    return {
      message: "Thank you for your feedback!",
    };

  } catch (e: any) {
    console.error("CRITICAL ERROR during rating submission: ", e);
    return {
        errors: { _form: [e.message || "An unexpected error occurred. Please check the logs."] }
    }
  }
}
