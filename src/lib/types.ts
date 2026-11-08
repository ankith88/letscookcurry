
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
  price: number;
  region: "South" | "North" | "West" | "East";
  diet: "Non-Veg" | "Veg";
  isWeekly?: boolean;
  spice: "mild" | "medium" | "hot" | "very-hot";
};

export type CartItem = Recipe & {
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
};

export type Rating = {
  rating: number;
  comment: string;
  // This will be a string in ISO format on the client
  createdAt: string; 
};

export type OrderWindowMode = 'auto' | 'open' | 'closed';

export type SiteSettings = {
  orderingFeatureEnabled: boolean;
  orderWindowMode: OrderWindowMode;
  adminEmails: string[];
  updatedAt?: string;
  updatedBy?: string;
};
