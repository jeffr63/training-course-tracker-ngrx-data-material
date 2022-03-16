import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Subscription } from 'rxjs';

import { Source } from '../shared/sources';
import { SourceService } from '../services/source.service';

@Component({
  selector: 'app-source-edit',

  template: `
    <mat-card>
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
        <button mat-flat-button color="warn" (click)="save()" title="Save" [disabled]="!sourceEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <a mat-flat-button color="accent" class="ml-10" [routerLink]="['/admin/sources']"
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
    `,
  ],
})
export class SourceEditComponent implements OnInit, OnDestroy {
  componentActive = true;
  sourceEditForm!: FormGroup;
  private source = <Source>{};
  private isNew = true;
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private sourceService: SourceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.sourceEditForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.sub.add(
      this.route.params.subscribe((params) => {
        if (params.id !== 'new') {
          this.isNew = false;
          this.sub.add(
            this.sourceService.getByKey(params.id).subscribe((source: Source) => {
              this.source = { ...source };
              this.sourceEditForm.get('name').setValue(this.source.name);
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
    this.source.name = this.sourceEditForm.controls.name.value;
    if (this.isNew) {
      this.sourceService.add(this.source);
    } else {
      this.sourceService.update(this.source);
    }
    this.location.back();
  }
}
