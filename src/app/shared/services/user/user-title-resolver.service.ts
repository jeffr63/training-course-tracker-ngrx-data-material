import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { map } from 'rxjs';

import { UserService } from '@services/user/user.service';

export const userNameResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New User';
  } else {
    return inject(UserService)
      .getByKey(id)
      .pipe(map((user) => user.name));
  }
};
