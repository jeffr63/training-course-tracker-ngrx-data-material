import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DeleteComponent } from '../modals/delete.component';
import { ModalDataService } from '../modals/modal-data.service';
import { Path } from '../models/paths';
import { PathService } from '../services/path.service';
import { ListHeaderComponent } from '../shared/list-header.component';
import { Column } from '../models/column';

@Component({
  selector: 'app-path-list',
  standalone: true,
  imports: [CommonModule, ListHeaderComponent, MaterialModule, RouterModule],

  template: `
    <section class="mt-5">
      <app-list-header
        [isAuthenticated]="isAuthenticated"
        (addNew)="newPath()"
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
              <button mat-icon-button color="primary" (click)="editPath(element.id)" title="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deletePath(element.id)" title="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="dataColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: dataColumns; let even = even" [ngClass]="{ gray: even }"></tr>

        <!-- Row shown when there is no matching data. -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="2">No data matching the filter</td>
        </tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 100]"
        [pageSize]="10"
        aria-label="Select page of paths"
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
export class PathListComponent implements OnInit {
  columns: Column[] = [
    { key: 'name', title: 'Path', width: '600px', type: 'sort' },
    { key: 'action', title: '', width: '', type: 'actions' },
  ];
  dataColumns = this.columns.map((col) => col.key);
  dataSource!: MatTableDataSource<Path>;
  isAuthenticated = true;
  paths: Path[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private pathService: PathService,
    private dialog: MatDialog,
    private modalDataService: ModalDataService,
    private router: Router
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
      warning: 'This operation cannot be undone.',
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

  editPath(id: number) {
    this.router.navigate(['/admin/paths', id]);
  }

  getAllPaths(setInitialSort: boolean): void {
    this.pathService.getAll().subscribe({
      next: (data) => this.setDataSource(data, setInitialSort),
    });
  }

  newPath() {
    this.router.navigate(['/admin/paths/new']);
  }

  setDataSource(data, setInitialSort: boolean) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    if (setInitialSort) {
      this.sort.sort({ id: 'name', start: 'asc' } as MatSortable);
    }
    this.sort.disableClear = true;
    this.dataSource.sort = this.sort;
  }
}
