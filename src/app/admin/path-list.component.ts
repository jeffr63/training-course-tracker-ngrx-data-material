import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { ReplaySubject, take, takeUntil } from 'rxjs';

import { Column } from '../shared/models/column';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { ModalDataService } from '../shared/modals/modal-data.service';
import { Path } from '../shared/models/paths';
import { PathService } from '../shared/services/path.service';

@Component({
  selector: 'app-path-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf, RouterLink],

  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="paths"
        [isAuthenticated]="true"
        [isFilterable]="true"
        [includeAdd]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="paths"
        [tableColumns]="columns"
        (add)="newPath()"
        (delete)="deletePath($event)"
        (edit)="editPath($event)"
      ></app-display-table>
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
export default class PathListComponent implements OnInit, OnDestroy {
  pathService = inject(PathService);
  dialog = inject(MatDialog);
  modalDataService = inject(ModalDataService);
  router = inject(Router);

  columns: Column[] = [
    { key: 'name', name: 'Path', width: '600px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'action', name: '', width: '', type: 'action', position: 'left' },
  ];
  paths: Path[];
  destroyed$ = new ReplaySubject<void>(1);

  ngOnInit() {
    this.getAllPaths();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  deletePath(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this path?',
      body: 'All information associated to this path will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.pathService.delete(id);
          this.getAllPaths();
        }
      });
  }

  editPath(id: number) {
    this.router.navigate(['/admin/paths', id]);
  }

  getAllPaths(): void {
    this.pathService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.paths = data;
        },
      });
  }

  newPath() {
    this.router.navigate(['/admin/paths/new']);
  }
}
