import { Component, computed, inject} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { toSignal } from '@angular/core/rxjs-interop';

import * as _ from 'lodash';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { Course, CourseData } from '../shared/models/course';
import { CourseService } from '../shared/services/course.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, NgxChartsModule],

  template: `
    <section>
      <mat-grid-list cols="2">
        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">Completed Courses - Paths</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-pie-chart [view]="[400, 400]" [results]="courses()" [labels]="true" [doughnut]="true" [arcWidth]="0.5"> </ngx-charts-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">Completed Courses - Sources</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-pie-chart [view]="[400, 400]" [results]="sources()" [labels]="true" [doughnut]="true" [arcWidth]="0.5"> </ngx-charts-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </section>
  `,

  styles: [],
})
export class DashboardComponent {
  readonly #courseService = inject(CourseService);

  readonly #courses = toSignal(this.#courseService.getAll(), { initialValue: [] });
  protected readonly courses = computed(() => this.getByPathValue(this.#courses()));
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
