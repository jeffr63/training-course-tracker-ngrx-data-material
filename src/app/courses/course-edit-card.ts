import { Component, input, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Path } from '@models/paths-interface';
import { Source } from '@models/sources-interface';

@Component({
  selector: 'app-course-edit-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Course Edit</mat-card-title>
      <mat-card-content>
        @if (courseEditForm()) {
        <form [formGroup]="courseEditForm()">
          <mat-form-field appearance="outline">
            <mat-label for="title">Title</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="title"
              placeholder="Enter title of course taken" />
            @if (courseEditForm().controls.title.errors?.required && courseEditForm().controls.title?.touched) {
            <mat-error>Title is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="title">Instructor</mat-label>
            <input
              type="text"
              id="instructor"
              matInput
              formControlName="instructor"
              placeholder="Enter title of course taken" />
            @if (courseEditForm().controls.instructor.errors?.required && courseEditForm().controls.instructor?.touched)
            {
            <mat-error>Instructor is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Path</mat-label>
            <mat-select id="path" formControlName="path">
              @for (path of paths(); track path.id) {
              <mat-option [value]="path.name">
                {{ path.name }}
              </mat-option>
              }
            </mat-select>
            @if (courseEditForm().controls.path.errors?.required && courseEditForm().controls.path?.touched) {
            <mat-error>Path is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Source</mat-label>
            <mat-select id="path" formControlName="source">
              @for (source of sources(); track source.id) {
              <mat-option [value]="source.name">
                {{ source.name }}
              </mat-option>
              }
            </mat-select>
            @if (courseEditForm().controls.source.errors?.required && courseEditForm().controls.source?.touched) {
            <mat-error> Path is required </mat-error>
            }
          </mat-form-field>
        </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save.emit()" title="Save" [disabled]="!courseEditForm().valid">
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
export class CourseEditCard {
  courseEditForm = model.required<FormGroup>();
  paths = input.required<Path[]>();
  sources = input.required<Source[]>();
  cancel = output();
  save = output();
}
