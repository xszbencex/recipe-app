import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-recipe-delete-dialog',
  templateUrl: './recipe-delete-dialog.component.html',
})
export class RecipeDeleteDialogComponent {
  readonly isOpen = input(false);
  readonly recipeTitle = input('');
  readonly isDeleting = input(false);
  readonly deleteError = input<string | null>(null);

  readonly dismiss = output<void>();
  readonly confirm = output<void>();

  protected onDialogCancel(event: Event): void {
    if (this.isDeleting()) {
      event.preventDefault();
    }
  }

  protected onDialogClose(): void {
    if (!this.isDeleting()) {
      this.dismiss.emit();
    }
  }

  protected close(): void {
    if (this.isDeleting()) {
      return;
    }

    this.dismiss.emit();
  }
}
