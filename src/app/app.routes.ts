import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'server', pathMatch: 'full' },
  {
    /** ログイン */
    path: 'login',
    loadComponent: () =>
      import('./pages/client/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    /** ダッシュボード */
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/client/dashboard/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'server',
    loadComponent: () =>
      import('./pages/server/server.component').then((c) => c.ServerComponent),
  },
  {
    path: 'client',
    loadComponent: () =>
      import('./pages/client/client.component').then((c) => c.ClientComponent),
  },
  {
    path: 'prerender',
    loadComponent: () =>
      import('./pages/prerender/prerender.component').then(
        (c) => c.PrerenderComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'server',
  },
];
