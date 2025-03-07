import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-toolbar',
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
      <button mat-flat-button color="primary" (click)="logout.emit()" id="logout">Logout</button>
      } @else {
      <button mat-flat-button color="primary" (click)="login.emit()" id="login">Login</button>
      }
    </mat-toolbar>
  `,
  styles: `
    div .nav-item {
        cursor: pointer;
      }
    `,
})
export class MenuToolbarComponent {
  isLoggedIn = input.required();
  isLoggedInAsAdmin = input.required();
  login = output();
  logout = output();
}
