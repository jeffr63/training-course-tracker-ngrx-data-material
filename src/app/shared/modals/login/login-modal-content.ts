import { Component, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-modal-content',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule, ReactiveFormsModule],
  template: `
    <div style="margin:10px">
      <h2 mat-dialog-title>Login</h2>
      <mat-dialog-content>
        <form [formGroup]="loginForm()">
          <mat-form-field appearance="outline" class="mt-5">
            <mat-label for="email">Email Address</mat-label>
            <mat-icon matIconSuffix>mail_outline</mat-icon>
            <input
              ngbAutofocus
              type="email"
              id="email"
              matInput
              formControlName="email"
              placeholder="Enter email address" />
            @if (loginForm().controls.email.errors?.required && loginForm().controls.email?.touched) {
            <mat-error>Email is required</mat-error>
            } @if (loginForm().controls.email.errors?.email && loginForm().controls.email?.touched) {
            <mat-error> Must enter valid email </mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="mt-5">
            <mat-label for="email">Password</mat-label>
            <mat-icon (click)="flag = !flag" matIconSuffix>{{ flag ? 'visibility' : 'visibility_off' }}</mat-icon>
            <input id="password" matInput formControlName="password" [type]="flag ? 'password' : 'text'" />
            @if (loginForm().controls.password.errors?.required && loginForm().controls.password?.touched) {
            <mat-error> Password is required </mat-error>
            }
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions [align]="'end'">
        <button mat-flat-button color="primary" (click)="login.emit()">Login</button>
        <button mat-flat-button mat-dialog-close color="warn" (click)="cancel.emit()" class="ml-8">Cancel</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    mat-form-field {
      width: 100%;
    }

    .mt-5 {
      margin-top: 5px;
    }

    .ml-8 {
      margin-left: 8px;
    }
  `,
})
export class LoginModalContent {
  loginForm = model.required<FormGroup>();
  cancel = output();
  login = output();

  protected flag = true;
}
