import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { CourseTitleResolverService } from '../shared/resolvers/course-title-resolver.service';

export default [
  {
    path: '',
    children: [
      { path: '', loadComponent: () => import('./course-list.component') },
      {
        path: ':id',
        title: CourseTitleResolverService,
        loadComponent: () => import('./course-edit.component'),
        canActivate: [() => inject(AuthService).isLoggedIn()],
      },
    ],
  },
] as Route[];
