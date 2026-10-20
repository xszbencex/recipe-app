import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LOGIN_PATH } from '../../shared/constants/router.constants';
import { AuthService } from '../../shared/services/auth.service';

export const loggedInGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!!authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree([LOGIN_PATH]);
};
