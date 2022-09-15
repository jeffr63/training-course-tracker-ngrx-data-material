import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { Subject, take, takeUntil } from 'rxjs';

import { Column } from '../models/column';
import { DeleteComponent } from '../modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table.component';
import { ModalDataService } from '../modals/modal-data.service';
import { Path } from '../models/paths';
import { PathService } from '../services/path.service';

@Component({
  selector: 'app-path-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf, RouterModule],

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
export class PathListComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    { key: 'name', name: 'Path', width: '600px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'action', name: '', width: '', type: 'action', position: 'left' },
  ];
  paths: Path[];
  componentIsDestroyed = new Subject<boolean>();

  constructor(
    private pathService: PathService,
    private dialog: MatDialog,
    private modalDataService: ModalDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllPaths();
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
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
      .pipe(takeUntil(this.componentIsDestroyed))
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
