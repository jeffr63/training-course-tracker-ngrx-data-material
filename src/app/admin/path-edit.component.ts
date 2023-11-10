import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { Path } from '../shared/models/paths';
import { PathService } from '../shared/services/path.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-path-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
  ],

  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Path Edit</mat-card-title>
      <mat-card-content>
        @if (pathEditForm) {
        <form [formGroup]="pathEditForm">
          <mat-form-field appearance="outline">
            <mat-label for="name">Path Name</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="name"
              placeholder="Enter name of path" />
            @if (pathEditForm.controls.name.errors?.required && pathEditForm.controls.name?.touched) {
            <mat-error> Path name is required </mat-error>
            }
          </mat-form-field>
        </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save()" title="Save" [disabled]="!pathEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="accent" class="ml-10" [routerLink]="['/admin/paths']">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-card-actions>
    </mat-card>
  `,

  styles: [
    `
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
    `,
  ],
})
export default class PathEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private pathService = inject(PathService);

  @Input() id;
  isNew = true;
  path = <Path>{};
  pathEditForm!: FormGroup;

  ngOnInit() {
    this.pathEditForm = this.fb.group({
      name: ['', Validators.required],
    });
    if (this.id !== 'new') {
      this.isNew = false;
      this.loadFormValues(+this.id);
    }
  }

  loadFormValues(id: number) {
    this.pathService
      .getByKey(id)
      .pipe(take(1))
      .subscribe((path: Path) => {
        this.path = { ...path };
        this.pathEditForm.get('name').setValue(this.path.name);
      });
  }

  save() {
    this.path.name = this.pathEditForm.controls.name.value;
    if (this.isNew) {
      this.pathService.add(this.path);
    } else {
      this.pathService.update(this.path);
    }
    this.location.back();
  }
}
