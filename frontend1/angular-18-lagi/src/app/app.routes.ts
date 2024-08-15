import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TemplateFormValidationComponent } from './topics/template-form-validation/template-form-validation.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDataComponent } from './pages/user-data/user-data.component';
import { AccountListComponent } from './pages/account-list/account-list.component';
//import { UserAccountComponent } from './pages/user-account/user-account.component';
import { ActivationComponent } from './activation/activation.component';
import { AuthGuard } from './guards/auth.guards'; // Sesuaikan path sesuai kebutuhan

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { 
    path: 'register',
    component: LoginComponent 
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // Pastikan AuthGuard diterapkan di sini
    children: [
      {
        path: 'templateFormValidation',
        component: TemplateFormValidationComponent
      },
      {
        path: 'user-list',
        component: UserListComponent,
      },
      {
        path: 'user-data',
        component: UserDataComponent
      },
      {
        path: 'account-list',
        component: AccountListComponent,
      },
      //{
        //path: 'user-account',
        //component: UserAccountComponent
      //},
      {
        path: '**',
        redirectTo: 'dashboard' // Rute wildcard untuk menangani rute yang tidak ditemukan
      }
      // Tambahkan rute anak lainnya di sini
    ]
  },
  {
    path: 'activation/:token',
    component: ActivationComponent
  }
];