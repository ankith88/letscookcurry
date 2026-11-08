import type { Recipe, Rating } from '@/lib/types';
import { db, storage } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type RecipeInput = Omit<Recipe, 'id'>;

function slugifyRecipeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

async function mapDocsToRecipes(snapshot: any): Promise<Recipe[]> {
  return snapshot.docs.map((docSnap: any) => ({
    ...docSnap.data(),
    id: docSnap.id,
  } as Recipe));
}

export async function getWeeklyRecipes(): Promise<Recipe[]> {
  const recipesCol = collection(db, 'recipes');
  const q = query(recipesCol, where('isWeekly', '==', true));
  const recipeSnapshot = await getDocs(q);
  return mapDocsToRecipes(recipeSnapshot);
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const recipesCol = collection(db, 'recipes');
  const q = query(recipesCol);
  const recipeSnapshot = await getDocs(q);
  return mapDocsToRecipes(recipeSnapshot);
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

  const ratingList = ratingSnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
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

export async function createRecipe(
  recipeData: RecipeInput,
  customId?: string
): Promise<Recipe> {
  const recipesCol = collection(db, 'recipes');
  const baseSlug = customId || slugifyRecipeName(recipeData.name);
  let recipeRef = baseSlug ? doc(db, 'recipes', baseSlug) : doc(recipesCol);

  if (baseSlug) {
    const existing = await getDoc(recipeRef);
    if (existing.exists()) {
      recipeRef = doc(db, 'recipes', `${baseSlug}-${Date.now().toString(36)}`);
    }
  }

  const normalized: RecipeInput = {
    name: recipeData.name.trim(),
    description: recipeData.description.trim(),
    longDescription: (recipeData.longDescription || recipeData.description).trim(),
    imageUrl: recipeData.imageUrl.trim(),
    imageHint: (recipeData.imageHint || recipeData.name.toLowerCase()).trim(),
    rating: typeof recipeData.rating === 'number' ? recipeData.rating : 5,
    reviews: typeof recipeData.reviews === 'number' ? recipeData.reviews : 0,
    ingredients: (recipeData.ingredients || []).map((i) => i.trim()).filter(Boolean),
    instructions: (recipeData.instructions || []).map((s) => s.trim()).filter(Boolean),
    price: Number(recipeData.price) || 0,
    region: recipeData.region,
    diet: recipeData.diet,
    spice: recipeData.spice,
    isWeekly: Boolean(recipeData.isWeekly),
  };

  await setDoc(recipeRef, normalized);
  return { ...normalized, id: recipeRef.id };
}

export async function updateRecipe(
  id: string,
  recipeData: Partial<RecipeInput>
): Promise<void> {
  const recipeRef = doc(db, 'recipes', id);
  await updateDoc(recipeRef, recipeData as Record<string, any>);
}

export async function deleteRecipe(id: string): Promise<void> {
  const recipeRef = doc(db, 'recipes', id);
  await deleteDoc(recipeRef);
}

export async function toggleRecipeWeekly(
  id: string,
  isWeekly: boolean
): Promise<void> {
  const recipeRef = doc(db, 'recipes', id);
  await updateDoc(recipeRef, { isWeekly });
}

export async function bulkCreateRecipes(recipes: RecipeInput[]): Promise<number> {
  if (!recipes.length) return 0;

  const batch = writeBatch(db);
  const usedIds = new Set<string>();

  for (const item of recipes) {
    let candidateId = slugifyRecipeName(item.name);
    if (!candidateId || usedIds.has(candidateId)) {
      candidateId = `${candidateId || 'recipe'}-${Math.random().toString(36).slice(2, 7)}`;
    }
    usedIds.add(candidateId);

    const recipeRef = doc(db, 'recipes', candidateId);
    const normalized: RecipeInput = {
      name: item.name.trim(),
      description: item.description.trim(),
      longDescription: (item.longDescription || item.description).trim(),
      imageUrl:
        item.imageUrl?.trim() ||
        'https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/main_image-v2-2048%20(1).jpg?alt=media&token=c8e72a75-16ec-4f4e-91d0-aa0c8835e9f7',
      imageHint: (item.imageHint || item.name.toLowerCase()).trim(),
      rating: typeof item.rating === 'number' ? item.rating : 5,
      reviews: typeof item.reviews === 'number' ? item.reviews : 0,
      ingredients: (item.ingredients || []).map((i) => String(i).trim()).filter(Boolean),
      instructions: (item.instructions || []).map((s) => String(s).trim()).filter(Boolean),
      price: Number(item.price) || 18,
      region: item.region || 'North',
      diet: item.diet || 'Veg',
      spice: item.spice || 'medium',
      isWeekly: Boolean(item.isWeekly),
    };

    batch.set(recipeRef, normalized, { merge: true });
  }

  await batch.commit();
  return recipes.length;
}

export async function uploadRecipeImage(file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `recipes/${Date.now()}_${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
