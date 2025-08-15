
import type { Recipe, Rating } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, Timestamp } from "firebase/firestore";

export async function getWeeklyRecipes(): Promise<Recipe[]> {
  const recipesCol = collection(db, 'recipes');
  // Query for recipes where isWeekly is true
  const q = query(recipesCol, where("isWeekly", "==", true));
  const recipeSnapshot = await getDocs(q);
  const recipeList = recipeSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Recipe));
  return recipeList;
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const recipesCol = collection(db, 'recipes');
  const recipeSnapshot = await getDocs(recipesCol);
  const recipeList = recipeSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Recipe));
  return recipeList;
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
