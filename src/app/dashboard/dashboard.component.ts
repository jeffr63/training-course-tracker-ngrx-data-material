import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { Observable, of, Subject, takeUntil } from 'rxjs';
import * as _ from 'lodash';

import { Course, CourseData } from '../models/course';
import { CourseService } from '../courses/course.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
          <mat-card appearance="outlined">
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
export class DashboardComponent implements OnInit, OnDestroy {
  courses$: Observable<CourseData[]>;
  sources$: Observable<CourseData[]>;
  componentIsDestroyed = new Subject<boolean>();

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService
      .getAll()
      .pipe(takeUntil(this.componentIsDestroyed))
      .subscribe((courses: Course[]) => {
        this.courses$ = this.getByPathValue(courses);
        this.sources$ = this.getBySourceValue(courses);
      });
  }

  ngOnDestroy(): void {
    this.componentIsDestroyed.next(true);
    this.componentIsDestroyed.complete();
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
