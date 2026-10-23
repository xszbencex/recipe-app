import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './shared/services/auth.service';
registerLocaleData(localeHu);

function initializeAuth() {
  const authService = inject(AuthService);
  return authService.initAuth();
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(initializeAuth),
    { provide: LOCALE_ID, useValue: 'hu-HU' },
  ],
};
