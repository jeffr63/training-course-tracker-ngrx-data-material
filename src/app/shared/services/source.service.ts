import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Source } from '../models/sources';

@Injectable({ providedIn: 'root' })
export class SourceService extends EntityCollectionServiceBase<Source> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Sources', serviceElementsFactory);
  }
}
