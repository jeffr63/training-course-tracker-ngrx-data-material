import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';

import { SourceService } from './source.service';

@Injectable({
  providedIn: 'root',
})
export class SourceTitleResolverService implements Resolve<string> {
  private sub = new Subscription();

  constructor(private sourceService: SourceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Source';
    } else {
      return this.sourceService.getByKey(id).pipe(map((source) => source.name));
    }
  }
}
