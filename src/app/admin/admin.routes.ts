import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { AuthService } from '@services/auth/auth.service';
import { pathNameResolver } from '@services/path/path-title-resolver.service';
import { sourceNameResolver } from '@services/source/source-title-resolver.service';
import { userNameResolver } from '@services/user/user-title-resolver.service';

export default [
  {
    path: '',
    children: [
      { path: '', loadComponent: () => import('./admin.component') },
      {
        path: 'sources',
        title: 'Sources',
        loadComponent: () => import('./source/source-list.component'),
      },
      {
        path: 'sources/:id',
        title: sourceNameResolver,
        loadComponent: () => import('./source/source-edit.component'),
      },
      {
        path: 'paths',
        title: 'Paths',
        loadComponent: () => import('./path/path-list.component'),
      },
      {
        path: 'paths/:id',
        title: pathNameResolver,
        loadComponent: () => import('./path/path-edit.component'),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./user/user-list.component'),
      },
      {
        path: 'users/:id',
        title: userNameResolver,
        loadComponent: () => import('./user/user-edit.component'),
      },
    ],
    canActivate: [() => inject(AuthService).isLoggedInAsAdmin()],
  },
] as Route[];
