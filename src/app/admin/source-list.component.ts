import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { take } from 'rxjs';

import { Column } from '../shared/models/column';
import { DeleteComponent } from '../shared/modals/delete.component';
import { DisplayTableComponent } from '../shared/display-table/display-table.component';
import { ModalDataService } from '../shared/modals/modal-data.service';
import { SourceService } from '../shared/services/source.service';

@Component({
    selector: 'app-source-list',
    imports: [DisplayTableComponent],
    template: `
    <section class="mt-5">
      @if (sources()) {
      <app-display-table
        [isAuthenticated]="true"
        [isFilterable]="true"
        [includeAdd]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="sources()"
        [tableColumns]="columns"
        (add)="newSource()"
        (delete)="deleteSource($event)"
        (edit)="editSource($event)"></app-display-table>
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
    ]
})
export default class SourceListComponent implements OnInit {
  readonly #sourceService = inject(SourceService);
  readonly #dialog = inject(MatDialog);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);

  protected readonly sources = toSignal(this.#sourceService.entities$, { initialValue: [] });

  protected readonly columns: Column[] = [
    { key: 'name', name: 'Source', width: '600px', type: 'sort', position: 'left', sortDefault: true },
    { key: 'action', name: '', width: '', type: 'action', position: 'left' },
  ];

  ngOnInit() {
    this.getAllSources();
  }

  protected deleteSource(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this source?',
      body: 'All information associated to this path will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    const dialogRef = this.#dialog.open(DeleteComponent, { width: '500px' });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'delete') {
          this.#sourceService.delete(id);
          this.getAllSources();
        }
      });
  }

  protected editSource(id: number) {
    this.#router.navigate(['/admin/sources', id]);
  }

  private getAllSources(): void {
    this.#sourceService.getAll().pipe(take(1));
  }

  protected newSource() {
    this.#router.navigate(['/admin/sources/new']);
  }
}
