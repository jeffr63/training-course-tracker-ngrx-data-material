import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatButtonModule, MatGridListModule, MatCardModule, RouterLink],

  template: `
    <section>
      <div class="header">
        <h1 class="mat-display-2">Administration</h1>
      </div>

      <mat-grid-list cols="3">
        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">Paths</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Pre-selections for the Paths field on Course edit form.</p>
              <button mat-flat-button color="primary" class="center" [routerLink]="['/admin/paths']">Edit Paths</button>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">Sources</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="card-text">Pre-selections for the Sources field on Course edit form.</p>
              <button mat-flat-button color="primary" [routerLink]="['/admin/sources']">Edit Sources</button>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">Users</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="card-text">Current users.</p>
              <button mat-flat-button color="primary" [routerLink]="['/admin/users']">Edit Users</button>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </section>
  `,

  styles: [
    `
      /* TODO(mdc-migration): The following rule targets internal classes of card that may no longer apply for the MDC version. */
      mat-card {
        width: 80%;
        margin: 0 auto;
      }
      .center {
        text-align: center;
      }

      section {
        margin: 10px;
      }
    `,
  ],
})
export default class AdminComponent {
  constructor(router: Router) {}
}
