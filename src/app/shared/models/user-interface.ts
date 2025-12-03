import { email, required, schema } from '@angular/forms/signals';

export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  role: string;
}

export const USER_EDIT_SCHEMA = schema<User>(schemaPath => {
  required(schemaPath.email, { message: 'Please enter email address' });
  email(schemaPath.email, { message: 'Please enter valid email' });
  required(schemaPath.name, { message: 'Please enter user name' });
  required(schemaPath.role, { message: 'Please select user role' });
});
