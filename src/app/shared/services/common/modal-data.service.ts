import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalDataService {
  #deleteModalOptions = {
    title: '',
    body: '',
    warning: '',
  };

  public getDeleteModalOtions(): any {
    return this.#deleteModalOptions;
  }

  public setDeleteModalOptions(options: any) {
    this.#deleteModalOptions = options;
  }
}
