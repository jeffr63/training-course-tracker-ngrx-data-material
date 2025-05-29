import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'admin',
    title: 'Administration',
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'courses',
    title: 'Courses',
    loadChildren: () => import('./courses/courses.routes'),
  },
  { path: 'home', title: 'Home', component: Dashboard },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
