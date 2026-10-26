import { NgClass } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeFormDialogComponent } from '../../../shared/components/recipe-form-dialog/recipe-form-dialog.component';
import { Recipe, RecipeCategory, RecipeDifficulty } from '../../../shared/models/recipe.model';
import { AuthService } from '../../../shared/services/auth.service';
import { RecipeService } from '../../../shared/services/recipe.service';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { RecipeCollectionComponent } from '../../components/recipe-collection/recipe-collection.component';
import {
  RecipeFilterControls,
  RecipeFiltersComponent,
} from '../../components/recipe-filters/recipe-filters.component';

@Component({
  imports: [
    DashboardHeaderComponent,
    RecipeFiltersComponent,
    RecipeCollectionComponent,
    RecipeFormDialogComponent,
    NgClass,
  ],
  templateUrl: './dashboard.container.html',
})
export class DashboardContainerComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly filterForm = new FormGroup<RecipeFilterControls>({
    search: new FormControl('', { nonNullable: true }),
    category: new FormControl<RecipeCategory | null>(null),
    difficulty: new FormControl<RecipeDifficulty | null>(null),
  });
  private readonly filterValues = signal(this.filterForm.getRawValue());
  protected readonly isLoading = signal(true);
  protected readonly isCreateOpen = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly loadErrorMessage = signal<string | null>(null);
  protected readonly createErrorMessage = signal<string | null>(null);
  private readonly destroyRef = inject(DestroyRef);
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);

  protected readonly filteredRecipes = computed(() => {
    const filters = this.filterValues();
    const search = filters.search.trim().toLocaleLowerCase('hu');

    return this.recipes().filter((recipe) => {
      const matchesSearch = `${recipe.title} ${recipe.comments ?? ''} ${recipe.category}`
        .toLocaleLowerCase('hu')
        .includes(search);
      const matchesCategory = filters.category === null || recipe.category === filters.category;
      const matchesDifficulty =
        filters.difficulty === null || recipe.difficulty === filters.difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  });
  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filterValues.set(this.filterForm.getRawValue()));
    void this.loadRecipes();
  }

  protected async loadRecipes(): Promise<void> {
    this.isLoading.set(true);
    this.loadErrorMessage.set(null);

    try {
      this.recipes.set(await this.recipeService.getRecipes());
    } catch {
      this.loadErrorMessage.set(
        'A receptek betöltése nem sikerült. Ellenőrizd a kapcsolatot, majd próbáld újra.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async saveRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<void> {
    this.isSaving.set(true);
    this.createErrorMessage.set(null);

    try {
      await this.recipeService.addRecipe(recipe);
      this.closeCreateForm();
      await this.loadRecipes();
    } catch {
      this.createErrorMessage.set('A recept mentése nem sikerült. Próbáld újra.');
    } finally {
      this.isSaving.set(false);
    }
  }

  protected closeCreateForm(): void {
    this.isCreateOpen.set(false);
    this.createErrorMessage.set(null);
  }

  protected openCreateForm(): void {
    this.createErrorMessage.set(null);
    this.isCreateOpen.set(true);
  }

  protected clearFilters(): void {
    this.filterForm.reset({ search: '', category: null, difficulty: null });
  }

  protected async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login');
  }
}
