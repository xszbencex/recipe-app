import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CATEGORY_TRANSLATION_MAP,
  DIFFICULTY_TRANSLATION_MAP,
} from '../../constants/translations.constants';
import {
  Recipe,
  RECIPE_CATEGORIES,
  RECIPE_DIFFICULTIES,
  RecipeCategory,
  RecipeDifficulty,
} from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './recipe-form-dialog.component.html',
})
export class RecipeFormDialogComponent implements OnInit {
  readonly initialRecipe = input<Recipe | null>(null);
  readonly isSaving = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly dismiss = output<void>();
  readonly save = output<Omit<Recipe, 'id' | 'createdAt'>>();

  readonly recipeDifficulties = RECIPE_DIFFICULTIES;
  readonly difficultyTranslationMap = DIFFICULTY_TRANSLATION_MAP;
  readonly recipeCategories = RECIPE_CATEGORIES;
  readonly categoryTranslationMap = CATEGORY_TRANSLATION_MAP;

  protected readonly recipeForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    comments: new FormControl('', { nonNullable: true }),
    category: new FormControl<RecipeCategory>('dinner', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    difficulty: new FormControl<RecipeDifficulty>('easy', { nonNullable: true }),
    imageUrl: new FormControl<string | null>(null),
    ingredients: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    steps: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    const recipe = this.initialRecipe();
    if (!recipe) {
      return;
    }

    this.recipeForm.patchValue({
      title: recipe.title,
      comments: recipe.comments ?? '',
      category: recipe.category,
      difficulty: recipe.difficulty,
      imageUrl: recipe.imageUrl || null,
      ingredients: recipe.ingredients.join('\n'),
      steps: recipe.steps.join('\n'),
    });
  }

  protected submit(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const value = this.recipeForm.getRawValue();
    this.save.emit({
      title: value.title.trim(),
      comments: value.comments.trim(),
      category: value.category,
      difficulty: value.difficulty,
      imageUrl: value.imageUrl ? value.imageUrl.trim() : null,
      ingredients: this.lines(value.ingredients),
      steps: this.lines(value.steps),
    });
  }

  private lines(value: string): string[] {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }
}
