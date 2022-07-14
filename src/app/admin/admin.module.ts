import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, TitleStrategy } from '@angular/router';

import { AdminComponent } from './admin.component';
import { CanActivateAdmin } from '../auth/canActiveateAdmin.guard';
import { CustomTitleStrategyService } from './../services/custom-title-strategy.service';
import { PathListComponent } from './path-list.component';
import { PathEditComponent } from './path-edit.component';
import { SourceListComponent } from './source-list.component';
import { SourceEditComponent } from './source-edit.component';
import { UserEditComponent } from './user-edit.component';
import { UserListComponent } from './user-list.component';
import { MaterialModule } from '../material.module';
import { UserTitleResolverService } from '../services/user-title-resolver.service';
import { PathTitleResolverService } from '../services/path-title-resolver.service';
import { SourceTitleResolverService } from '../services/source-title-resolver.service';

const routes = [
  {
    path: '',
    children: [
      { path: '', component: AdminComponent },
      { path: 'sources', title: 'Sources', component: SourceListComponent },
      { path: 'sources/:id', title: SourceTitleResolverService, component: SourceEditComponent },
      { path: 'paths', title: 'Paths', component: PathListComponent },
      { path: 'paths/:id', title: PathTitleResolverService, component: PathEditComponent },
      { path: 'users', title: 'Users', component: UserListComponent },
      { path: 'users/:id', title: UserTitleResolverService, component: UserEditComponent },
    ],
    canActivate: [CanActivateAdmin],
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    PathListComponent,
    PathEditComponent,
    SourceListComponent,
    SourceEditComponent,
    UserEditComponent,
    UserListComponent,
  ],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
