import { AsyncPipe, Location, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

import { Observable, take } from 'rxjs';

import { Course } from '../shared/models/course';
import { CourseService } from '../shared/services/course.service';
import { Path } from '../shared/models/paths';
import { PathService } from '../shared/services/path.service';
import { Source } from '../shared/models/sources';
import { SourceService } from '../shared/services/source.service';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
  ],

  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Course Edit</mat-card-title>
      <mat-card-content>
        <form *ngIf="courseEditForm" [formGroup]="courseEditForm">
          <mat-form-field appearance="outline">
            <mat-label for="title">Title</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="title"
              placeholder="Enter title of course taken"
            />
            <mat-error *ngIf="courseEditForm.controls.title.errors?.required && courseEditForm.controls.title?.touched">
              Title is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="title">Instructor</mat-label>
            <input
              type="text"
              id="instructor"
              matInput
              formControlName="instructor"
              placeholder="Enter title of course taken"
            />
            <mat-error
              *ngIf="courseEditForm.controls.instructor.errors?.required && courseEditForm.controls.instructor?.touched"
            >
              Instructor is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Path</mat-label>
            <mat-select id="path" formControlName="path">
              <mat-option *ngFor="let path of paths$ | async" [value]="path.name">
                {{ path.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="courseEditForm.controls.path.errors?.required && courseEditForm.controls.path?.touched">
              Path is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Source</mat-label>
            <mat-select id="path" formControlName="source">
              <mat-option *ngFor="let source of sources$ | async" [value]="source.name">
                {{ source.name }}
              </mat-option>
            </mat-select>
            <mat-error
              *ngIf="courseEditForm.controls.source.errors?.required && courseEditForm.controls.source?.touched"
            >
              Path is required
            </mat-error>
          </mat-form-field>
        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save()" title="Save" [disabled]="!courseEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="accent" class="ml-10" [routerLink]="['/courses']">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-card-actions>
    </mat-card>
  `,

  styles: [
    `
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
  ],
})
export default class CourseEditComponent implements OnInit {
  private courseService = inject(CourseService);
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private pathService = inject(PathService);
  private sourceService = inject(SourceService);

  @Input() id;
  course = <Course>{};
  courseEditForm!: FormGroup;
  isNew = true;
  paths$: Observable<Path[]>;
  sources$: Observable<Source[]>;

  ngOnInit() {
    this.courseEditForm = this.fb.group({
      title: ['', Validators.required],
      instructor: ['', Validators.required],
      path: ['', Validators.required],
      source: ['', Validators.required],
    });

    if (this.id !== 'new') {
      this.isNew = false;
      this.loadFormValues(+this.id);
    }

    this.pathService.getAll();
    this.paths$ = this.pathService.entities$;
    this.sourceService.getAll();
    this.sources$ = this.sourceService.entities$;
  }

  loadFormValues(id) {
    this.courseService
      .getByKey(id)
      .pipe(take(1))
      .subscribe((course: Course) => {
        this.course = { ...course };
        this.courseEditForm.patchValue({
          title: course.title,
          instructor: course.instructor,
          path: course.path,
          source: course.source,
        });
      });
  }

  save() {
    const { title, instructor, path, source } = this.courseEditForm.getRawValue();
    this.course.title = title;
    this.course.instructor = instructor;
    this.course.path = path;
    this.course.source = source;

    if (this.isNew) {
      this.courseService.add(this.course);
    } else {
      this.courseService.update(this.course);
    }
    this.location.back();
  }
}
