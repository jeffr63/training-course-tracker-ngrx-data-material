import { Component, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

import { CourseData } from '@models/course';
import { ChartCardComponent } from '../shared/components/chart-card.component';

@Component({
  selector: 'app-dashboard-grid',
  imports: [MatGridListModule, ChartCardComponent],
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
export class DashboardGridComponent {
  paths = input.required<CourseData[]>();
  sources = input.required<CourseData[]>();
}
