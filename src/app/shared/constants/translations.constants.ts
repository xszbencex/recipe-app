import { RecipeCategory, RecipeDifficulty } from '../models/recipe.model';

export const DIFFICULTY_TRANSLATION_MAP: Record<RecipeDifficulty, string> = {
  easy: 'Könnyű',
  medium: 'Közepes',
  hard: 'Haladó',
};

export const CATEGORY_TRANSLATION_MAP: Record<RecipeCategory, string> = {
  breakfast: 'Reggeli',
  soup: 'Leves',
  mainDish: 'Főétel',
  dinner: 'Vacsora',
  sweets: 'Sütemény',
  other: 'Egyéb',
};
