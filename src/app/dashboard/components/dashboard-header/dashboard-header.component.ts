import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink],
  templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent {
  readonly email = input<string | null>(null);
  readonly displayName = input<string | null>(null);
  readonly createRecipe = output<void>();
  readonly logout = output<void>();
  readonly searchChange = output<string>();

  protected onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
