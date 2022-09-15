import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Column } from '../models/column';
import { DeleteComponent } from '../modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table.component';
import { ModalDataService } from '../modals/modal-data.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [DisplayTableComponent, NgIf, RouterModule],
  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="users"
        [isAuthenticated]="true"
        [isFilterable]="true"
        [includeAdd]="false"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="users"
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
export class UserListComponent implements OnInit {
  columns: Column[] = [
    { key: 'name', name: 'Name', width: '400px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'email', name: 'Email', width: '400px', type: 'sort', position: 'left' },
    { key: 'role', name: 'Role', width: '150px', type: 'sort', position: 'left' },
    { key: 'action', name: '', width: '50px', type: 'action', position: 'left' },
  ];
  users: User[];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private modalDataService: ModalDataService,
    private router: Router
  ) {}

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
    dialogRef.afterClosed().subscribe((result) => {
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
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      },
    });
  }
}
