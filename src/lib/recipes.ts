import type { Recipe } from '@/lib/types';

// In a real application, this data would be fetched from a CMS or database.
// The selection of recipes would change every Monday.
export const allRecipes: Recipe[] = [
  {
    id: 'chicken-tikka-masala',
    name: 'Chicken Tikka Masala',
    description: 'A classic, creamy tomato-based curry.',
    longDescription:
      'The quintessential British-Indian dish, Chicken Tikka Masala features yogurt-marinated chicken pieces grilled and then served in a rich, creamy tomato sauce. It\'s a perfect blend of smoky, tangy, and sweet flavors that has won hearts worldwide.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'chicken curry',
    rating: 4.8,
    reviews: 256,
    ingredients: ['Chicken breast', 'Yogurt', 'Tomato puree', 'Heavy cream', 'Garam masala', 'Ginger-garlic paste'],
    instructions: [
      'Marinate chicken in yogurt and spices for at least 1 hour.',
      'Grill or pan-sear the chicken until cooked through.',
      'Prepare the masala sauce with tomato puree, cream, and spices.',
      'Simmer the chicken in the sauce for 15 minutes.',
      'Garnish with fresh cilantro and serve hot with naan or rice.',
    ],
  },
  {
    id: 'lamb-rogan-josh',
    name: 'Lamb Rogan Josh',
    description: 'A fragrant and hearty lamb curry from Kashmir.',
    longDescription:
      'Lamb Rogan Josh is an aromatic curried meat dish of Persian or Kashmiri origin. It is made with red meat, traditionally lamb, mutton, or goat, and colored and flavored primarily by alkanet flower or root and Kashmiri chilies. It is one of the signature recipes of Kashmiri cuisine.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'lamb curry',
    rating: 4.9,
    reviews: 189,
    ingredients: ['Lamb shoulder', 'Yogurt', 'Kashmiri red chili', 'Fennel seeds', 'Cardamom', 'Cinnamon'],
    instructions: [
      'Brown the lamb in a pot with ghee.',
      'Add whole spices and fry until fragrant.',
      'Incorporate yogurt and powdered spices, cooking until oil separates.',
      'Add water, cover, and simmer until lamb is tender.',
      'Finish with a sprinkle of garam masala.',
    ],
  },
  {
    id: 'palak-paneer',
    name: 'Palak Paneer',
    description: 'A vegetarian classic with spinach and cottage cheese.',
    longDescription:
      'Palak Paneer is a popular Indian vegetarian dish consisting of paneer (a type of cottage cheese) in a smooth, creamy, and vibrant green spinach sauce. It is seasoned with ginger, garlic, garam masala, and other spices.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'vegetarian curry',
    rating: 4.7,
    reviews: 312,
    ingredients: ['Paneer', 'Spinach', 'Onion', 'Tomatoes', 'Ginger', 'Garlic', 'Cream'],
    instructions: [
      'Blanch spinach and blend to a smooth paste.',
      'Sauté onions, ginger, and garlic.',
      'Add tomatoes and cook until soft.',
      'Stir in the spinach puree and spices.',
      'Add paneer cubes and simmer for 5-7 minutes.',
      'Finish with a swirl of cream.',
    ],
  },
  {
    id: 'chana-masala',
    name: 'Chana Masala',
    description: 'A tangy and flavorful chickpea curry.',
    longDescription:
      'Chana Masala is a delicious and flavorful North Indian curry made by cooking chickpeas in a spicy onion-tomato masala gravy. It is naturally vegan and packed with protein, making it a healthy and satisfying meal.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'chickpea curry',
    rating: 4.6,
    reviews: 450,
    ingredients: ['Chickpeas', 'Onion', 'Tomatoes', 'Chana masala powder', 'Amchur (dried mango powder)', 'Cilantro'],
    instructions: [
      'Sauté onions until golden brown.',
      'Add ginger-garlic paste and tomatoes, cook until oil separates.',
      'Add chana masala powder and other spices.',
      'Stir in cooked chickpeas and simmer for 20 minutes.',
      'Garnish with fresh cilantro and a squeeze of lemon.',
    ],
  },
  {
    id: 'thai-green-curry',
    name: 'Thai Green Curry',
    description: 'A sweet and spicy curry with coconut milk.',
    longDescription:
      'Thai green curry is a central Thai variety of curry. The name "green" curry derives from the color of the dish, which comes from green chilis. The sweetness of coconut milk is balanced by the spice of the chilis and the savory notes of fish sauce, creating a complex and addictive flavor profile.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'thai curry',
    rating: 4.8,
    reviews: 215,
    ingredients: ['Chicken or Tofu', 'Green curry paste', 'Coconut milk', 'Thai basil', 'Bamboo shoots', 'Fish sauce'],
    instructions: [
      'Heat coconut cream in a wok until the oil separates.',
      'Add green curry paste and fry until aromatic.',
      'Add chicken or tofu and cook through.',
      'Pour in the rest of the coconut milk and bring to a simmer.',
      'Add vegetables and season with fish sauce and sugar.',
      'Stir in Thai basil before serving.',
    ],
  },
  {
    id: 'beef-rendang',
    name: 'Beef Rendang',
    description: 'A rich and tender Indonesian dry curry.',
    longDescription:
      'Rendang is a rich and tender coconut beef stew which is explosively flavorful. Originating from the Minangkabau people of Indonesia, this dish is slow-cooked for hours until the liquid evaporates and the meat absorbs all the complex flavors of the spices.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'beef curry',
    rating: 4.9,
    reviews: 178,
    ingredients: ['Beef chuck', 'Coconut milk', 'Lemongrass', 'Galangal', 'Kaffir lime leaves', 'Toasted coconut'],
    instructions: [
      'Create a spice paste by blending chillies, shallots, garlic, ginger, and galangal.',
      'Sauté the spice paste until fragrant.',
      'Add beef, coconut milk, lemongrass, and kaffir lime leaves.',
      'Simmer on low heat for 2-3 hours, stirring occasionally.',
      'Continue cooking until the sauce is very thick and has been absorbed by the beef.',
      'Stir in toasted coconut before serving.',
    ],
  },
];

export function getWeeklyRecipes() {
  // In a real app, logic would exist here to select different recipes each week.
  // For this demo, we'll just return the first 6.
  return allRecipes.slice(0, 6);
}

export function getRecipeById(id: string) {
  return allRecipes.find((recipe) => recipe.id === id);
}
