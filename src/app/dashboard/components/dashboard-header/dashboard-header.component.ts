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
  readonly logout = output<void>();

  protected profileInitials(): string {
    const name = this.displayName()?.trim();

    if (name) {
      return name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
    }

    return this.email()?.slice(0, 1).toUpperCase() ?? 'R';
  }
}
