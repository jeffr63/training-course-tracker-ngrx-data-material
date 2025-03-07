import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-modal-content',
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  template: `
    <div style="margin:10px">
      <h2 mat-dialog-title>Delete?</h2>
      <mat-dialog-content>
        <p>
          <strong>{{ modalOptions().title }}</strong>
        </p>
        <p>
          {{ modalOptions().body }}
          @if (modalOptions().warning) {
          <span class="text-danger">{{ modalOptions().warning }}</span>
          }
        </p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-flat-button color="warn" (click)="close.emit('delete')" title="Delete">
          <mat-icon>delete</mat-icon> Delete
        </button>
        <button mat-flat-button color="accent" (click)="close.emit('')" title="Cancel" class="ml-10">
          <mat-icon>cancel</mat-icon> Cancel
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    .ml-10 {
      margin-left: 10px;
    }
  `,
})
export class DeleteModalContentComponent {
  modalOptions = input.required<{ title: string; warning: string; body: string }>();
  close = output<string>();
}
