import type { Recipe } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";

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
