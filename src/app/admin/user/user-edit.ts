import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { form } from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';

import { of, take } from 'rxjs';

import { User, USER_EDIT_SCHEMA } from '@models/user-interface';
import { UserData } from '@services/user/user-data';
import { UserEditCard } from './user-edit-card';

@Component({
  selector: 'app-user-edit',
  imports: [UserEditCard],
  template: `<app-user-edit-card [form]="form" (cancel)="cancel()" (save)="save()" />`,
})
export default class UserEdit {
  readonly #userService = inject(UserData);
  readonly #router = inject(Router);

  protected readonly id = input.required<string>();
  readonly #isNew = computed(() => this.id() === 'new' ? true : false);

  readonly #user = rxResource<User, string>({
    params: () => this.id(),
    stream: ({ params: id }) => {
      if (id === 'new') return of({ email: '', name: '', role: '', password: '' });
      const user = this.#userService.getByKey(+id);
      return user;
    },
  });

  readonly form = form<User>(this.#user.value, USER_EDIT_SCHEMA);

  protected save() {
    this.#userService.patch(this.#user.value().id, this.#user.value()).pipe(take(1)).subscribe();
    this.#router.navigate(['/admin/users']);
  }

  protected cancel() {
    this.#router.navigate(['/admin/users']);
  }
}
