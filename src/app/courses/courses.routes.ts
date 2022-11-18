import { Route } from '@angular/router';

import { CanActivateEdit } from '../auth/canActiveateEdit.guard';
import { CourseTitleResolverService } from './course-title-resolver.service';

export default [
  {
    path: '',
    children: [
      { path: '', loadComponent: () => import('./course-list.component') },
      {
        path: ':id',
        title: CourseTitleResolverService,
        loadComponent: () => import('./course-edit.component'),
        canActivate: [CanActivateEdit],
      },
    ],
  },
] as Route[];
