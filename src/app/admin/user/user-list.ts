import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { Column } from '@models/column-interface';
import { DeleteModal } from '@modals/delete/delete-modal';
import { DisplayTable } from '@components/display-table';
import { ModalService } from '@services/common/modal-service';
import { UserData } from '@services/user/user-data';

@Component({
  selector: 'app-user-list',
  imports: [DisplayTable],
  template: `
    <section class="mt-5">
      @if (users()) {
      <app-display-table
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
        (edit)="editUser($event)" />
      }
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
export default class UserList implements OnInit {
  readonly #dialog = inject(MatDialog);
  readonly #modalDataService = inject(ModalService);
  readonly #router = inject(Router);
  readonly #userService = inject(UserData);

  protected readonly columns: Column[] = [
    { key: 'name', name: 'Name', width: '400px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'email', name: 'Email', width: '400px', type: 'sort', position: 'left' },
    { key: 'role', name: 'Role', width: '150px', type: 'sort', position: 'left' },
    { key: 'action', name: '', width: '50px', type: 'action', position: 'left' },
  ];
  protected readonly users = toSignal(this.#userService.entities$, { initialValue: [] });

  ngOnInit() {
    this.getAllUsers();
  }

  protected deleteUser(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this user?',
      body: 'All information associated to this path will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.#dialog.open(DeleteModal, { width: '500px' });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.#userService.delete(id);
          this.getAllUsers();
        }
      });
  }

  protected editUser(id: number) {
    this.#router.navigate(['/admin/users', id]);
  }

  private getAllUsers(): void {
    this.#userService.getAll().pipe(take(1));
  }
}
