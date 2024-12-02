import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../shared/services/auth.service';
import { LoginComponent } from '../shared/modals/login.component';
import { take } from 'rxjs';

@Component({
    selector: 'app-menu',
    imports: [MatDialogModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
    template: `
    <mat-toolbar color="primary">
      <button mat-flat-button color="primary" [routerLink]="['/']" id="brand">
        <span style="font-size:20px">Training Courses Tracker</span>
      </button>
      <span style="flex: 1 1 auto;"></span>
      <button mat-flat-button color="primary" [routerLink]="['/']" id="home">Home</button>
      <button mat-flat-button color="primary" [routerLink]="['/courses']" id="courses">Courses</button>
      @if (isLoggedIn()) { @if (isLoggedInAsAdmin()) {
      <button mat-flat-button color="primary" [routerLink]="['/admin']" id="admin">Admin</button>
      }
      <button mat-flat-button color="primary" (click)="logout()" id="logout">Logout</button>
      } @else {
      <button mat-flat-button color="primary" (click)="open()" id="login">Login</button>
      }
    </mat-toolbar>
  `,
    styles: [
        `
      div .nav-item {
        cursor: pointer;
      }
    `,
    ]
})
export class MenuComponent {
  readonly #auth = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly #router = inject(Router);

  protected readonly isLoggedIn = this.#auth.isLoggedIn;
  protected readonly isLoggedInAsAdmin = this.#auth.isLoggedInAsAdmin;
  #email: string;
  #password: string;

  protected open() {
    const dialogRef = this.#dialog.open(LoginComponent, {
      width: '500px',
      data: { email: this.#email, password: this.#password },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.#auth.login(result.email, result.password).pipe(take(1)).subscribe();
        },
      });
  }

  protected logout() {
    this.#auth.logout();
    this.#router.navigate(['/']);
  }
}
