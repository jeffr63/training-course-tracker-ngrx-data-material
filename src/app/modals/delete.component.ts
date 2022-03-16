import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ModalDataService } from './modal-data.service';

@Component({
  selector: 'app-delete',
  template: `
    <div style="margin:10px">
      <h2 mat-dialog-title>Delete?</h2>
      <mat-dialog-content>
        <p>
          <strong>{{ modalOptions.title }}</strong>
        </p>
        <p>
          {{ modalOptions.body }}
          <span class="text-danger" *ngIf="modalOptions.warning">{{ modalOptions.warning }}</span>
        </p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-flat-button color="warn" (click)="dialog.close('delete')" title="Delete">
          <mat-icon>delete</mat-icon> Delete
        </button>
        <button mat-flat-button color="accent" (click)="dialog.close()" title="Cancel" class="ml-10">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      . ml-10 {
        margin-left: 10px;
      }
    `,
  ],
})
export class DeleteComponent implements OnInit {
  modalOptions = {
    title: '',
    body: '',
    warning: '',
  };

  constructor(public dialog: MatDialogRef<DeleteComponent>, private modalDataService: ModalDataService) {}

  ngOnInit() {
    this.modalOptions = this.modalDataService.getDeleteModalOtions();
  }
}
