import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import * as _ from 'lodash';

import { Course, CourseChartData } from '@models/course-interface';
import { CourseData } from '@services/course/course-data';
import { DashboardGrid } from './dashboard-grid';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardGrid],
  template: `<app-dashboard-grid [paths]="paths()" [sources]="sources()" />`,
  styles: [],
})
export class Dashboard {
  readonly #courseService = inject(CourseData);

  readonly courses = toSignal(this.#courseService.getAll(), { initialValue: [] });
  readonly paths = computed(() => this.getByPathValue(this.courses()));
  readonly sources = computed(() => this.getBySourceValue(this.courses()));

  private getByPathValue(courses: Course[]): CourseChartData[] {
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

  private getBySourceValue(course: Course[]): CourseChartData[] {
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
