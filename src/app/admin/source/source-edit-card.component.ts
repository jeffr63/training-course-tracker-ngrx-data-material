import { Component, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-source-edit-card',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Source Edit</mat-card-title>
      <mat-card-content>
        @if (sourceEditForm()) {
        <form [formGroup]="sourceEditForm()">
          <mat-form-field appearance="outline">
            <mat-label for="name">Source Name</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="name"
              placeholder="Enter name of source" />
            @if (sourceEditForm().controls.name.errors?.required && sourceEditForm().controls.name?.touched) {
            <mat-error>Source name is required </mat-error>
            }
          </mat-form-field>
        </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save.emit()" title="Save" [disabled]="!sourceEditForm().valid">
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
export class SourceEditCardComponent {
  sourceEditForm = model.required<FormGroup>();
  cancel = output();
  save = output();
}
