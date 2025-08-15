
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const ratingSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required."),
  rating: z.coerce.number().min(1, "Rating is required.").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters long.").max(500, "Comment cannot exceed 500 characters.").optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedFields = ratingSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ success: false, errors: validatedFields.error.flatten().fieldErrors }, { status: 400 });
    }

    const { recipeId, rating, comment } = validatedFields.data;
    
    const recipeRef = doc(db, 'recipes', recipeId);
    const ratingsColRef = collection(db, `recipes/${recipeId}/ratings`);
    const newRatingRef = doc(ratingsColRef);

    // Step 1: Add the new rating document to the subcollection.
    await setDoc(newRatingRef, {
        rating,
        comment: comment || "",
        createdAt: Timestamp.now(),
    });

    // Step 2: Recalculate the average rating and review count.
    const ratingsSnapshot = await getDocs(ratingsColRef);
    const allRatings = ratingsSnapshot.docs.map(doc => doc.data().rating as number);
    
    const newReviews = allRatings.length;
    const newAverageRating = newReviews > 0 ? allRatings.reduce((acc, curr) => acc + curr, 0) / newReviews : 0;

    // Step 3: Update the main recipe document with the new values.
    await updateDoc(recipeRef, {
        reviews: newReviews,
        rating: newAverageRating,
    });
    
    // Step 4: Revalidate paths to clear server-side cache.
    revalidatePath(`/recipe/${recipeId}`);
    revalidatePath('/');
    
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (e: any) {
    console.error("Error submitting rating:", e);
    return NextResponse.json({ success: false, errors: { _form: [e.message || "An unexpected error occurred."] } }, { status: 500 });
  }
}
