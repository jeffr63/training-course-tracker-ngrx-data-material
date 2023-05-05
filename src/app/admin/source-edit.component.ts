import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ReplaySubject, takeUntil } from 'rxjs';

import { Source } from '../models/sources';
import { SourceService } from '../services/source.service';

@Component({
  selector: 'app-source-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
  ],

  template: `
    <mat-card appearance="outlined">
      <mat-card-title>Source Edit</mat-card-title>
      <mat-card-content>
        <form *ngIf="sourceEditForm" [formGroup]="sourceEditForm">
          <mat-form-field appearance="outline">
            <mat-label for="name">Source Name</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="name"
              placeholder="Enter name of source"
            />
            <mat-error *ngIf="sourceEditForm.controls.name.errors?.required && sourceEditForm.controls.name?.touched">
              Source name is required
            </mat-error>
          </mat-form-field>
        </form>
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
export default class SourceEditComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  location = inject(Location);
  route = inject(ActivatedRoute);
  sourceService = inject(SourceService);

  destroyed$ = new ReplaySubject<void>(1);
  isNew = true;
  source = <Source>{};
  sourceEditForm!: FormGroup;

  ngOnInit() {
    this.sourceEditForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.route.params.subscribe((params) => {
      if (params.id !== 'new') {
        this.isNew = false;
        this.loadFormValues(params.id);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  loadFormValues(id: number) {
    this.sourceService
      .getByKey(id)
      .pipe(takeUntil(this.destroyed$))
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
