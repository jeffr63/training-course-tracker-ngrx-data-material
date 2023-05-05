import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { map, Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserTitleResolverService {
  userService = inject(UserService);

  resolve(route: ActivatedRouteSnapshot): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New User';
    } else {
      return this.userService.getByKey(id).pipe(map((user) => user.name));
    }
  }
}
