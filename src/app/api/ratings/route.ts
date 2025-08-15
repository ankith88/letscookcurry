
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
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
    
    const ratingsColRef = collection(db, `recipes/${recipeId}/ratings`);
    const newRatingRef = doc(ratingsColRef);

    // Add the new rating document to the subcollection.
    // The logic to update the average rating on the recipe itself has been removed
    // to avoid permission issues with Firestore security rules.
    await setDoc(newRatingRef, {
        rating,
        comment: comment || "",
        createdAt: Timestamp.now(),
    });
    
    // Revalidate paths to clear server-side cache.
    revalidatePath(`/recipe/${recipeId}`);
    revalidatePath('/');
    
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (e: any) {
    console.error("Error submitting rating:", e);
    // Return the actual error message for better debugging
    const errorMessage = e.message || "An unexpected error occurred.";
    return NextResponse.json({ success: false, errors: { _form: [errorMessage] } }, { status: 500 });
  }
}
