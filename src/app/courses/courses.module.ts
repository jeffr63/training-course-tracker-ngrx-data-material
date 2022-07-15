import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CanActivateEdit } from '../auth/canActiveateEdit.guard';
import { CourseTitleResolverService } from './course-title-resolver.service';

const routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CoursesModule {}
