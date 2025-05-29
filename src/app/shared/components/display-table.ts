import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, computed, effect, input, OnInit, output, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortable, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Column } from '../models/column-interface';

@Component({
  selector: 'app-display-table',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgClass,
    CurrencyPipe,
  ],
  template: `
    <!-- Filter -->
    @if (isFilterable()) {
    <mat-form-field appearance="outline">
      <mat-label>Filter </mat-label>
      <input matInput (keyup)="applyFilter($event)" placeholder="filter" />
    </mat-form-field>
    }

    <!-- Add Button -->
    @if (includeAdd() && isAuthenticated()) {
    <a mat-mini-fab color="primary" title="Add new" aria-label="Add new" class="ml-5 fl1" (click)="add.emit()">
      <mat-icon>add</mat-icon>
    </a>
    }

    <!-- Table -->
    <table mat-table [dataSource]="tableDataSource" matSort class="mat-elevation-z8">
      @for (column of tableColumns(); track $index) {
      <ng-container [matColumnDef]="column.key">
        @switch (column.type) { @case ('sort') {
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          [class.text-right]="column.position === 'right'"
          [arrowPosition]="column.position === 'right' ? 'before' : 'after'"
          style="min-width: {{ column.width }}">
          {{ column.name }}
        </th>
        <td mat-cell *matCellDef="let element">
          {{ element[column.key] }}
        </td>
        } @case ('currency_sort') {
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          [class.text-right]="column.position === 'right'"
          [arrowPosition]="column.position === 'right' ? 'before' : 'after'"
          style="min-width: {{ column.width }}">
          {{ column.name }}
        </th>
        <td mat-cell *matCellDef="let element">
          {{ element[column.key] | currency }}
        </td>
        } @case ('link') {
        <th
          mat-header-cell
          *matHeaderCellDef
          [class.text-right]="column.position === 'right'"
          style="min-width: {{ column.width }}">
          {{ column.name }}
        </th>
        <td mat-cell *matCellDef="let element">
          @if (element[column.key]) {
          <a href="{{ element[column.key] }}"><mat-icon>link</mat-icon></a>
          }
        </td>
        } @case ('action') {
        <th
          mat-header-cell
          *matHeaderCellDef
          [class.text-right]="column.position === 'right'"
          style="min-width: {{ column.width }}"></th>
        <td mat-cell *matCellDef="let element">
          @if (isAuthenticated()) {
          <button mat-icon-button color="primary" (click)="edit.emit(element.id)" title="Edit">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="delete.emit(element.id)" title="Delete">
            <mat-icon>delete</mat-icon>
          </button>
          }
        </td>
        } @case ('view') {
        <th
          mat-header-cell
          *matHeaderCellDef
          [class.text-right]="column.position === 'right'"
          style="min-width: {{ column.width }}"></th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="primary" (click)="open.emit(element.id)" title="View">
            <mat-icon>view_list</mat-icon>
          </button>
        </td>
        } @default {
        <th
          mat-header-cell
          *matHeaderCellDef
          [class.text-right]="column.position === 'right'"
          style="min-width: {{ column.width }}">
          {{ column.name }}
        </th>
        <td mat-cell *matCellDef="let element">
          {{ element[column.key] }}
        </td>
        } }
      </ng-container>
      }

      <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns(); let even = even" [ngClass]="{ gray: even }"></tr>

      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="5">No data matching the filter</td>
      </tr>
    </table>

    <!-- Pagination -->
    @if (isPageable()) {
    <mat-paginator [pageSizeOptions]="paginationSizes()" [pageSize]="defaultPageSize()" showFirstLastButtons>
    </mat-paginator>
    }
  `,
  styles: [
    `
      table {
        width: 100%;
      }
      th,
      td {
        padding: 10px !important;
      }
      mat-form-field {
        width: 40%;
      }
      .text-right {
        text-align: right !important;
      }
      .ml-5 {
        margin-left: 5px;
      }
      .fl1 {
        float: right;
        vertical-align: middle;
      }
      .mat-mdc-form-field {
        font-size: 14px;
        width: 80%;
      }
    `,
  ],
})
export class DisplayTable<TData> implements OnInit {
  // input parms
  readonly defaultPageSize = input<number>(10);
  disableClear = input<boolean>(false);
  includeAdd = input<boolean>(false);
  isAuthenticated = input<boolean>(false);
  isFilterable = input<boolean>(false);
  isPageable = input<boolean>(false);
  paginationSizes = input<number[]>([5, 10, 15]);
  tableColumns = input<Column[]>([]);
  tableData = input.required<TData[]>();
  protected tableDataSource = new MatTableDataSource([]);

  // output parms
  protected readonly add = output();
  protected readonly delete = output<number>();
  protected readonly edit = output<number>();
  protected readonly open = output<number>();

  // signals and computed values
  matPaginator = viewChild(MatPaginator);
  matSort = viewChild.required(MatSort);
  protected displayedColumns = computed<String[]>(() => this.tableColumns().map((column: Column) => column.key));

  constructor() {
    effect(() => this.setTableDataSource(this.tableData()));
    effect(() => (this.tableDataSource.paginator = this.matPaginator()!));
  }

  ngOnInit(): void {
    let defaultSort = '';
    this.tableColumns().map((column: Column) => {
      if (column.sortDefault) {
        defaultSort = column.key;
      }
    });
    if (defaultSort !== '') {
      this.matSort().sort({ id: defaultSort, start: 'asc' } as MatSortable);
    }
  }

  protected applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  private setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.paginator = this.matPaginator();
    this.matSort().disableClear = this.disableClear();
    this.tableDataSource.sort = this.matSort();
  }
}
