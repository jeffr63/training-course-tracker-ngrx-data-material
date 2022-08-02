import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DeleteComponent } from '../modals/delete.component';
import { ModalDataService } from '../modals/modal-data.service';
import { Source } from '../models/sources';
import { SourceService } from '../services/source.service';
import { Column } from '../models/column';
import { DisplayTableComponent } from '../shared/display-table.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-source-list',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent, RouterModule],

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
        (sort)="sortData($event)"
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
export class SourceListComponent implements OnInit {
  columns: Column[] = [
    { key: 'name', name: 'Source', width: '600px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'action', name: '', width: '', type: 'action', position: 'left' },
  ];
  sources: Source[];

  constructor(
    private sourceService: SourceService,
    private dialog: MatDialog,
    private modalDataService: ModalDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllSources(true);
  }

  deleteSource(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this source?',
      body: 'All information associated to this path will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'delete') {
        this.sourceService.delete(id);
        this.getAllSources(false);
      }
    });
  }

  editSource(id: number) {
    this.router.navigate(['/admin/sources', id]);
  }

  getAllSources(setInitialSort: boolean): void {
    this.sourceService.getAll().subscribe({
      next: (data) => {
        this.sources = data;
        // if (setInitialSort) {
        //   this.sortData({ active: 'name', direction: 'asc' });
        // }
      },
    });
  }

  newSource() {
    this.router.navigate(['/admin/sources/new']);
  }

  sortData(sortParameters: Sort) {
    const keyName = sortParameters.active;
    if (sortParameters.direction === 'asc') {
      this.sources = this.sources.sort((a: Source, b: Source) =>
        a[keyName].localeCompare(b[keyName], 'en', { sensitivity: 'case' })
      );
    } else if (sortParameters.direction === 'desc') {
      this.sources = this.sources.sort((a: Source, b: Source) =>
        b[keyName].localeCompare(a[keyName], 'en', { sensitivity: 'case' })
      );
    } else {
      this.getAllSources(false);
      return this.sources;
    }
  }
}
