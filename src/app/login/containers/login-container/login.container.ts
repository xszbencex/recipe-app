import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage, ReactiveFormsModule, RouterLink],
  host: {
    class: 'block min-h-screen bg-base-200 font-sans text-base-content',
  },
  templateUrl: './login.container.html',
})
export class LoginComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async submit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);
    const { email, password } = this.loginForm.getRawValue();

    try {
      await this.auth.signIn(email, password);
      await this.router.navigateByUrl('/dashboard');
    } catch (error: unknown) {
      this.errorMessage.set(this.getErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async logout(): Promise<void> {
    this.errorMessage.set(null);

    try {
      await this.auth.signOut();
    } catch (error: unknown) {
      this.errorMessage.set(this.getErrorMessage(error));
    }
  }

  private getErrorMessage(error: unknown): string {
    if (!(error instanceof FirebaseError)) {
      return 'Nem sikerült kapcsolódni. Ellenőrizd az internetkapcsolatot, majd próbáld újra.';
    }

    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Hibás e-mail cím vagy jelszó.';
      case 'auth/user-disabled':
        return 'Ez a felhasználói fiók le van tiltva.';
      case 'auth/too-many-requests':
        return 'Túl sok sikertelen próbálkozás. Próbáld újra később.';
      case 'auth/network-request-failed':
        return 'Hálózati hiba. Ellenőrizd az internetkapcsolatot.';
      default:
        return 'A bejelentkezés nem sikerült. Próbáld újra.';
    }
  }
}
