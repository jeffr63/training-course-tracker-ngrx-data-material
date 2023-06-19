import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { map } from 'rxjs';

import { SourceService } from '../services/source.service';

export const sourceNameResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Source';
  } else {
    return inject(SourceService)
      .getByKey(id)
      .pipe(map((source) => source.name));
  }
};
