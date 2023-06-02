import { Component, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { Column } from '../shared/models/column';
import { Course } from '../shared/models/course';
import { CourseService } from '../shared/services/course.service';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { ModalDataService } from '../shared/modals/modal-data.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],

  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="courses()"
        [includeAdd]="true"
        [isAuthenticated]="isAuthenticated()"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="courses()"
        [tableColumns]="columns"
        (add)="newCourse()"
        (delete)="deleteCourse($event)"
        (edit)="editCourse($event)"
      ></app-display-table>
    </section>
  `,

  styles: [
    `
      section {
        margin: 10px 20px;
      }
    `,
  ],
})
export default class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private modalDataService = inject(ModalDataService);
  private router = inject(Router);

  courses = toSignal(this.courseService.entities$, { initialValue: [] });
  isAuthenticated = this.authService.isLoggedIn;

  columns: Column[] = [
    { key: 'title', name: 'Title', width: '600px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'instructor', name: 'Instructor', width: '400px', type: 'sort', position: 'left' },
    { key: 'path', name: 'Path', width: '150px', type: 'sort', position: 'left' },
    { key: 'source', name: 'Source', width: '150px', type: 'sort', position: 'left' },
    { key: 'action', name: '', width: '50px', type: 'action', position: 'left' },
  ];

  ngOnInit() {
    this.getAllCourses();
  }

  deleteCourse(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this course will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.courseService.delete(id);
          this.getAllCourses();
        }
      });
  }

  editCourse(id) {
    this.router.navigate(['/courses', id]);
  }

  getAllCourses(): void {
    this.courseService.getAll().pipe(take(1));
  }

  newCourse() {
    this.router.navigate(['/courses/new']);
  }
}
