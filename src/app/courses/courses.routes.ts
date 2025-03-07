import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { AuthService } from '@services/auth/auth.service';
import { courseTitleResolver } from '@services/course/course-title-resolver.service';

export default [
  {
    path: '',
    children: [
      { path: '', loadComponent: () => import('./course-list.component') },
      {
        path: ':id',
        title: courseTitleResolver,
        loadComponent: () => import('./course-edit.component'),
        canActivate: [() => inject(AuthService).isLoggedIn()],
      },
    ],
  },
] as Route[];
