import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Column } from '../models/column';
import { DeleteComponent } from '../modals/delete.component';
import { ListHeaderComponent } from '../shared/list-header.component';
import { ModalDataService } from '../modals/modal-data.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ListHeaderComponent, MaterialModule, RouterModule],

  template: `
    <section class="mt-5">
      <app-list-header (applyFilter)="applyFilter($event)"></app-list-header>

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
              <a mat-icon-button color="primary" (click)="editUser(element.id)" title="Edit">
                <mat-icon>edit</mat-icon>
              </a>
              <button mat-icon-button color="warn" (click)="deleteUser(element.id)" title="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="dataColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: dataColumns; let even = even" [ngClass]="{ gray: even }"></tr>

        <!-- Row shown when there is no matching data. -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="4">No data matching the filter</td>
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
export class UserListComponent implements OnInit {
  columns: Column[] = [
    { key: 'name', title: 'Name', width: '400px', type: 'sort' },
    { key: 'email', title: 'Email', width: '400px', type: 'sort' },
    { key: 'role', title: 'Role', width: '150px', type: 'sort' },
    { key: 'action', title: '', width: '', type: 'actions' },
  ];
  dataColumns = this.columns.map((col) => col.key);
  users: User[];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private modalDataService: ModalDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllUsers(true);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this user?',
      body: 'All information associated to this path will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.dialog.open(DeleteComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'delete') {
        this.userService.delete(id);
        this.getAllUsers(false);
      }
    });
  }

  editUser(id: number) {
    this.router.navigate(['/admin/users', id]);
  }

  getAllUsers(setInitialSort: boolean): void {
    this.userService.getAll().subscribe({
      next: (data) => this.setDataSource(data, setInitialSort),
    });
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
