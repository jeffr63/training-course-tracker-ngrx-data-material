import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { map, Observable } from 'rxjs';

import { SourceService } from '../services/source.service';

@Injectable({
  providedIn: 'root',
})
export class SourceTitleResolverService {
  private sourceService = inject(SourceService);

  resolve(route: ActivatedRouteSnapshot): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Source';
    } else {
      return this.sourceService.getByKey(id).pipe(map((source) => source.name));
    }
  }
}
