import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-admin',
  imports: [MatButtonModule, MatGridListModule, MatCardModule],
  template: `
    <section>
      <div class="header">
        <h1 class="mat-display-2">Administration</h1>
      </div>

      <mat-grid-list cols="3">
        @for(card of cards; track card) {
        <mat-grid-tile>
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title color="primary">{{ card.title }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ card.content }}</p>
              <button mat-flat-button color="primary" class="center" (click)="redirectTo(card.redirectTo)">
                {{ card.buttonLabel }}
              </button>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        }
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
export default class AdminDashboard {
  readonly #router = inject(Router);

  readonly cards = [
    {
      title: 'Paths',
      content: 'Pre-selections for the Paths field on Course edit form.',
      buttonLabel: 'Edit Paths',
      redirectTo: 'paths',
    },
    {
      title: 'Sources',
      content: 'Pre-selections for the Sources field on Course edit form.',
      buttonLabel: 'Edit Sources',
      redirectTo: 'sources',
    },
    {
      title: 'Users',
      content: 'Current users.',
      buttonLabel: 'Edit Users',
      redirectTo: 'users',
    },
  ];

  redirectTo(path: string) {
    this.#router.navigate([`/admin/${path}`]);
  }
}
