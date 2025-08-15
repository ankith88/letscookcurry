
"use server";

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
  console.log(`Validated data: recipeId=${recipeId}, rating=${rating}, comment=${comment}`);
  
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

    console.log("Step 2: Fetching recipe for update.");
    const recipeDoc = await getDoc(recipeRef);
    if (!recipeDoc.exists()) {
        throw new Error("Recipe not found during update step.");
    }
    
    console.log("Step 3: Calculating new average rating.");
    const currentData = recipeDoc.data();
    const currentRating = currentData.rating || 0;
    const currentReviews = currentData.reviews || 0;

    const newReviews = currentReviews + 1;
    // Formula to calculate new average: ((old_average * old_count) + new_value) / new_count
    const newRating = ((currentRating * currentReviews) + rating) / newReviews;

    console.log(`Calculation: OldRating=${currentRating}, OldReviews=${currentReviews}, NewRating=${newRating}, NewReviews=${newReviews}`);

    console.log("Step 4: Updating recipe document.");
    await updateDoc(recipeRef, {
        reviews: newReviews,
        rating: newRating,
    });
    console.log("Successfully updated recipe document.");
    
    revalidatePath(`/recipe/${recipeId}`);
    revalidatePath('/');

    console.log("Rating submission process completed successfully.");
    return {
      message: "Thank you for your feedback!",
    };

  } catch (e: any) {
    console.error("CRITICAL ERROR during rating submission: ", e);
    // Log the full error object for better diagnostics
    console.error(e);
    return {
        errors: { _form: [e.message || "An unexpected error occurred. Please check the logs."] }
    }
  }
}
