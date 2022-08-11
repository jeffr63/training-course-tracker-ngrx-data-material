import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Subscription } from 'rxjs';

import { Path } from '../models/paths';
import { PathService } from '../services/path.service';

@Component({
  selector: 'app-path-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgIf,
    RouterModule,
    ReactiveFormsModule,
  ],

  template: `
    <mat-card>
      <mat-card-title>Path Edit</mat-card-title>
      <mat-card-content>
        <form *ngIf="pathEditForm" [formGroup]="pathEditForm">
          <mat-form-field appearance="outline">
            <mat-label for="name">Path Name</mat-label>
            <input
              ngbAutofocus
              type="text"
              id="title"
              matInput
              formControlName="name"
              placeholder="Enter name of path"
            />
            <mat-error *ngIf="pathEditForm.controls.name.errors?.required && pathEditForm.controls.name?.touched">
              Path name is required
            </mat-error>
          </mat-form-field>
        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-flat-button color="primary" (click)="save()" title="Save" [disabled]="!pathEditForm.valid">
          <mat-icon>save</mat-icon> Save
        </button>
        <a mat-flat-button color="accent" class="ml-10" [routerLink]="['/admin/paths']"
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
export class PathEditComponent implements OnInit, OnDestroy {
  componentActive = true;
  pathEditForm!: FormGroup;
  private path = <Path>{};
  private isNew = true;
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private pathService: PathService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.pathEditForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.sub.add(
      this.route.params.subscribe((params) => {
        if (params.id !== 'new') {
          this.isNew = false;
          this.sub.add(
            this.pathService.getByKey(params.id).subscribe((path: Path) => {
              this.path = { ...path };
              this.pathEditForm.get('name').setValue(this.path.name);
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
    this.path.name = this.pathEditForm.controls.name.value;
    if (this.isNew) {
      this.pathService.add(this.path);
    } else {
      this.pathService.update(this.path);
    }
    this.location.back();
  }
}
