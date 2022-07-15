import { CanActivateEdit } from '../auth/canActiveateEdit.guard';
import { CourseTitleResolverService } from './course-title-resolver.service';

export const COURSES_ROUTES = [
  {
    path: '',
    children: [
      { path: '', loadComponent: () => import('./course-list.component').then((m) => m.CourseListComponent) },
      {
        path: ':id',
        title: CourseTitleResolverService,
        loadComponent: () => import('./course-edit.component').then((m) => m.CourseEditComponent),
        canActivate: [CanActivateEdit],
      },
    ],
  },
];
