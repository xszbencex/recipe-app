import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeDeleteDialogComponent } from '../../../shared/components/recipe-delete-dialog/recipe-delete-dialog.component';
import { RecipeFormDialogComponent } from '../../../shared/components/recipe-form-dialog/recipe-form-dialog.component';
import { RECIPE_ID_ROUTE_PARAM } from '../../../shared/constants/router.constants';
import { DIFFICULTY_TRANSLATION_MAP } from '../../../shared/constants/translations.constants';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../shared/services/recipe.service';

@Component({
  imports: [DatePipe, RouterLink, RecipeDeleteDialogComponent, RecipeFormDialogComponent],
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
  protected readonly isEditOpen = signal(false);
  protected readonly isDeleteOpen = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly isDeleting = signal(false);
  protected readonly deleteError = signal<string | null>(null);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipeService);

  readonly difficultyTranslationMap = DIFFICULTY_TRANSLATION_MAP;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get(RECIPE_ID_ROUTE_PARAM);
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
      this.errorMessage.set(
        'A recept betöltése nem sikerült. Ellenőrizd a kapcsolatot, majd próbáld újra.',
      );
      this.isRetryable.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected openEditForm(): void {
    this.errorMessage.set(null);
    this.isEditOpen.set(true);
  }

  protected async saveRecipe(changes: Omit<Recipe, 'id' | 'createdAt'>): Promise<void> {
    const recipe = this.recipe();
    if (!recipe) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      await this.recipeService.updateRecipe(recipe.id, changes);
      this.recipe.set({ ...recipe, ...changes });
      this.isEditOpen.set(false);
    } catch {
      this.errorMessage.set('A recept mentése nem sikerült. Próbáld újra.');
    } finally {
      this.isSaving.set(false);
    }
  }

  protected closeEditForm(): void {
    this.isEditOpen.set(false);
    this.errorMessage.set(null);
  }

  protected openDeleteConfirmation(): void {
    this.deleteError.set(null);
    this.isDeleteOpen.set(true);
  }

  protected closeDeleteConfirmation(): void {
    if (this.isDeleting()) {
      return;
    }

    this.isDeleteOpen.set(false);
    this.deleteError.set(null);
  }

  protected async deleteRecipe(): Promise<void> {
    const recipe = this.recipe();
    if (!recipe || this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);
    this.deleteError.set(null);
    try {
      await this.recipeService.deleteRecipe(recipe.id);
      this.isDeleteOpen.set(false);
      await this.router.navigateByUrl('/');
    } catch {
      this.deleteError.set('A recept törlése nem sikerült. Próbáld újra.');
    } finally {
      this.isDeleting.set(false);
    }
  }
}
