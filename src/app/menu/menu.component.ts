import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../auth/auth.service';
import { LoginComponent } from '../modals/login.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatDialogModule, MatToolbarModule, MatIconModule, MatButtonModule, NgIf, RouterLink],

  template: `
    <mat-toolbar color="primary">
      <button mat-flat-button color="primary" [routerLink]="['/']" id="brand">
        <span style="font-size:20px">Training Courses Tracker</span>
      </button>
      <span style="flex: 1 1 auto;"></span>
      <button mat-flat-button color="primary" [routerLink]="['/']" id="home">Home</button>
      <button mat-flat-button color="primary" [routerLink]="['/courses']" id="courses">Courses</button>
      <button mat-flat-button color="primary" *ngIf="auth.isAuthenticated === false" (click)="open()" id="login">
        Login
      </button>
      <button
        mat-flat-button
        color="primary"
        [routerLink]="['/admin']"
        *ngIf="auth.isAuthenticated && auth.isAdmin"
        id="admin"
      >
        Admin
      </button>
      <button mat-flat-button color="primary" *ngIf="auth.isAuthenticated" (click)="logout()" id="logout">
        Logout
      </button>
    </mat-toolbar>
  `,

  styles: [
    `
      div .nav-item {
        cursor: pointer;
      }
    `,
  ],
})
export class MenuComponent {
  auth = inject(AuthService);
  dialog = inject(MatDialog);
  router = inject(Router);

  public isNavbarCollapsed = true;
  email: string;
  password: string;

  open() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      data: { email: this.email, password: this.password },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.auth.login(result.email, result.password).pipe(take(1)).subscribe();
        },
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
