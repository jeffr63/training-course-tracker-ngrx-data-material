import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { of } from 'rxjs';
import { provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { DashboardComponent } from './dashboard.component';
import { DOMHelperRoutines } from '../../testing/dom.helpers';
import { CourseData } from '@models/course';
import { CourseService } from '@services/course/course.service';
import { entityConfig } from '../entity-metadata';
import { Component } from '@angular/core';
import { DashboardGridComponent } from './dashboard-grid.component';

@Component({
  selector: 'app-dashboard-grid',
  template: `<h1>mocked dashboard grid</h1>`,
})
export class DashboardGridComponentMock {}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let dh: DOMHelperRoutines<DashboardComponent>;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockCourseService;
  let mockData = [
    {
      id: 1,
      title: '1',
      instructor: '1',
      path: 'Angular',
      source: 'Youtube',
    },
    {
      id: 2,
      title: '2',
      instructor: '2',
      path: 'Angular',
      source: 'Pluralsight',
    },
    {
      id: 3,
      title: '3',
      instructor: '3',
      path: 'React',
      source: 'Pluralsight',
    },
  ];

  let entityMetaData = {
    Courses: {},
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideStore(),
        provideEffects(),
        provideEntityData(entityConfig, withEffects()),
        provideAnimationsAsync(),
      ],
    })
      .overrideComponent(DashboardComponent, {
        remove: { inputs: [DashboardGridComponent] },
        add: { inputs: [DashboardGridComponentMock] },
      })
      .compileComponents();
    mockCourseService = TestBed.inject(CourseService);
    spyOn(mockCourseService, 'getAll').and.returnValue(of(mockData));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dh = new DOMHelperRoutines(fixture);
  });

  describe('NgOnInit', () => {
    it('should declare the paths signal', () => {
      const paths: CourseData[] = [
        { name: 'Angular', value: 2 },
        { name: 'React', value: 1 },
      ];
      fixture.detectChanges();
      expect(component.paths()).toEqual(paths);
    });

    it('should declare the sourses signal', () => {
      const sources: CourseData[] = [
        { name: 'Pluralsight', value: 2 },
        { name: 'Youtube', value: 1 },
      ];
      fixture.detectChanges();
      expect(component.sources()).toEqual(sources);
    });
  });
});
