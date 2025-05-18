
export type User = {
  id: string;
  username: string;
  password: string; // En production, il faudrait hasher les mots de passe
  role: 'user' | 'admin';
};

export type Region = {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  polygonCoords?: [number, number][]; // Pour dessiner la région
};

export type Recipe = {
  id: string;
  name: string;
  nameAr?: string; // Nom en arabe
  regionId: string;
  description: string;
  ingredients: string[];
  steps: string[];
  imageUrl: string;
  category: 'plat' | 'dessert' | 'boisson' | 'entrée';
  preparationTime: number; // en minutes
  cookingTime: number; // en minutes
  servings: number;
  difficulty: 'facile' | 'moyen' | 'difficile';
  createdAt: number; // timestamp
  createdBy: string; // userId
};

export type RecipeVariant = {
  id: string;
  recipeId: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  imageUrl?: string;
  createdAt: number; // timestamp
  createdBy: string; // userId
  votes: number;
  voterIds: string[]; // tableau des userIds qui ont voté
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};
