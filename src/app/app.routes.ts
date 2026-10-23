import { Routes } from '@angular/router';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { DashboardContainerComponent } from './dashboard/containers/dashboard-container/dashboard.container';
import { LoginComponent } from './login/containers/login-container/login.container';
import {
  DASHBOARD_PATH,
  DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  RECIPE_ID_ROUTE_PARAM,
  RECIPES_ROUTE,
} from './shared/constants/router.constants';

export const routes: Routes = [
  {
    path: '',
    canActivate: [loggedInGuard],
    children: [
      {
        path: DASHBOARD_ROUTE,
        component: DashboardContainerComponent,
      },
      {
        path: RECIPES_ROUTE,
        children: [
          {
            path: `:${RECIPE_ID_ROUTE_PARAM}`,
            loadComponent: () =>
              import('./recipes/containers/recipe-detail-container/recipe-detail.container').then(
                (module) => module.RecipeDetailContainerComponent,
              ),
          },
        ],
      },
    ],
  },
  { path: LOGIN_ROUTE, component: LoginComponent },
  { path: '**', redirectTo: DASHBOARD_PATH, pathMatch: 'full' },
];
