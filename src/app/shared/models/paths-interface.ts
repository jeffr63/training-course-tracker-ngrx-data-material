import { required, schema } from '@angular/forms/signals';

export interface Path {
  id?: number;
  name: string;
}

export const PATH_EDIT_SCHEMA = schema<Path>(schemaPath => {
  required(schemaPath.name, { message: 'Please enter path name' });
})


