import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { map } from 'rxjs';

import { PathService } from '../services/path.service';

export const pathNameResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Path';
  } else {
    return inject(PathService)
      .getByKey(id)
      .pipe(map((path) => path.name));
  }
};
