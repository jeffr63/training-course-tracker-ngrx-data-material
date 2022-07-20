import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MaterialModule } from '../material.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Observable, Subscription } from 'rxjs';

import { Course } from '../models/course';
import { CourseService } from './course.service';
import { Path } from '../models/paths';
import { PathService } from '../services/path.service';
import { Source } from '../models/sources';
import { SourceService } from '../services/source.service';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatCardModule, MatFormFieldModule, ReactiveFormsModule, RouterModule],

  template: `
    <mat-card>
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
        <button mat-flat-button color="warn" (click)="save()" title="Save" [disabled]="!courseEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <a mat-flat-button color="accent" class="ml-10" [routerLink]="['/courses']"
          ><mat-icon>cancel</mat-icon> Cancel</a
        >
      </mat-card-actions>
    </mat-card>
  `,

  styles: [
    `
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
export class CourseEditComponent implements OnInit, OnDestroy {
  loading = false;
  componentActive = true;
  paths$: Observable<Path[]>;
  sources$: Observable<Source[]>;
  courseEditForm!: FormGroup;
  private course = <Course>{};
  private isNew = true;
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private courseService: CourseService,
    private pathService: PathService,
    private sourceService: SourceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.courseEditForm = this.fb.group({
      title: ['', Validators.required],
      instructor: ['', Validators.required],
      path: ['', Validators.required],
      source: ['', Validators.required],
    });

    this.sub.add(
      this.route.params.subscribe((params) => {
        if (params.id !== 'new') {
          this.isNew = false;
          this.sub.add(
            this.courseService.getByKey(params.id).subscribe((course: Course) => {
              this.course = { ...course };
              this.courseEditForm.patchValue({
                title: course.title,
                instructor: course.instructor,
                path: course.path,
                source: course.source,
              });
            })
          );
        }
      })
    );

    this.pathService.getAll();
    this.paths$ = this.pathService.entities$;
    this.sourceService.getAll();
    this.sources$ = this.sourceService.entities$;
  }

  ngOnDestroy() {
    this.componentActive = false;
    this.sub.unsubscribe();
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
