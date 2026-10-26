import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CATEGORY_TRANSLATION_MAP,
  DIFFICULTY_TRANSLATION_MAP,
} from '../../../shared/constants/translations.constants';
import { Recipe } from '../../../shared/models/recipe.model';
import { RECIPES_PATH } from '../../../shared/constants/router.constants';
import { countIngredients } from '../../../shared/utils/ingredient.utils';

@Component({
  selector: 'app-recipe-collection',
  imports: [DatePipe, RouterLink],
  templateUrl: './recipe-collection.component.html',
})
export class RecipeCollectionComponent {
  readonly recipes = input.required<Recipe[]>();
  readonly totalRecipes = input.required<number>();
  readonly loadError = input<string | null>(null);
  readonly isLoading = input(false);
  readonly retryLoading = output<void>();
  readonly clearFilters = output<void>();
  readonly createRecipe = output<void>();

  readonly difficultyTranslationMap = DIFFICULTY_TRANSLATION_MAP;
  readonly categoryTranslationMap = CATEGORY_TRANSLATION_MAP;
  readonly recipesPath = RECIPES_PATH;
  protected readonly ingredientCount = countIngredients;
}
