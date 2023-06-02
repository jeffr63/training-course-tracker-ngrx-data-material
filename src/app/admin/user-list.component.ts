import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Column } from '../shared/models/column';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { ModalDataService } from '../shared/modals/modal-data.service';
import { User } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf],
  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="users()"
        [isAuthenticated]="true"
        [isFilterable]="true"
        [includeAdd]="false"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="users()"
        [tableColumns]="columns"
        (delete)="deleteUser($event)"
        (edit)="editUser($event)"
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
export default class UserListComponent implements OnInit {
  private dialog = inject(MatDialog);
  private modalDataService = inject(ModalDataService);
  private router = inject(Router);
  private userService = inject(UserService);

  columns: Column[] = [
    { key: 'name', name: 'Name', width: '400px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'email', name: 'Email', width: '400px', type: 'sort', position: 'left' },
    { key: 'role', name: 'Role', width: '150px', type: 'sort', position: 'left' },
    { key: 'action', name: '', width: '50px', type: 'action', position: 'left' },
  ];
  users = toSignal(this.userService.entities$, { initialValue: [] });

  ngOnInit() {
    this.getAllUsers();
  }

  deleteUser(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this user?',
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
          this.userService.delete(id);
          this.getAllUsers();
        }
      });
  }

  editUser(id: number) {
    this.router.navigate(['/admin/users', id]);
  }

  getAllUsers(): void {
    this.userService.getAll().pipe(take(1));
  }
}
