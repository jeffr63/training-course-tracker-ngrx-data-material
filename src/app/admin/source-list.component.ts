import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ReplaySubject, take, takeUntil } from 'rxjs';

import { Column } from '../models/column';
import { DeleteComponent } from '../modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table.component';
import { ModalDataService } from '../modals/modal-data.service';
import { Source } from '../models/sources';
import { SourceService } from '../services/source.service';

@Component({
  selector: 'app-source-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],

  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="sources"
        [isAuthenticated]="true"
        [isFilterable]="true"
        [includeAdd]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="sources"
        [tableColumns]="columns"
        (add)="newSource()"
        (delete)="deleteSource($event)"
        (edit)="editSource($event)"
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
export default class SourceListComponent implements OnInit, OnDestroy {
  sourceService = inject(SourceService);
  dialog = inject(MatDialog);
  modalDataService = inject(ModalDataService);
  router = inject(Router);

  columns: Column[] = [
    { key: 'name', name: 'Source', width: '600px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'action', name: '', width: '', type: 'action', position: 'left' },
  ];
  destroyed$ = new ReplaySubject<void>(1);
  sources: Source[];

  ngOnInit() {
    this.getAllSources();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  deleteSource(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this source?',
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
          this.sourceService.delete(id);
          this.getAllSources();
        }
      });
  }

  editSource(id: number) {
    this.router.navigate(['/admin/sources', id]);
  }

  getAllSources(): void {
    this.sourceService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.sources = data;
        },
      });
  }

  newSource() {
    this.router.navigate(['/admin/sources/new']);
  }
}
