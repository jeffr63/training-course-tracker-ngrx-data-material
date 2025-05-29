import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CourseChartData } from '@models/course-interface';

@Component({
  selector: 'app-chart-card',
  imports: [MatCardModule, MatGridListModule, NgxChartsModule],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title color="primary">{{ title() }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <ngx-charts-pie-chart
          [view]="[400, 400]"
          [results]="results()"
          [labels]="true"
          [doughnut]="true"
          [arcWidth]="0.5">
        </ngx-charts-pie-chart>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})
export class ChartCard {
  results = input.required<CourseChartData[]>();
  title = input.required();
}
