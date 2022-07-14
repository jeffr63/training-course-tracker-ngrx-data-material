import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CanActivateEdit } from '../auth/canActiveateEdit.guard';
import { CourseEditComponent } from './course-edit.component';
import { CourseListComponent } from './course-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../material.module';
import { CourseTitleResolverService } from './course-title-resolver.service';

const routes = [
  {
    path: '',
    children: [
      { path: '', component: CourseListComponent },
      {
        path: ':id',
        title: CourseTitleResolverService,
        component: CourseEditComponent,
        canActivate: [CanActivateEdit],
      },
    ],
  },
];

@NgModule({
  declarations: [CourseEditComponent, CourseListComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule.forChild(routes)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CoursesModule {}
