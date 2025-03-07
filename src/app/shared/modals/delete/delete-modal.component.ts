import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ModalDataService } from '@services/common/modal-data.service';
import { DeleteModalContentComponent } from './delete-modal-content.component';

@Component({
  selector: 'app-delete-modal',
  imports: [DeleteModalContentComponent],
  template: ` <app-delete-modal-content [modalOptions]="modalOptions" (close)="close($event)" /> `,
})
export class DeleteModalComponent implements OnInit {
  readonly #dialogRef = inject(MatDialogRef<DeleteModalComponent>);
  readonly #modalDataService = inject(ModalDataService);

  protected modalOptions = {
    title: '',
    body: '',
    warning: '',
  };

  ngOnInit() {
    this.modalOptions = this.#modalDataService.getDeleteModalOtions();
  }

  protected close(flag: string) {
    this.#dialogRef.close(flag);
  }
}
