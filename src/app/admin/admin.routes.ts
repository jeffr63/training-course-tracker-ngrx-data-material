import { Route } from '@angular/router';

import { CanActivateAdmin } from '../auth/canActiveateAdmin.guard';
import { UserTitleResolverService } from '../services/user-title-resolver.service';
import { PathTitleResolverService } from '../services/path-title-resolver.service';
import { SourceTitleResolverService } from '../services/source-title-resolver.service';

export default [
  {
    path: '',
    children: [
      { path: '', loadComponent: () => import('./admin.component') },
      {
        path: 'sources',
        title: 'Sources',
        loadComponent: () => import('./source-list.component'),
      },
      {
        path: 'sources/:id',
        title: SourceTitleResolverService,
        loadComponent: () => import('./source-edit.component'),
      },
      {
        path: 'paths',
        title: 'Paths',
        loadComponent: () => import('./path-list.component'),
      },
      {
        path: 'paths/:id',
        title: PathTitleResolverService,
        loadComponent: () => import('./path-edit.component'),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./user-list.component'),
      },
      {
        path: 'users/:id',
        title: UserTitleResolverService,
        loadComponent: () => import('./user-edit.component'),
      },
    ],
    canActivate: [CanActivateAdmin],
  },
] as Route[];
