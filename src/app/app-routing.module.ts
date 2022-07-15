import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'admin',
    title: 'Administration',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'courses',
    title: 'Courses',
    loadChildren: () => import('./courses/courses.module').then((m) => m.CoursesModule),
  },
  { path: 'home', title: 'Home', component: DashboardComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
