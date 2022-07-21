import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from '../auth/auth.service';
import { Column } from '../models/column';
import { Course } from '../models/course';
import { CourseService } from './course.service';
import { DeleteComponent } from './../modals/delete.component';
import { ListHeaderComponent } from '../shared/list-header.component';
import { ModalDataService } from '../modals/modal-data.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, ListHeaderComponent, MaterialModule, RouterModule],

  template: `
    <section class="mt-5">
      <app-list-header
        [isAuthenticated]="authService.isAuthenticated"
        (addNew)="newCourse()"
        (applyFilter)="applyFilter($event)"
      ></app-list-header>

      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">
        <ng-container [matColumnDef]="column.key" *ngFor="let column of columns">
          <ng-container *ngIf="column.type === 'sort'">
            <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: {{ column.width }}">
              {{ column.title }}
            </th>
            <td mat-cell *matCellDef="let element">{{ element[column.key] }}</td>
          </ng-container>
          <ng-container *ngIf="column.type === 'actions'">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let element">
              <a
                mat-icon-button
                color="primary"
                (click)="editCourse(element.id)"
                title="Edit"
                *ngIf="authService.isAuthenticated"
              >
                <mat-icon>edit</mat-icon>
              </a>
              <button
                mat-icon-button
                color="warn"
                (click)="deleteCourse(element.id)"
                title="Delete"
                *ngIf="authService.isAuthenticated"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="dataColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: dataColumns; let even = even" [ngClass]="{ gray: even }"></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="5">No data matching the filter</td>
        </tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 100]"
        [pageSize]="10"
        aria-label="Select page of courses"
      ></mat-paginator>
    </section>
  `,

  styles: [
    `
      table {
        width: 100%;
      }
      section {
        margin: 10px 20px;
      }
    `,
  ],
})
export class CourseListComponent implements OnInit {
  columns: Column[] = [
    { key: 'title', title: 'Title', width: '600px', type: 'sort' },
    { key: 'instructor', title: 'Instructor', width: '400px', type: 'sort' },
    { key: 'path', title: 'Path', width: '150px', type: 'sort' },
    { key: 'source', title: 'Source', width: '150px', type: 'sort' },
    { key: 'action', title: '', width: '', type: 'actions' },
  ];
  dataColumns = this.columns.map((col) => col.key);
  dataSource!: MatTableDataSource<Course>;
  loading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      next: (data) => this.setDataSource(data, setInitialSort),
    });
  }

  newCourse() {
    this.router.navigate(['/courses/new']);
  }

  setDataSource(data, setInitialSort: boolean) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    if (setInitialSort) {
      this.sort.sort({ id: 'title', start: 'asc' } as MatSortable);
    }
    this.sort.disableClear = true;
    this.dataSource.sort = this.sort;
  }
}
