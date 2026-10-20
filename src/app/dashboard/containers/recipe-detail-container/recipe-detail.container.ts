import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../shared/services/recipe.service';

@Component({
  selector: 'app-recipe-detail-container',
  imports: [DatePipe, RouterLink],
  host: {
    class: 'block min-h-screen bg-base-200 font-sans text-base-content',
  },
  templateUrl: './recipe-detail.container.html',
})
export class RecipeDetailContainerComponent implements OnInit {
  protected readonly recipe = signal<Recipe | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isRetryable = signal(false);
  protected readonly recipeId = signal('');
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      this.errorMessage.set('Ez a recept nem található.');
      return;
    }

    this.recipeId.set(id);
    void this.loadRecipe(id);
  }

  protected async loadRecipe(id: string): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.isRetryable.set(false);

    try {
      const recipe = await this.recipeService.getRecipe(id);
      if (!recipe) {
        this.errorMessage.set('Ez a recept nem található.');
        return;
      }

      this.recipe.set(recipe);
    } catch {
      this.errorMessage.set('A recept betöltése nem sikerült. Ellenőrizd a kapcsolatot, majd próbáld újra.');
      this.isRetryable.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected difficultyLabel(difficulty: Recipe['difficulty']): string {
    return { easy: 'Könnyű', medium: 'Közepes', hard: 'Haladó' }[difficulty];
  }
}
