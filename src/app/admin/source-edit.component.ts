import { Component, OnInit, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { Source } from '../shared/models/sources';
import { SourceService } from '../shared/services/source.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-source-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],

  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Source Edit</mat-card-title>
      <mat-card-content>
        @if (sourceEditForm) {
        <form [formGroup]="sourceEditForm">
          <mat-form-field appearance="outline">
            <mat-label for="name">Source Name</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="name"
              placeholder="Enter name of source" />
            @if (sourceEditForm.controls.name.errors?.required && sourceEditForm.controls.name?.touched) {
            <mat-error>Source name is required </mat-error>
            }
          </mat-form-field>
        </form>
        }
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save()" title="Save" [disabled]="!sourceEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <button mat-flat-button color="accent" class="ml-10" [routerLink]="['/admin/sources']">
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
export default class SourceEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private sourceService = inject(SourceService);

  @Input() id;
  isNew = true;
  source = <Source>{};
  sourceEditForm!: FormGroup;

  ngOnInit() {
    this.sourceEditForm = this.fb.group({
      name: ['', Validators.required],
    });

    if (this.id !== 'new') {
      this.isNew = false;
      this.loadFormValues(+this.id);
    }
  }

  loadFormValues(id: number) {
    this.sourceService
      .getByKey(id)
      .pipe(take(1))
      .subscribe((source: Source) => {
        this.source = { ...source };
        this.sourceEditForm.get('name').setValue(this.source.name);
      });
  }

  save() {
    this.source.name = this.sourceEditForm.controls.name.value;
    if (this.isNew) {
      this.sourceService.add(this.source);
    } else {
      this.sourceService.update(this.source);
    }
    this.location.back();
  }
}
