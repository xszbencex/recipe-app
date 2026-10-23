import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { Recipe, RecipeCategory, RecipeDifficulty } from '../models/recipe.model';

export interface RecipeFilters {
  category?: RecipeCategory;
  difficulty?: RecipeDifficulty;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  async getRecipe(id: string): Promise<Recipe | null> {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    const recipeSnapshot = await getDoc(doc(db, 'recipes', id));
    if (!recipeSnapshot.exists() || recipeSnapshot.data()['authorId'] !== user.uid) {
      return null;
    }

    return {
      ...recipeSnapshot.data(),
      id: recipeSnapshot.id,
    } as Recipe;
  }

  async getRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const constraints: QueryConstraint[] = [where('authorId', '==', user.uid)];

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
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Csak bejelentkezett felhasználó hozhat létre receptet!');
    }

    const recipeRef = await addDoc(collection(db, 'recipes'), {
      ...recipe,
      authorId: user.uid,
      createdAt: serverTimestamp(),
    });

    return recipeRef.id;
  }

  async updateRecipe(id: string, changes: Omit<Recipe, 'id' | 'createdAt'>): Promise<void> {
    const recipeRef = await this.getOwnedRecipeReference(id);
    await updateDoc(recipeRef, changes);
  }

  async deleteRecipe(id: string): Promise<void> {
    const recipeRef = await this.getOwnedRecipeReference(id);
    await deleteDoc(recipeRef);
  }

  private async getOwnedRecipeReference(id: string): Promise<DocumentReference> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('A recept módosításához be kell jelentkezned.');
    }

    const recipeRef = doc(db, 'recipes', id);
    const recipeSnapshot = await getDoc(recipeRef);
    if (!recipeSnapshot.exists() || recipeSnapshot.data()['authorId'] !== user.uid) {
      throw new Error('A recept nem található, vagy nincs jogosultságod a módosításához.');
    }

    return recipeRef;
  }
}
