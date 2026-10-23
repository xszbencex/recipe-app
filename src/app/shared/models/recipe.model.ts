import { Timestamp } from 'firebase/firestore';

export const RECIPE_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'sweets', 'other'] as const;
export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export const RECIPE_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type RecipeDifficulty = (typeof RECIPE_DIFFICULTIES)[number];

export interface Recipe {
  id: string;
  title: string;
  category: RecipeCategory;
  difficulty: RecipeDifficulty;
  ingredients: string[];
  steps: string[];
  imageUrl: string | null;
  comments?: string;
  createdAt?: Timestamp;
}
