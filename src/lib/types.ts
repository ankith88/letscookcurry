export type Recipe = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  imageHint: string;
  rating: number;
  reviews: number;
  ingredients: string[];
  instructions: string[];
};

export type Order = {
  id: string;
  date: string;
  items: Recipe[];
  total: number;
};
