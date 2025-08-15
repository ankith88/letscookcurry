
import type { Recipe, Rating } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, Timestamp } from "firebase/firestore";

async function getRecipesWithDynamicRatings(recipesQuery: any): Promise<Recipe[]> {
    const recipeSnapshot = await getDocs(recipesQuery);
    const recipeList = await Promise.all(recipeSnapshot.docs.map(async (doc) => {
        const recipe = { ...doc.data(), id: doc.id } as Recipe;
        
        // Fetch ratings for each recipe
        const ratings = await getRecipeRatings(recipe.id);

        // Calculate dynamic rating and reviews
        if (ratings.length > 0) {
            const totalRating = ratings.reduce((acc: number, rating: Rating) => acc + rating.rating, 0);
            recipe.rating = totalRating / ratings.length;
            recipe.reviews = ratings.length;
        } else {
            recipe.rating = 0;
            recipe.reviews = 0;
        }
        return recipe;
    }));
    return recipeList;
}

export async function getWeeklyRecipes(): Promise<Recipe[]> {
  const recipesCol = collection(db, 'recipes');
  // Query for recipes where isWeekly is true
  const q = query(recipesCol, where("isWeekly", "==", true));
  return getRecipesWithDynamicRatings(q);
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const recipesCol = collection(db, 'recipes');
  const q = query(recipesCol);
  return getRecipesWithDynamicRatings(q);
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
    const recipeRef = doc(db, 'recipes', id);
    const recipeSnap = await getDoc(recipeRef);

    if (recipeSnap.exists()) {
        return { ...recipeSnap.data(), id: recipeSnap.id } as Recipe;
    } else {
        return null;
    }
}

export async function getRecipeRatings(recipeId: string): Promise<Rating[]> {
    const ratingsCol = collection(db, 'recipes', recipeId, 'ratings');
    const q = query(ratingsCol, orderBy('createdAt', 'desc'));
    const ratingSnapshot = await getDocs(q);
    
    const ratingList = ratingSnapshot.docs.map(doc => {
        const data = doc.data();
        const { createdAt, ...rest } = data;

        let serializableCreatedAt: string;
        
        // Ensure createdAt is a Firestore Timestamp before converting
        if (createdAt instanceof Timestamp) {
            serializableCreatedAt = createdAt.toDate().toISOString();
        } else if (typeof createdAt === 'string') {
            // If it's already a string, use it directly
            serializableCreatedAt = createdAt;
        } else {
            // Fallback for any other unexpected type
            serializableCreatedAt = new Date().toISOString();
        }
        
        return {
            ...rest,
            createdAt: serializableCreatedAt,
        } as Rating;
    });

    return ratingList;
}
