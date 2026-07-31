import { Service } from '@angular/core';

@Service()
export class ModalService {
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
