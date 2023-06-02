import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { map, Observable } from 'rxjs';

import { PathService } from '../services/path.service';

@Injectable({
  providedIn: 'root',
})
export class PathTitleResolverService {
  pathService = inject(PathService);

  resolve(route: ActivatedRouteSnapshot): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Path';
    } else {
      return this.pathService.getByKey(id).pipe(map((path) => path.name));
    }
  }
}
