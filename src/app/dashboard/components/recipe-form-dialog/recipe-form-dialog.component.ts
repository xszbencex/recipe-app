import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recipe } from '../../../shared/models/recipe.model';

@Component({
  selector: 'app-recipe-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './recipe-form-dialog.component.html',
})
export class RecipeFormDialogComponent {
  readonly isSaving = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly dismiss = output<void>();
  readonly save = output<Omit<Recipe, 'id' | 'createdAt'>>();

  protected readonly recipeForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('Vacsora', { nonNullable: true, validators: [Validators.required] }),
    difficulty: new FormControl<Recipe['difficulty']>('easy', { nonNullable: true }),
    imageUrl: new FormControl('', { nonNullable: true }),
    ingredients: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    steps: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected submit(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const value = this.recipeForm.getRawValue();
    this.save.emit({
      title: value.title.trim(),
      description: value.description.trim(),
      category: value.category,
      difficulty: value.difficulty,
      imageUrl: value.imageUrl.trim() || undefined,
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
