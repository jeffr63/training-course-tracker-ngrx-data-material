import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';

import { AuthService } from '../auth/auth.service';
import { Column } from '../models/column';
import { Course } from '../models/course';
import { CourseService } from './course.service';
import { DeleteComponent } from './../modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table.component';
import { ModalDataService } from '../modals/modal-data.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent, RouterModule],

  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="courses"
        [isAuthenticated]="authService.isAuthenticated"
        [isFilterable]="true"
        [includeAdd]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="courses"
        [tableColumns]="columns"
        (sort)="sortData($event)"
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
export class CourseListComponent implements OnInit {
  columns: Column[] = [
    { key: 'title', name: 'Title', width: '600px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'instructor', name: 'Instructor', width: '400px', type: 'sort', position: 'left' },
    { key: 'path', name: 'Path', width: '150px', type: 'sort', position: 'left' },
    { key: 'source', name: 'Source', width: '150px', type: 'sort', position: 'left' },
    { key: 'action', name: '', width: '50px', type: 'action', position: 'left' },
  ];
  public defaultSortColumn = 'title';
  loading = false;
  courses: Course[];

  constructor(
    private courseService: CourseService,
    private dialog: MatDialog,
    public authService: AuthService,
    private modalDataService: ModalDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllCourses(true);
  }

  deleteCourse(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this course will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'delete') {
        this.courseService.delete(id);
        this.getAllCourses(false);
      }
    });
  }

  editCourse(id) {
    this.router.navigate(['/courses', id]);
  }

  getAllCourses(setInitialSort: boolean): void {
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.courses = data;
        // if (setInitialSort) {
        //   this.sortData({ active: 'title', direction: 'asc' });
        // }
      },
    });
  }

  newCourse() {
    this.router.navigate(['/courses/new']);
  }

  sortData(sortParameters: Sort) {
    const keyName = sortParameters.active;
    if (sortParameters.direction === 'asc') {
      this.courses = this.courses.sort((a: Course, b: Course) => a[keyName].localeCompare(b[keyName]));
    } else if (sortParameters.direction === 'desc') {
      this.courses = this.courses.sort((a: Course, b: Course) => b[keyName].localeCompare(a[keyName]));
    } else {
      this.getAllCourses(false);
      return this.courses;
    }
  }
}
