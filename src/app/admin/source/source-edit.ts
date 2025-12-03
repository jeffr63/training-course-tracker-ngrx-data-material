import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { form } from '@angular/forms/signals';

import { of } from 'rxjs';

import { Source, SOURCE_EDIT_SCHEMA } from '@models/sources-interface';
import { SourceEditCard } from './source-edit-card';
import { SourceData } from '@services/source/source-data';

@Component({
  selector: 'app-source-edit',
  imports: [SourceEditCard],
  template: `<app-source-edit-card [form]="form" (cancel)="cancel()" (save)="save()" />`,
})
export default class SourceEdit {
  readonly #sourceService = inject(SourceData);
  readonly #router = inject(Router);

  protected readonly id = input.required<string>();
  readonly #isNew = computed(() => (this.id() === 'new' ? true : false));

  readonly #source = rxResource<Source, string>({
    params: () => this.id(),
    stream: ({ params: id }) => {
      if (id === 'new') return of({ name: '' });
      const source = this.#sourceService.getByKey(+id);
      return source;
    },
  });

  protected readonly form = form<Source>(this.#source.value, SOURCE_EDIT_SCHEMA);

  protected save() {
    if (this.#isNew()) {
      this.#sourceService.add(this.#source.value());
    } else {
      this.#sourceService.update(this.#source.value());
    }
    this.#router.navigate(['/admin/sources']);
  }

  protected cancel() {
    this.#router.navigate(['/admin/sources']);
  }
}
