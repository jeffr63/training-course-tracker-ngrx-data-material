import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { of } from 'rxjs';
import { provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { Dashboard } from './dashboard';
import { DOMHelperRoutines } from '../../testing/dom.helpers';
import { entityConfig } from '../entity-metadata';
import { Component } from '@angular/core';
import { DashboardGrid } from './dashboard-grid';
import { CourseData } from '@services/course/course-data';

@Component({
  selector: 'app-dashboard-grid',
  template: `<h1>mocked dashboard grid</h1>`,
})
export class DashboardGridMock {}

describe('Dashboard', () => {
  let component: Dashboard;
  let dh: DOMHelperRoutines<Dashboard>;
  let fixture: ComponentFixture<Dashboard>;
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
      imports: [Dashboard],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideStore(),
        provideEffects(),
        provideEntityData(entityConfig, withEffects()),
        provideAnimationsAsync(),
      ],
    })
      .overrideComponent(Dashboard, {
        remove: { inputs: [DashboardGrid] },
        add: { inputs: [DashboardGridMock] },
      })
      .compileComponents();
    mockCourseService = TestBed.inject(CourseData);
    spyOn(mockCourseService, 'getAll').and.returnValue(of(mockData));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dashboard);
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
