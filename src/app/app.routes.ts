import { Routes } from '@angular/router';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { DashboardContainerComponent } from './dashboard/containers/dashboard-container/dashboard.container';
import { LoginComponent } from './login/containers/login-container/login.container';
import { DASHBOARD_PATH, DASHBOARD_ROUTE, LOGIN_ROUTE } from './shared/constants/router.constants';

export const routes: Routes = [
  { path: DASHBOARD_ROUTE, component: DashboardContainerComponent, canActivate: [loggedInGuard] },
  { path: LOGIN_ROUTE, component: LoginComponent },
  { path: '**', redirectTo: DASHBOARD_PATH, pathMatch: 'full' },
];
