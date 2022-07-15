import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { DeleteComponent } from '../modals/delete.component';
import { ModalDataService } from '../modals/modal-data.service';
import { User } from '../shared/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatCardModule, MatTableModule, MatFormFieldModule, RouterModule],

  template: `
    <section class="mt-5">
      <header>
        <mat-form-field appearance="standard">
          <mat-label>Filter </mat-label>
          <input matInput (keyup)="applyFilter($event)" #input />
        </mat-form-field>
      </header>

      <mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
          <td mat-cell *matCellDef="let row" style="width: 400px">{{ row.name }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
          <td mat-cell *matCellDef="let row" style="width: 400px">{{ row.email }}</td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
          <td mat-cell *matCellDef="let row" style="width: 150px">{{ row.role }}</td>
        </ng-container>

        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row">
            <a mat-icon-button color="primary" [routerLink]="['/admin/users', row.id]" title="Edit">
              <mat-icon>edit</mat-icon>
            </a>
            <button mat-icon-button color="warn" (click)="deleteUser(row.id)" title="Delete">
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
export class UserListComponent implements OnInit {
  users: User[];
  displayedColumns: string[] = ['name', 'email', 'role', 'action'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private modalDataService: ModalDataService
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
      warning: 'This operation can not be undone.',
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
    this.dataSource.sort = this.sort;
  }
}
