import { Routes } from '@angular/router';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { DashboardContainerComponent } from './dashboard/containers/dashboard-container/dashboard.container';
import { LoginComponent } from './login/containers/login-container/login.container';
import { DASHBOARD_PATH, DASHBOARD_ROUTE, LOGIN_ROUTE } from './shared/constants/router.constants';

export const routes: Routes = [
  {
    path: 'recipes/:id',
    loadComponent: () =>
      import('./dashboard/containers/recipe-detail-container/recipe-detail.container').then(
        (module) => module.RecipeDetailContainerComponent,
      ),
    canActivate: [loggedInGuard],
  },
  {
    path: DASHBOARD_ROUTE,
    component: DashboardContainerComponent,
    canActivate: [loggedInGuard],
    pathMatch: 'full',
  },
  { path: LOGIN_ROUTE, component: LoginComponent },
  { path: '**', redirectTo: DASHBOARD_PATH, pathMatch: 'full' },
];
