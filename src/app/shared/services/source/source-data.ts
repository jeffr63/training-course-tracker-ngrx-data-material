import { Injectable } from '@angular/core';

import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { Source } from '@models/sources-interface';

@Injectable({ providedIn: 'root' })
export class SourceData extends EntityCollectionServiceBase<Source> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Sources', serviceElementsFactory);
  }
}
