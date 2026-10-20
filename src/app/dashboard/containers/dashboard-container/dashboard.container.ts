import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../../shared/models/recipe.model';
import { AuthService } from '../../../shared/services/auth.service';
import { RecipeService } from '../../../shared/services/recipe.service';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { RecipeCollectionComponent } from '../../components/recipe-collection/recipe-collection.component';
import { RecipeFormDialogComponent } from '../../components/recipe-form-dialog/recipe-form-dialog.component';

@Component({
  selector: 'app-dashboard-container',
  imports: [DashboardHeaderComponent, RecipeCollectionComponent, RecipeFormDialogComponent],
  host: {
    class: 'block min-h-screen bg-base-200 font-sans text-base-content',
  },
  templateUrl: './dashboard.container.html',
})
export class DashboardContainerComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly selectedCategory = signal('Mind');
  protected readonly selectedDifficulty = signal('Mind');
  protected readonly isLoading = signal(true);
  protected readonly isCreateOpen = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);

  protected readonly categories = computed(() => [
    'Mind',
    ...Array.from(new Set(this.recipes().map((recipe) => recipe.category))).sort((a, b) =>
      a.localeCompare(b, 'hu'),
    ),
  ]);
  protected readonly filteredRecipes = computed(() => {
    const search = this.searchTerm().trim().toLocaleLowerCase('hu');

    return this.recipes().filter((recipe) => {
      const matchesSearch = `${recipe.title} ${recipe.description} ${recipe.category}`
        .toLocaleLowerCase('hu')
        .includes(search);
      const matchesCategory =
        this.selectedCategory() === 'Mind' || recipe.category === this.selectedCategory();
      const matchesDifficulty =
        this.selectedDifficulty() === 'Mind' || recipe.difficulty === this.selectedDifficulty();

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  });
  ngOnInit(): void {
    void this.loadRecipes();
  }

  protected onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected async loadRecipes(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.recipes.set(await this.recipeService.getRecipes());
    } catch {
      this.errorMessage.set(
        'A receptek betöltése nem sikerült. Ellenőrizd a kapcsolatot, majd próbáld újra.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async saveRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      await this.recipeService.addRecipe(recipe);
      this.closeCreateForm();
      await this.loadRecipes();
    } catch {
      this.errorMessage.set('A recept mentése nem sikerült. Próbáld újra.');
    } finally {
      this.isSaving.set(false);
    }
  }

  protected closeCreateForm(): void {
    this.isCreateOpen.set(false);
    this.errorMessage.set(null);
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('Mind');
    this.selectedDifficulty.set('Mind');
  }

  protected async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login');
  }
}
