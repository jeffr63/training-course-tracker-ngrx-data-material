import { Injectable } from '@angular/core';

import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { Path } from '@models/paths-interface';

@Injectable({ providedIn: 'root' })
export class PathData extends EntityCollectionServiceBase<Path> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Paths', serviceElementsFactory);
  }
}
