import { Component, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

import { CourseChartData } from '@models/course-interface';
import { ChartCard } from '../shared/components/chart-card';

@Component({
  selector: 'app-dashboard-grid',
  imports: [MatGridListModule, ChartCard],
  template: `
    <section>
      <mat-grid-list cols="2">
        <mat-grid-tile>
          <app-chart-card [results]="paths()" title="Completed Courses - Paths" />
        </mat-grid-tile>
        <mat-grid-tile>
          <app-chart-card [results]="sources()" title="Completed Courses - Sources" />
        </mat-grid-tile>
      </mat-grid-list>
    </section>
  `,
  styles: ``,
})
export class DashboardGrid {
  paths = input.required<CourseChartData[]>();
  sources = input.required<CourseChartData[]>();
}
