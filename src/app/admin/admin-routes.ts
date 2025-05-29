import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { AuthService } from '@services/auth/auth-service';
import { pathNameResolver } from '@services/path/path-title-resolver';
import { sourceNameResolver } from '@services/source/source-title-resolver';
import { userNameResolver } from '@services/user/user-title-resolver';

export default [
  {
    path: '',
    children: [
      { path: '', loadComponent: () => import('./admin-dashboard') },
      {
        path: 'sources',
        title: 'Sources',
        loadComponent: () => import('./source/source-list'),
      },
      {
        path: 'sources/:id',
        title: sourceNameResolver,
        loadComponent: () => import('./source/source-edit'),
      },
      {
        path: 'paths',
        title: 'Paths',
        loadComponent: () => import('./path/path-list'),
      },
      {
        path: 'paths/:id',
        title: pathNameResolver,
        loadComponent: () => import('./path/path-edit'),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./user/user-list'),
      },
      {
        path: 'users/:id',
        title: userNameResolver,
        loadComponent: () => import('./user/user-edit'),
      },
    ],
    canActivate: [() => inject(AuthService).isLoggedInAsAdmin()],
  },
] as Route[];
