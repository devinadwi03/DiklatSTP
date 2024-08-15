import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { LayoutComponent } from '../pages/layout/layout.component';
import { UserListComponent } from '../pages/user-list/user-list.component';

import { UserDataComponent } from '../pages/user-data/user-data.component';
import { TemplateFormValidationComponent } from '../topics/template-form-validation/template-form-validation.component';
import { RoleGuard } from './role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'user-list',
        component: UserListComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' } // Hanya admin yang bisa mengakses
      },
      {
        path: 'user-data',
        component: UserDataComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'user' } // Hanya user yang bisa mengakses
      },
      {
        path: 'templateFormValidation',
        component: TemplateFormValidationComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'user' } // Hanya admin yang bisa mengakses
      }
    ]
  }
];
