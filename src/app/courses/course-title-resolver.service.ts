import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';

import { CourseService } from './course.service';

@Injectable({
  providedIn: 'root',
})
export class CourseTitleResolverService implements Resolve<string> {
  private sub = new Subscription();

  constructor(private courseService: CourseService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    const id = route.paramMap.get('id');
    if (id == 'new') {
      return 'CourseList - New Course';
    } else {
      return this.courseService.getByKey(id).pipe(map((course) => `CourseList - ${course.title}`));
    }
  }
}
