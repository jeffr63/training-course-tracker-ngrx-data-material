import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from '../auth/auth.service';
import { Course } from '../models/course';
import { CourseService } from './course.service';
import { DeleteComponent } from './../modals/delete.component';
import { ModalDataService } from '../modals/modal-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatFormFieldModule, RouterModule],

  template: `
    <section class="mt-5">
      <header>
        <mat-form-field appearance="standard">
          <mat-label>Filter </mat-label>
          <input matInput (keyup)="applyFilter($event)" #input />
        </mat-form-field>
        <a
          mat-mini-fab
          color="primary"
          aria-label="Add new course"
          class="ml-5 fl1"
          *ngIf="authService.isAuthenticated"
          [routerLink]="['/courses/new']"
        >
          <mat-icon>add</mat-icon>
        </a>
      </header>

      <mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 600px">Title</th>
          <td mat-cell *matCellDef="let row">{{ row.title }}</td>
        </ng-container>

        <ng-container matColumnDef="instructor">
          <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 400px">Instructor</th>
          <td mat-cell *matCellDef="let row">{{ row.instructor }}</td>
        </ng-container>

        <ng-container matColumnDef="path">
          <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 150px">Path</th>
          <td mat-cell *matCellDef="let row">{{ row.path }}</td>
        </ng-container>

        <ng-container matColumnDef="source">
          <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 150px">Source</th>
          <td mat-cell *matCellDef="let row">{{ row.source }}</td>
        </ng-container>

        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row">
            <a
              mat-icon-button
              color="primary"
              [routerLink]="['/courses', row.id]"
              title="Edit"
              *ngIf="authService.isAuthenticated"
            >
              <mat-icon>edit</mat-icon>
            </a>
            <button
              mat-icon-button
              color="warn"
              (click)="deleteCourse(row.id)"
              title="Delete"
              *ngIf="authService.isAuthenticated"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns; let even = even" [ngClass]="{ gray: even }"></tr>

        <!-- Row shown when there is no matching data. -->
        <tr mat-row *matNoDataRow>
          <mat-cell colspan="4">No data matching the filter "{{ input.value }}"</mat-cell>
        </tr>
      </mat-table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 100]"
        [pageSize]="10"
        aria-label="Select page of courses"
      ></mat-paginator>
    </section>
  `,

  styles: [
    `
      .mt-5 {
        margin-top: 5px;
      }

      .ml-5 {
        margin-left: 5px;
      }

      .fl1 {
        float: right;
        vertical-align: middle;
      }

      .gray {
        background-color: #f5f5f5;
      }

      section {
        margin: 10px 20px;
      }

      .mat-form-field {
        font-size: 14px;
        width: 80%;
      }
    `,
  ],
})
export class CourseListComponent implements OnInit {
  loading = false;
  displayedColumns: string[] = ['title', 'instructor', 'path', 'source', 'action'];
  dataSource!: MatTableDataSource<Course>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private courseService: CourseService,
    private dialog: MatDialog,
    public authService: AuthService,
    private modalDataService: ModalDataService
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

  getAllCourses(setInitialSort: boolean): void {
    this.courseService.getAll().subscribe({
      next: (data) => this.setDataSource(data, setInitialSort),
    });
  }

  setDataSource(data, setInitialSort: boolean) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    if (setInitialSort) {
      this.sort.sort({ id: 'title', start: 'asc' } as MatSortable);
    }
    this.dataSource.sort = this.sort;
  }
}
