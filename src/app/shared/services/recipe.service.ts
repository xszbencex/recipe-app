import { Service } from '@angular/core';
import {
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { Recipe } from '../models/recipe.model';

export interface RecipeFilters {
  category?: string;
  difficulty?: Recipe['difficulty'];
  name?: string;
}

@Service()
export class RecipeService {
  async getRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
    const constraints: QueryConstraint[] = [];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.difficulty) {
      constraints.push(where('difficulty', '==', filters.difficulty));
    }

    const recipesCollection = collection(db, 'recipes');
    const recipesQuery = constraints.length
      ? query(recipesCollection, ...constraints)
      : recipesCollection;
    const snapshot = await getDocs(recipesQuery);
    const recipes = snapshot.docs.map(
      (recipeDoc) =>
        ({
          id: recipeDoc.id,
          ...recipeDoc.data(),
        }) as Recipe,
    );
    const searchTerm = filters.name?.trim().toLocaleLowerCase();

    return searchTerm
      ? recipes.filter((recipe) => recipe.title.toLocaleLowerCase().includes(searchTerm))
      : recipes;
  }

  async addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<string> {
    const recipeRef = await addDoc(collection(db, 'recipes'), {
      ...recipe,
      createdAt: serverTimestamp(),
    });

    return recipeRef.id;
  }

  updateRecipe(id: string, changes: Partial<Omit<Recipe, 'id' | 'createdAt'>>): Promise<void> {
    return updateDoc(doc(db, 'recipes', id), changes);
  }

  deleteRecipe(id: string): Promise<void> {
    return deleteDoc(doc(db, 'recipes', id));
  }
}
