import { Component, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { take } from 'rxjs';

import { User } from '@models/user';
import { UserService } from '@services/user/user.service';
import { UserEditCardComponent } from './user-edit-card.component';

@Component({
  selector: 'app-user-edit',
  imports: [UserEditCardComponent],
  template: `<app-user-edit-card [(userEditForm)]="userEditForm" (cancel)="cancel()" (save)="save()" />`,
})
export default class UserEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #userService = inject(UserService);
  readonly #router = inject(Router);

  protected readonly id = input.required();
  #user = <User>{};
  protected userEditForm!: FormGroup;

  ngOnInit() {
    this.userEditForm = this.#fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    if (this.id() !== 'new') {
      this.loadFormValues(+this.id());
    }
  }

  private loadFormValues(id: number) {
    this.#userService
      .getByKey(id)
      .pipe(take(1))
      .subscribe((user: User) => {
        this.#user = { ...user };
        this.userEditForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      });
  }

  protected save() {
    const patchData = this.userEditForm.getRawValue();
    this.#userService.patch(this.#user.id, patchData).pipe(take(1)).subscribe();
    this.#location.back();
  }

  protected cancel() {
    this.#router.navigate(['/admin/users']);
  }
}
