import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { take } from 'rxjs';

import { Column } from '@models/column-interface';
import { DeleteModal } from '@modals/delete/delete-modal';
import { DisplayTable } from '@components/display-table';
import { ModalService } from '@services/common/modal-service';
import { PathData } from '@services/path/path-data';

@Component({
  selector: 'app-path-list',
  imports: [DisplayTable],
  template: `
    <section class="mt-5">
      @if (paths()) {
      <app-display-table
        [isAuthenticated]="true"
        [isFilterable]="true"
        [includeAdd]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="paths()"
        [tableColumns]="columns"
        (add)="newPath()"
        (delete)="deletePath($event)"
        (edit)="editPath($event)"></app-display-table>
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
export default class PathList {
  readonly #pathService = inject(PathData);
  readonly #dialog = inject(MatDialog);
  readonly #modalDataService = inject(ModalService);
  readonly #router = inject(Router);

  protected readonly columns: Column[] = [
    { key: 'name', name: 'Path', width: '600px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'action', name: '', width: '', type: 'action', position: 'left' },
  ];

  protected readonly paths = toSignal(this.#pathService.entities$, { initialValue: [] });

  constructor() {
    this.#pathService.getAll().pipe(take(1));
  }

  protected deletePath(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this path?',
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
          this.#pathService.delete(id);
          this.#pathService.getAll().pipe(take(1));
        }
      });
  }

  protected editPath(id: number) {
    this.#router.navigate(['/admin/paths', id]);
  }

  protected newPath() {
    this.#router.navigate(['/admin/paths/new']);
  }
}
