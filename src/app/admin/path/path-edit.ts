import { Component, OnInit, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { form } from '@angular/forms/signals';

import { of } from 'rxjs';

import { Path, PATH_EDIT_SCHEMA } from '@models/paths-interface';
import { PathData } from '@services/path/path-data';
import { PathEditCard } from './path-edit-card';

@Component({
  selector: 'app-path-edit',
  imports: [PathEditCard],
  template: ` <app-path-edit-card [form]="form" (cancel)="cancel()" (save)="save()" /> `,
  styles: ``,
})
export default class PathEdit implements OnInit {
  readonly #location = inject(Location);
  readonly #pathService = inject(PathData);
  readonly #router = inject(Router);

  protected readonly id = input.required<string>();
  #isNew = true;

  readonly #path = rxResource<Path, string>({
    params: () => this.id(),
    stream: ({ params: id }) => {
      if (id === 'new') return of({ name: '' });
      const publisher = this.#pathService.getByKey(+id);
      return publisher;
    },
  });

  readonly form = form<Path>(this.#path.value, PATH_EDIT_SCHEMA);

  ngOnInit() {
    if (this.id() !== 'new') {
      this.#isNew = false;
    }
  }

  protected save() {
    if (this.#isNew) {
      this.#pathService.add(this.#path.value());
    } else {
      this.#pathService.update(this.#path.value());
    }
    this.#location.back();
  }

  protected cancel() {
    this.#router.navigate(['/admin/paths']);
  }
}
