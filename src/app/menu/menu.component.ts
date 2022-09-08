import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../auth/auth.service';
import { LoginComponent } from '../modals/login.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatDialogModule, MatToolbarModule, MatButtonModule, NgIf, RouterModule],

  template: `
    <mat-toolbar color="primary">
      <button mat-button class="primary" [routerLink]="['/']" id="brand">
        <h3 class="text-white">Training Courses Tracker</h3>
      </button>
      <span style="flex: 1 1 auto;"></span>
      <button mat-button class="primary" [routerLink]="['/']" id="home">Home</button>
      <button mat-button class="primary" [routerLink]="['/courses']" id="courses">Courses</button>
      <button mat-button class="primary" *ngIf="auth.isAuthenticated === false" (click)="open()" id="login">
        Login
      </button>
      <button
        mat-button
        class="primary"
        [routerLink]="['/admin']"
        *ngIf="auth.isAuthenticated && auth.isAdmin"
        id="admin"
      >
        Admin
      </button>
      <button mat-button class="primary" *ngIf="auth.isAuthenticated" (click)="logout()" id="logout">Logout</button>
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
  public isNavbarCollapsed = true;
  email: string;
  password: string;
  sub: Subscription;

  constructor(public auth: AuthService, private dialog: MatDialog, private router: Router) {}

  open() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      data: { email: this.email, password: this.password },
    });

    this.sub.add(
      dialogRef.afterClosed().subscribe({
        next: (result) => {
          this.sub.add(this.auth.login(result.email, result.password).subscribe());
        },
      })
    );

    this.sub.unsubscribe();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
