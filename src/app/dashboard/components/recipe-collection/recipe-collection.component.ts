import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Recipe } from '../../../shared/models/recipe.model';

@Component({
  selector: 'app-recipe-collection',
  imports: [DatePipe],
  templateUrl: './recipe-collection.component.html',
})
export class RecipeCollectionComponent {
  readonly recipes = input.required<Recipe[]>();
  readonly totalRecipes = input.required<number>();
  readonly categories = input.required<string[]>();
  readonly selectedCategory = input.required<string>();
  readonly selectedDifficulty = input.required<string>();
  readonly isLoading = input(false);
  readonly categoryChange = output<string>();
  readonly difficultyChange = output<string>();
  readonly clearFilters = output<void>();
  readonly createRecipe = output<void>();

  protected onDifficultyChange(event: Event): void {
    this.difficultyChange.emit((event.target as HTMLSelectElement).value);
  }

  protected difficultyLabel(difficulty: Recipe['difficulty']): string {
    return { easy: 'Könnyű', medium: 'Közepes', hard: 'Haladó' }[difficulty];
  }
}
