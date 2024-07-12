import { Component, OnInit, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ModalDataService } from './modal-data.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule],

  template: `
    <div style="margin:10px">
      <h2 mat-dialog-title>Delete?</h2>
      <mat-dialog-content>
        <p>
          <strong>{{ modalOptions.title }}</strong>
        </p>
        <p>
          {{ modalOptions.body }}
          @if (modalOptions.warning) {
          <span class="text-danger">{{ modalOptions.warning }}</span>
          }
        </p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-flat-button color="warn" (click)="dialog.close('delete')" title="Delete"><mat-icon>delete</mat-icon> Delete</button>
        <button mat-flat-button color="accent" (click)="dialog.close()" title="Cancel" class="ml-10"><mat-icon>cancel</mat-icon> Cancel</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .ml-10 {
        margin-left: 10px;
      }
    `,
  ],
})
export class DeleteComponent implements OnInit {
  protected readonly dialog = inject(MatDialogRef<DeleteComponent>);
  #modalDataService = inject(ModalDataService);

  protected modalOptions = {
    title: '',
    body: '',
    warning: '',
  };

  ngOnInit() {
    this.modalOptions = this.#modalDataService.getDeleteModalOtions();
  }
}
