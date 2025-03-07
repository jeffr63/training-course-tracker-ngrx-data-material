import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { map, Observable } from 'rxjs';

import { CourseService } from '@services/course/course.service';

export const courseTitleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Course';
  } else {
    return inject(CourseService)
      .getByKey(id)
      .pipe(map((course) => course.title));
  }
};
