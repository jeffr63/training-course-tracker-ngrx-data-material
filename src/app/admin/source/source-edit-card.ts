import { Component, input, output } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Source } from '@models/sources-interface';
import { ValidationErrors } from '@components/validation-errors';

@Component({
  selector: 'app-source-edit-card',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, Field, ValidationErrors],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Source Edit</mat-card-title>
      <mat-card-content>
        @if (form()) {
          <form>
            <mat-form-field appearance="outline">
              <mat-label for="name">Source Name</mat-label>
              <input
                ngbAutofocus
                type="text"
                id="title"
                matInput
                [field]="form().name"
                placeholder="Enter name of source" />
              @let fname = form().name();
              @if (fname.invalid() && fname.touched()) {
                <app-validation-errors matError [errors]="fname.errors()" />
              }
            </mat-form-field>
          </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save.emit()" title="Save" [disabled]="form()().invalid()">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="accent" class="ml-10" (click)="cancel.emit()">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    /* TODO(mdc-migration): The following rule targets internal classes of card that may no longer apply for the MDC version. */
    mat-card {
      margin: 30px;
      padding-left: 15px;
      padding-right: 15px;
      width: 30%;
    }

    mat-content {
      width: 100%;
    }

    mat-form-field {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .ml-10 {
      margin-left: 10px;
    }
  `,
})
export class SourceEditCard {
  form = input.required<FieldTree<Source>>();
  cancel = output();
  save = output();
}
