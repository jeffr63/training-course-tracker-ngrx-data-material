import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { Course, COURSE_EDIT_SCHEMA } from '@models/course-interface';
import { CourseData } from '@services/course/course-data';
import { PathData } from '@services/path/path-data';
import { SourceData } from '@services/source/source-data';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CourseEditCard } from './course-edit-card';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-course-edit',
  imports: [CourseEditCard],
  template: `<app-course-edit-card
    [form]="form"
    [paths]="paths()"
    [sources]="sources()"
    (cancel)="cancel()"
    (save)="save()" />`,
})
export default class CourseEdit {
  readonly #courseService = inject(CourseData);
  readonly #pathService = inject(PathData);
  readonly #sourceService = inject(SourceData);
  readonly #router = inject(Router);

  protected readonly id = input.required<string>();
  readonly #isNew = computed(() => (this.id() === 'new' ? true : false));

  readonly #course = rxResource<Course, string>({
    params: () => this.id(),
    stream: ({ params: id }) => {
      if (id === 'new') return of({ title: '', instructor: '', source: '', path: '' });
      const course = this.#courseService.getByKey(+id);
      return course;
    },
  });
  protected paths = toSignal(this.#pathService.entities$, { initialValue: [] });
  protected sources = toSignal(this.#sourceService.entities$, { initialValue: [] });

  readonly form = form<Course>(this.#course.value, COURSE_EDIT_SCHEMA);

  protected save() {
    if (this.#isNew()) {
      this.#courseService.add(this.#course.value());
    } else {
      this.#courseService.update(this.#course.value());
    }
    this.#router.navigate(['/courses']);
  }

  protected cancel() {
    this.#router.navigate(['/courses']);
  }
}
