import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

import { Course, CourseData } from '../shared/course';
import { CourseService } from '../courses/course.service';

@Component({
  selector: 'app-dashboard',

  template: `
    <section>
      <mat-grid-list cols="2">
        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Completed Courses - Paths</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-pie-chart
                [view]="[400, 400]"
                [results]="courses$ | async"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.5"
              >
              </ngx-charts-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Completed Courses - Sources</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-pie-chart
                [view]="[400, 400]"
                [results]="sources$ | async"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.5"
              >
              </ngx-charts-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </section>
  `,

  styles: [],
})
export class DashboardComponent implements OnInit {
  courses$: Observable<CourseData[]>;
  sources$: Observable<CourseData[]>;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getAll().subscribe((courses: Course[]) => {
      this.courses$ = this.getByPathValue(courses);
      this.sources$ = this.getBySourceValue(courses);
    });
  }

  getByPathValue(courses: Course[]): Observable<CourseData[]> {
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
    return of(byPath);
  }

  getBySourceValue(course: Course[]): Observable<CourseData[]> {
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
    return of(bySource);
  }
}
