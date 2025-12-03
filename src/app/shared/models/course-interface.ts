import { required, schema } from '@angular/forms/signals';

export interface Course {
  id?: number;
  title: string;
  instructor: string;
  path: string;
  source: string;
}

export interface CourseChartData {
  name: string;
  value: number;
}

export const COURSE_EDIT_SCHEMA = schema<Course>((schemaPath) => {
  required(schemaPath.title, { message: 'Please enter course title' });
  required(schemaPath.instructor, { message: 'Please enter the instructor name' });
  required(schemaPath.path, { message: 'Please select path' });
  required(schemaPath.source, { message: 'Please selected source' });
});
