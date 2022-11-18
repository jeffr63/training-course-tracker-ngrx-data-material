import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

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
  { path: 'home', title: 'Home', component: DashboardComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
