import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MaterialModule, MatGridListModule, MatCardModule, RouterModule],

  template: `
    <section>
      <h1 class="display-4">Administration</h1>
      <mat-grid-list cols="3">
        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Paths</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Pre-selections for the Paths field on Course edit form.</p>
              <a mat-flat-button color="primary" class="center" [routerLink]="['/admin/paths']">Edit Paths</a>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Sources</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="card-text">Pre-selections for the Sources field on Course edit form.</p>
              <a mat-flat-button color="primary" [routerLink]="['/admin/sources']">Edit Sources</a>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title color="primary">Users</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="card-text">Current users.</p>
              <a mat-flat-button color="primary" [routerLink]="['/admin/users']">Edit Users</a>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </section>
  `,

  styles: [
    `
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
export class AdminComponent {
  constructor(router: Router) {}
}
