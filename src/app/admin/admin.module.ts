import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CanActivateAdmin } from '../auth/canActiveateAdmin.guard';
import { UserTitleResolverService } from '../services/user-title-resolver.service';
import { PathTitleResolverService } from '../services/path-title-resolver.service';
import { SourceTitleResolverService } from '../services/source-title-resolver.service';

const routes = [
  {
    path: '',
    children: [
      { path: '', loadComponent: () => import('./admin.component').then((m) => m.AdminComponent) },
      {
        path: 'sources',
        title: 'Sources',
        loadComponent: () => import('./source-list.component').then((m) => m.SourceListComponent),
      },
      {
        path: 'sources/:id',
        title: SourceTitleResolverService,
        loadComponent: () => import('./source-edit.component').then((m) => m.SourceEditComponent),
      },
      {
        path: 'paths',
        title: 'Paths',
        loadComponent: () => import('./path-list.component').then((m) => m.PathListComponent),
      },
      {
        path: 'paths/:id',
        title: PathTitleResolverService,
        loadComponent: () => import('./path-edit.component').then((m) => m.PathEditComponent),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./user-list.component').then((m) => m.UserListComponent),
      },
      {
        path: 'users/:id',
        title: UserTitleResolverService,
        loadComponent: () => import('./user-edit.component').then((m) => m.UserEditComponent),
      },
    ],
    canActivate: [CanActivateAdmin],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AdminModule {}
