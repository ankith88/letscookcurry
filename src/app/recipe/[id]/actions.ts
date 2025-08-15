
"use server";

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
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
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { recipeId, rating, comment } = validatedFields.data;
  
  try {
    const recipeRef = doc(db, 'recipes', recipeId);
    const ratingsColRef = collection(db, `recipes/${recipeId}/ratings`);
    const newRatingRef = doc(ratingsColRef);

    // Step 1: Add the new rating document to the subcollection.
    await setDoc(newRatingRef, {
        rating,
        comment: comment || "",
        createdAt: new Date(),
    });

    // Step 2: Recalculate the average rating and review count.
    const ratingsSnapshot = await getDocs(ratingsColRef);
    const allRatings = ratingsSnapshot.docs.map(doc => doc.data().rating as number);
    
    const newReviews = allRatings.length;
    const newRating = newReviews > 0 ? allRatings.reduce((acc, curr) => acc + curr, 0) / newReviews : 0;

    // Step 3: Update the main recipe document with the new values.
    await updateDoc(recipeRef, {
        reviews: newReviews,
        rating: newRating,
    });
    
    // Step 4: Revalidate paths to show updated data.
    revalidatePath(`/recipe/${recipeId}`);
    revalidatePath('/');

    return {
      message: "Thank you for your feedback!",
    };

  } catch (e: any) {
    return {
        errors: { _form: [e.message || "An unexpected error occurred."] }
    }
  }
}
