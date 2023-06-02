import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { map, Observable } from 'rxjs';

import { CourseService } from '../services/course.service';

@Injectable({
  providedIn: 'root',
})
export class CourseTitleResolverService {
  private courseService = inject(CourseService);

  resolve(route: ActivatedRouteSnapshot): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'New Course';
    } else {
      return this.courseService.getByKey(id).pipe(map((course) => course.title));
    }
  }
}
