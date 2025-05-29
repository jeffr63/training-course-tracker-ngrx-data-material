import { Component, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-user-edit-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-title>User Edit</mat-card-title>
      <mat-card-content>
        @if (userEditForm()) {
        <form [formGroup]="userEditForm()">
          <mat-form-field appearance="outline">
            <mat-label for="name">Name</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="name"
              matInput
              formControlName="name"
              placeholder="Enter name of user" />
            @if (userEditForm().controls.name.errors?.required && userEditForm().controls.name?.touched) {
            <mat-error>Name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="email">Email</mat-label>
            <input type="text" id="email" matInput formControlName="email" placeholder="Enter email of user" />
            @if (userEditForm().controls.email.errors?.required && userEditForm().controls.email?.touched) {
            <mat-error>Email is required</mat-error>
            }
          </mat-form-field>

          <label id="role">Role</label>
          <mat-radio-group aria-labelledby="Role" class="radio-group" id="role" formControlName="role">
            <mat-radio-button class="radio-button" value="admin">Admin</mat-radio-button>
            <mat-radio-button class="radio-button" value="user">User</mat-radio-button>
          </mat-radio-group>
          @if (userEditForm().controls.role.errors?.required && userEditForm().controls.role?.touched) {
          <mat-error>Role is required</mat-error>
          }
        </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save.emit()" title="Save" [disabled]="!userEditForm().valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="accent" class="ml-10" (click)="cancel.emit()">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
      /* TODO(mdc-migration): The following rule targets internal classes of card that may no longer apply for the MDC version. */
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
  userEditForm = model.required<FormGroup>();
  cancel = output();
  save = output();
}
