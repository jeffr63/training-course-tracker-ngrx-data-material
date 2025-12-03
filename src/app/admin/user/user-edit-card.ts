import { JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ValidationErrors } from '@components/validation-errors';
import { User } from '@models/user-interface';

@Component({
  selector: 'app-user-edit-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    Field,
    ValidationErrors,
    JsonPipe,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>User Edit</mat-card-title>
      <mat-card-content>
        @if (form()) {
          <form>
            <mat-form-field appearance="outline">
              <mat-label for="name">Name</mat-label>
              <input
                ngbAutofocus
                type="text"
                id="name"
                matInput
                [field]="form().name"
                placeholder="Enter name of user" />
              @let fname = form().name();
              @if (fname.invalid() && fname.touched()) {
                <app-validation-errors matError [errors]="fname.errors()" />
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label for="email">Email</mat-label>
              <input type="text" id="email" matInput [field]="form().email" placeholder="Enter email of user" />
              @let femail = form().email();
              @if (femail.invalid() && femail.touched()) {
                <app-validation-errors matError [errors]="femail.errors()" />
              }
            </mat-form-field>

            <label id="role">Role</label>
            <mat-radio-group aria-labelledby="Role" class="radio-group" id="role" [field]="form().role">
              <mat-radio-button class="radio-button" value="admin">Admin</mat-radio-button>
              <mat-radio-button class="radio-button" value="user">User</mat-radio-button>
            </mat-radio-group>
            @let frole = form().role();
            @if (frole.invalid() && frole.touched()) {
              <app-validation-errors matError [errors]="frole.errors()" />
            }
          </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save.emit()" title="Save" [disabled]="form()().invalid()">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="accent" class="ml-10" (click)="cancel.emit()">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    mat-card {
      margin: 30px;
      padding-left: 15px;
      padding-right: 15px;
      width: 30%;
    }

    mat-content {
      width: 100%;
    }

    mat-form-field {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .ml-10 {
      margin-left: 10px;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      margin: 15px 0;
      align-items: flex-start;
    }

    .radio-button {
      margin: 5px;
    }
  `,
})
export class UserEditCard {
  form = input.required<FieldTree<User>>();
  cancel = output();
  save = output();
}
