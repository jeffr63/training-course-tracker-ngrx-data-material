import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { map } from 'rxjs';

import { SourceData } from '@services/source/source-data';

export const sourceNameResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Source';
  } else {
    return inject(SourceData)
      .getByKey(id)
      .pipe(map((source) => source.name));
  }
};
