import { AsyncPipe, Location } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

import { Observable, take } from 'rxjs';

import { Course } from '@models/course';
import { CourseService } from '@services/course/course.service';
import { Path } from '@models/paths';
import { PathService } from '@services/path/path.service';
import { Source } from '@models/sources';
import { SourceService } from '@services/source/source.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CourseEditCardComponent } from './course-edit-card.component';

@Component({
  selector: 'app-course-edit',
  imports: [CourseEditCardComponent],
  template: `<app-course-edit-card
    [(courseEditForm)]="courseEditForm"
    [paths]="paths()"
    [sources]="sources()"
    (cancel)="cancel()"
    (save)="save()" />`,
})
export default class CourseEditComponent implements OnInit {
  readonly #courseService = inject(CourseService);
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #pathService = inject(PathService);
  readonly #sourceService = inject(SourceService);
  readonly #router = inject(Router);

  protected readonly id = input.required();
  #course = <Course>{};
  protected courseEditForm!: FormGroup;
  #isNew = true;
  protected paths = toSignal(this.#pathService.entities$, { initialValue: [] });
  protected sources = toSignal(this.#sourceService.entities$, { initialValue: [] });

  ngOnInit() {
    this.courseEditForm = this.#fb.group({
      title: ['', Validators.required],
      instructor: ['', Validators.required],
      path: ['', Validators.required],
      source: ['', Validators.required],
    });

    if (this.id() !== 'new') {
      this.#isNew = false;
      this.loadFormValues(+this.id());
    }

    this.#pathService.getAll();
    this.#sourceService.getAll();
  }

  private loadFormValues(id) {
    this.#courseService
      .getByKey(id)
      .pipe(take(1))
      .subscribe((course: Course) => {
        this.#course = { ...course };
        this.courseEditForm.patchValue({
          title: course.title,
          instructor: course.instructor,
          path: course.path,
          source: course.source,
        });
      });
  }

  protected save() {
    const { title, instructor, path, source } = this.courseEditForm.getRawValue();
    this.#course.title = title;
    this.#course.instructor = instructor;
    this.#course.path = path;
    this.#course.source = source;

    if (this.#isNew) {
      this.#courseService.add(this.#course);
    } else {
      this.#courseService.update(this.#course);
    }
    this.#location.back();
  }

  protected cancel() {
    this.#router.navigate(['/courses']);
  }
}
