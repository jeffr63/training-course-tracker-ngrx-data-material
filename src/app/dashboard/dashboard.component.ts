import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import * as _ from 'lodash';

import { Course, CourseData } from '@models/course';
import { CourseService } from '@services/course/course.service';
import { DashboardGridComponent } from './dashboard-grid.component';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardGridComponent],
  template: `<app-dashboard-grid [paths]="paths()" [sources]="sources()" />`,
  styles: [],
})
export class DashboardComponent {
  readonly #courseService = inject(CourseService);

  readonly #courses = toSignal(this.#courseService.getAll(), { initialValue: [] });
  protected readonly paths = computed(() => this.getByPathValue(this.#courses()));
  protected readonly sources = computed(() => this.getBySourceValue(this.#courses()));

  private getByPathValue(courses: Course[]): CourseData[] {
    let byPath = _.chain(courses)
      .groupBy('path')
      .map((values, key) => {
        return {
          name: key,
          value: _.reduce(
            values,
            function (value, number) {
              return value + 1;
            },
            0
          ),
        };
      })
      .value();
    byPath = _.orderBy(byPath, 'value', 'desc');
    return byPath;
  }

  private getBySourceValue(course: Course[]): CourseData[] {
    let bySource = _.chain(course)
      .groupBy('source')
      .map((values, key) => {
        return {
          name: key,
          value: _.reduce(
            values,
            function (value, number) {
              return value + 1;
            },
            0
          ),
        };
      })
      .value();
    bySource = _.orderBy(bySource, 'value', 'desc');
    return bySource;
  }
}
