import { Component, input, output } from '@angular/core';
import { FormField, FieldTree, ValidationError } from '@angular/forms/signals';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Course } from '@models/course-interface';
import { Path } from '@models/paths-interface';
import { Source } from '@models/sources-interface';
import * as validate from '@services/common/validation-error';

@Component({
  selector: 'app-course-edit-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormField,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Course Edit</mat-card-title>
      <mat-card-content>
        @if (form()) {
          <form>
            <mat-form-field appearance="outline">
              <mat-label for="title">Title</mat-label>
              <input
                ngbAutofocus
                type="text"
                id="title"
                matInput
                [formField]="form().title"
                placeholder="Enter title of course taken" />
              @let ftitle = form().title();
              @if (ftitle.invalid() && ftitle.touched()) {
                <mat-error>
                  @for (error of ftitle.errors(); track error.kind) {
                    {{ getError(error) }}
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label for="title">Instructor</mat-label>
              <input
                type="text"
                id="instructor"
                matInput
                [formField]="form().instructor"
                placeholder="Enter title of course taken" />
              @let finstructor = form().instructor();
              @if (finstructor.invalid() && finstructor.touched()) {
                <mat-error>
                  @for (error of finstructor.errors(); track error.kind) {
                    {{ getError(error) }}
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Path</mat-label>
              <mat-select id="path" [formField]="form().path">
                @for (path of paths(); track path.id) {
                  <mat-option [value]="path.name">
                    {{ path.name }}
                  </mat-option>
                }
              </mat-select>
              @let fpath = form().path();
              @if (fpath.invalid() && fpath.touched()) {
                <mat-error>
                  @for (error of fpath.errors(); track error.kind) {
                    {{ getError(error) }}
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Source</mat-label>
              <mat-select id="path" [formField]="form().source">
                @for (source of sources(); track source.id) {
                  <mat-option [value]="source.name">
                    {{ source.name }}
                  </mat-option>
                }
              </mat-select>
              @let fsource = form().source();
              @if (fsource.invalid() && fsource.touched()) {
                <mat-error>
                  @for (error of fsource.errors(); track error.kind) {
                    {{ getError(error) }}
                  }
                </mat-error>
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
  form = input.required<FieldTree<Course>>();
  paths = input.required<Path[]>();
  sources = input.required<Source[]>();
  cancel = output();
  save = output();

  getError(error: ValidationError) {
    return validate.getError(error);
  }
}
