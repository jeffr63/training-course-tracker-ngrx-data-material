import { Component, OnInit, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { take } from 'rxjs';

import { Path } from '@models/paths';
import { PathEditCardComponent } from './path-edit-card.component';
import { PathService } from '@services/path/path.service';

@Component({
  selector: 'app-path-edit',
  imports: [PathEditCardComponent],
  template: ` <app-path-edit-card [(pathEditForm)]="pathEditForm" (cancel)="cancel()" (save)="save()" /> `,
  styles: ``,
})
export default class PathEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #pathService = inject(PathService);
  readonly #router = inject(Router);

  protected readonly id = input.required();
  #isNew = true;
  #path = <Path>{};
  protected pathEditForm!: FormGroup;

  ngOnInit() {
    this.pathEditForm = this.#fb.group({
      name: ['', Validators.required],
    });
    if (this.id() !== 'new') {
      this.#isNew = false;
      this.loadFormValues(+this.id());
    }
  }

  private loadFormValues(id: number) {
    this.#pathService
      .getByKey(id)
      .pipe(take(1))
      .subscribe((path: Path) => {
        this.#path = { ...path };
        this.pathEditForm.get('name').setValue(this.#path.name);
      });
  }

  protected save() {
    this.#path.name = this.pathEditForm.controls.name.value;
    if (this.#isNew) {
      this.#pathService.add(this.#path);
    } else {
      this.#pathService.update(this.#path);
    }
    this.#location.back();
  }

  protected cancel() {
    this.#router.navigate(['/admin/paths']);
  }
}
