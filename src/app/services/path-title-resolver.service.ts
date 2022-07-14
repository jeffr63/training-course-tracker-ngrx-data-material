import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';

import { PathService } from './path.service';

@Injectable({
  providedIn: 'root',
})
export class PathTitleResolverService implements Resolve<string> {
  private sub = new Subscription();

  constructor(private pathService: PathService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Path';
    } else {
      return this.pathService.getByKey(id).pipe(map((path) => path.name));
    }
  }
}
