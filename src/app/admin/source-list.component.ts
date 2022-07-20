import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { DeleteComponent } from '../modals/delete.component';
import { ModalDataService } from '../modals/modal-data.service';
import { Source } from '../models/sources';
import { SourceService } from '../services/source.service';

@Component({
  selector: 'app-source-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
  ],

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
          aria-label="Add new path"
          class="ml-5 fl1"
          [routerLink]="['/admin/sources/new']"
        >
          <mat-icon>add</mat-icon>
        </a>
      </header>

      <mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Path</th>
          <td mat-cell *matCellDef="let row" style="width: 600px">{{ row.name }}</td>
        </ng-container>

        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row">
            <a mat-icon-button color="primary" [routerLink]="['/admin/sources', row.id]" title="Edit">
              <mat-icon>edit</mat-icon>
            </a>
            <button mat-icon-button color="warn" (click)="deleteSource(row.id)" title="Delete">
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
        aria-label="Select page of sources"
      ></mat-paginator>
    </section>

    <!-- <section>
      <section class="card">
        <header>
          <h1 class="card-header">Sources</h1>
        </header>
        <section class="card-body">
          <header class="row">
            <div class="col">&nbsp;</div>
            <div class="col">
              <a [routerLink]="['/admin/sources/new']" title="Add Source">
                <mat-icon>note_add</mat-icon>
                <span class="sr-only">Add Source</span>
              </a>
            </div>
          </header>
          <table class="table table-striped">
            <thead>
              <th>Source</th>
              <th>&nbsp;</th>
            </thead>
            <tbody>
              <tr *ngFor="let source of sources$ | async">
                <td>{{ source.name }}</td>
                <td>
                  <a [routerLink]="['/admin/sources', source.id]" class="btn btn-info btn-sm mr-2" title="Edit">
                    <mat-icon>node_edit</mat-icon>
                    <span class="sr-only">Edit</span>
                  </a>
                  <button class="btn btn-danger btn-sm" (click)="deleteSource(source.id)" title="Delete">
                    <mat-icon>delete</mat-icon>
                    <span class="sr-only">Delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
    </section> -->
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

      mat-table {
        width: 100%;
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
export class SourceListComponent implements OnInit {
  sources: Source[];
  displayedColumns: string[] = ['name', 'action'];
  dataSource!: MatTableDataSource<Source>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private sourceService: SourceService,
    private dialog: MatDialog,
    private modalDataService: ModalDataService
  ) {}

  ngOnInit() {
    this.getAllSources(true);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteSource(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this source?',
      body: 'All information associated to this path will be permanently deleted.',
      warning: 'This operation can not be undone.',
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

  getAllSources(setInitialSort: boolean): void {
    this.sourceService.getAll().subscribe({
      next: (data) => this.setDataSource(data, setInitialSort),
    });
  }

  setDataSource(data, setInitialSort: boolean) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    if (setInitialSort) {
      this.sort.sort({ id: 'name', start: 'asc' } as MatSortable);
    }
    this.dataSource.sort = this.sort;
  }
}
