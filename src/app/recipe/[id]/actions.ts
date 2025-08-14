"use server";

import { z } from 'zod';

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

  // In a real application, you would save this data to your database.
  console.log('New rating submitted:');
  console.log('Recipe ID:', validatedFields.data.recipeId);
  console.log('Rating:', validatedFields.data.rating);
  console.log('Comment:', validatedFields.data.comment);

  return {
    message: "Thank you for your feedback!",
  };
}
