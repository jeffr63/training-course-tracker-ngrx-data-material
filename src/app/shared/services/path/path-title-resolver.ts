import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { map } from 'rxjs';

import { PathData } from '@services/path/path-data';

export const pathNameResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Path';
  } else {
    return inject(PathData)
      .getByKey(id)
      .pipe(map((path) => path.name));
  }
};
