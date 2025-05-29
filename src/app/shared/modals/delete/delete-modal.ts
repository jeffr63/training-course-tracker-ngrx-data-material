import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ModalService } from '@services/common/modal-service';
import { DeleteModalContent } from './delete-modal-content';

@Component({
  selector: 'app-delete-modal',
  imports: [DeleteModalContent],
  template: ` <app-delete-modal-content [modalOptions]="modalOptions" (close)="close($event)" /> `,
})
export class DeleteModal implements OnInit {
  readonly #dialogRef = inject(MatDialogRef<DeleteModal>);
  readonly #modalDataService = inject(ModalService);

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
