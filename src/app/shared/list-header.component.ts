import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-list-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],

  template: `
    <header>
      <mat-form-field appearance="standard">
        <mat-label>Filter </mat-label>
        <input matInput (keyup)="filterKeyup($event)" #input />
      </mat-form-field>
      <a
        mat-mini-fab
        color="primary"
        title="Add new"
        aria-label="Add new"
        class="ml-5 fl1"
        *ngIf="isAuthenticated"
        (click)="addClicked()"
      >
        <mat-icon>add</mat-icon>
      </a>
    </header>
  `,

  styles: [
    `
      .ml-5 {
        margin-left: 5px;
      }

      .fl1 {
        float: right;
        vertical-align: middle;
      }

      .mat-form-field {
        font-size: 14px;
        width: 80%;
      }
    `,
  ],
})
export class ListHeaderComponent {
  @Input() isAuthenticated: boolean;
  @Output() addNew = new EventEmitter();
  @Output() applyFilter = new EventEmitter();

  constructor() {}

  filterKeyup($event) {
    this.applyFilter.emit($event);
  }

  addClicked() {
    this.addNew.emit();
  }
}
