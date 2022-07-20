import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { DeleteComponent } from '../modals/delete.component';
import { ModalDataService } from '../modals/modal-data.service';
import { Path } from '../models/paths';
import { PathService } from '../services/path.service';

@Component({
  selector: 'app-path-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    RouterModule,
  ],

  template: `
    <section class="mt-5">
      <header>
        <mat-form-field appearance="standard">
          <mat-label>Filter </mat-label>
          <input matInput (keyup)="applyFilter($event)" #input />
        </mat-form-field>
        <a mat-mini-fab color="primary" aria-label="Add new path" class="ml-5 fl1" [routerLink]="['/admin/paths/new']">
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
            <a mat-icon-button color="primary" [routerLink]="['/admin/paths', row.id]" title="Edit">
              <mat-icon>edit</mat-icon>
            </a>
            <button mat-icon-button color="warn" (click)="deletePath(row.id)" title="Delete">
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
        aria-label="Select page of paths"
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
export class PathListComponent implements OnInit {
  paths: Path[];
  displayedColumns: string[] = ['name', 'action'];
  dataSource!: MatTableDataSource<Path>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private pathService: PathService,
    private dialog: MatDialog,
    private modalDataService: ModalDataService
  ) {}

  ngOnInit() {
    this.getAllPaths(true);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deletePath(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this path?',
      body: 'All information associated to this path will be permanently deleted.',
      warning: 'This operation can not be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'delete') {
        this.pathService.delete(id);
        this.getAllPaths(false);
      }
    });
  }

  getAllPaths(setInitialSort: boolean): void {
    this.pathService.getAll().subscribe({
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
