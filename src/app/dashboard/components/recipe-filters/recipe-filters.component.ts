import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  CATEGORY_TRANSLATION_MAP,
  DIFFICULTY_TRANSLATION_MAP,
} from '../../../shared/constants/translations.constants';
import {
  RECIPE_CATEGORIES,
  RECIPE_DIFFICULTIES,
  RecipeCategory,
  RecipeDifficulty,
} from '../../../shared/models/recipe.model';

export interface RecipeFilterControls {
  search: FormControl<string>;
  category: FormControl<RecipeCategory | null>;
  difficulty: FormControl<RecipeDifficulty | null>;
}

@Component({
  selector: 'app-recipe-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './recipe-filters.component.html',
})
export class RecipeFiltersComponent {
  readonly filterForm = input.required<FormGroup<RecipeFilterControls>>();
  readonly createRecipe = output<void>();

  readonly recipeCategories = RECIPE_CATEGORIES;
  readonly recipeDifficulties = RECIPE_DIFFICULTIES;
  readonly categoryTranslationMap = CATEGORY_TRANSLATION_MAP;
  readonly difficultyTranslationMap = DIFFICULTY_TRANSLATION_MAP;
}
