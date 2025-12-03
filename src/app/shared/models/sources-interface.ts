import { required, schema } from '@angular/forms/signals';

export interface Source {
  id?: number;
  name: string;
}

export const SOURCE_EDIT_SCHEMA = schema<Source>((schemaPath) => {
  required(schemaPath.name, { message: 'Please enter source name' });
});
