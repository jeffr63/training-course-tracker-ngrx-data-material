import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { AuthService } from '@services/auth/auth.service';
import { Column } from '@models/column';
import { CourseService } from '@services/course/course.service';
import { DeleteModalComponent } from '@modals/delete/delete-modal.component';
import { DisplayTableComponent } from '@components/display-table.component';
import { ModalDataService } from '@services/common/modal-data.service';

@Component({
  selector: 'app-course-list',
  imports: [DisplayTableComponent],
  template: `
    <section class="mt-5">
      @if (courses()) {
      <app-display-table
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
        (edit)="editCourse($event)"></app-display-table>
      }
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
  readonly #authService = inject(AuthService);
  readonly #courseService = inject(CourseService);
  readonly #dialog = inject(MatDialog);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);

  protected readonly courses = toSignal(this.#courseService.entities$, { initialValue: [] });
  protected readonly isAuthenticated = this.#authService.isLoggedIn;

  protected readonly columns: Column[] = [
    { key: 'title', name: 'Title', width: '600px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'instructor', name: 'Instructor', width: '400px', type: 'sort', position: 'left' },
    { key: 'path', name: 'Path', width: '150px', type: 'sort', position: 'left' },
    { key: 'source', name: 'Source', width: '150px', type: 'sort', position: 'left' },
    { key: 'action', name: '', width: '50px', type: 'action', position: 'left' },
  ];

  ngOnInit() {
    this.getAllCourses();
  }

  protected deleteCourse(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this course will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.#dialog.open(DeleteModalComponent, { width: '500px' });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.#courseService.delete(id);
          this.getAllCourses();
        }
      });
  }

  protected editCourse(id) {
    this.#router.navigate(['/courses', id]);
  }

  private getAllCourses(): void {
    this.#courseService.getAll().pipe(take(1));
  }

  protected newCourse() {
    this.#router.navigate(['/courses/new']);
  }
}
