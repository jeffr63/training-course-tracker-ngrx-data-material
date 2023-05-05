import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalDataService {
  private deleteModalOptions = {
    title: '',
    body: '',
    warning: '',
  };

  getDeleteModalOtions(): any {
    return this.deleteModalOptions;
  }

  setDeleteModalOptions(options: any) {
    this.deleteModalOptions = options;
  }
}
