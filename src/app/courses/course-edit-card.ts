import { Component, input, output } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValidationErrors } from '@components/validation-errors';

import { Course } from '@models/course-interface';
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
    Field,
    ValidationErrors,
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
                [field]="form().title"
                placeholder="Enter title of course taken" />
              @let ftitle = form().title();
              @if (ftitle.invalid() && ftitle.touched()) {
                <app-validation-errors matError [errors]="ftitle.errors()" />
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label for="title">Instructor</mat-label>
              <input
                type="text"
                id="instructor"
                matInput
                [field]="form().instructor"
                placeholder="Enter title of course taken" />
              @let finstructor = form().instructor();
              @if (finstructor.invalid() && finstructor.touched()) {
                <app-validation-errors matError [errors]="finstructor.errors()" />
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Path</mat-label>
              <mat-select id="path" [field]="form().path">
                @for (path of paths(); track path.id) {
                  <mat-option [value]="path.name">
                    {{ path.name }}
                  </mat-option>
                }
              </mat-select>
              @let fpath = form().path();
              @if (fpath.invalid() && fpath.touched()) {
                <app-validation-errors matError [errors]="fpath.errors()" />
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Source</mat-label>
              <mat-select id="path" [field]="form().source">
                @for (source of sources(); track source.id) {
                  <mat-option [value]="source.name">
                    {{ source.name }}
                  </mat-option>
                }
              </mat-select>
              @let fsource = form().source();
              @if (fsource.invalid() && fsource.touched()) {
                <app-validation-errors matError [errors]="fsource.errors()" />
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
}
