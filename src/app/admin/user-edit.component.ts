import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Subscription } from 'rxjs';

import { UserService } from '../services/user.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-user-edit',
  template: `
    <mat-card>
      <mat-card-title>Path Edit</mat-card-title>
      <mat-card-content>
        <form *ngIf="userEditForm" [formGroup]="userEditForm">
          <mat-form-field appearance="outline">
            <mat-label for="name">Name</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="name"
              matInput
              formControlName="name"
              placeholder="Enter name of user"
            />
            <mat-error *ngIf="userEditForm.controls.name.errors?.required && userEditForm.controls.name?.touched">
              Name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label for="email">Email</mat-label>
            <input type="text" id="email" matInput formControlName="email" placeholder="Enter email of user" />
            <mat-error *ngIf="userEditForm.controls.name.errors?.required && userEditForm.controls.name?.touched">
              Email is required
            </mat-error>
          </mat-form-field>

          <label id="role">Role</label>
          <mat-radio-group aria-labelledby="Role" class="radio-group" id="role" formControlName="role">
            <mat-radio-button class="radio-button" value="admin">Admin</mat-radio-button>
            <mat-radio-button class="radio-button" value="user">User</mat-radio-button>
          </mat-radio-group>
          <mat-error *ngIf="userEditForm.controls.role.errors?.required && userEditForm.controls.role?.touched">
            Role is required
          </mat-error>
        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="warn" (click)="save()" title="Save" [disabled]="!userEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <a mat-flat-button color="accent" class="ml-10" [routerLink]="['/admin/users']"
          ><mat-icon>cancel</mat-icon> Cancel</a
        >
      </mat-card-actions>
    </mat-card>
  `,

  styles: [
    `
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
  ],
})
export class UserEditComponent implements OnInit, OnDestroy {
  componentActive = true;
  user = <User>{};
  userEditForm!: FormGroup;
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userEditForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    this.sub.add(
      this.route.params.subscribe((params) => {
        if (params.id !== 'new') {
          this.sub.add(
            this.userService.getByKey(params.id).subscribe((user: User) => {
              this.user = { ...user };
              this.userEditForm.patchValue({
                name: user.name,
                email: user.email,
                role: user.role,
              });
            })
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
    this.sub.unsubscribe();
  }

  save() {
    const patchData = this.userEditForm.getRawValue();
    this.sub.add(this.userService.patch(this.user.id, patchData).subscribe());
    this.location.back();
  }
}
