import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TemplateFormValidationComponent } from './topics/template-form-validation/template-form-validation.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDataComponent } from './pages/user-data/user-data.component';
import { AccountListComponent } from './pages/account-list/account-list.component';
import { UserAccountComponent } from './pages/user-account/user-account.component';
import { ChangePwdComponent } from './pages/change-pwd/change-pwd.component';
import { ForgotPwdComponent } from './pages/forgot-pwd/forgot-pwd.component';
import { ChangePwdForgotComponent } from './pages/change-pwd-forgot/change-pwd-forgot.component';
import { ActivationComponent } from './activation/activation.component';
import { AuthGuard } from './guards/auth.guards'; // Sesuaikan path sesuai kebutuhan
import { RoleGuard } from './guards/role.guard';
import { RegistrationGuard } from './guards/registration.guard';
import { AddAdminComponent } from './pages/add-admin/add-admin.component';
import { MenuComponent } from './pages/menu/menu.component';
import { LayoutUserComponent } from './pages/layout-user/layout-user.component';

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
    component: LoginComponent,
  },
  {
    path: 'activation/:token',
    component: ActivationComponent
  },
  {
    path: 'forgot-pwd',
    component: ForgotPwdComponent
  },
  {
    path: 'reset-password/:token',
    component: ChangePwdForgotComponent
  },
  
 // Layout Admin
 {
  path: 'admin', // Path baru untuk layout admin
  component: LayoutComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { expectedRole: 'admin' },
  children: [
    { path: 'user-list', component: UserListComponent },
    { path: 'account-list', component: AccountListComponent },
    { path: 'add-admin', component: AddAdminComponent },
    { path: 'user-account-admin', component: UserAccountComponent },
    { path: 'change-pwd-admin', component: ChangePwdComponent },
    { path: '**', redirectTo: 'account-list' }
  ]
},
// Alias rute untuk rute lama
{
  path: 'user-list',
  redirectTo: 'admin/user-list',
  pathMatch: 'full'
},
{
  path: 'account-list',
  redirectTo: 'admin/account-list',
  pathMatch: 'full'
},
{
  path: 'add-admin',
  redirectTo: 'admin/add-admin',
  pathMatch: 'full'
},
{
  path: 'user-account-admin',
  redirectTo: 'admin/user-account-admin',
  pathMatch: 'full'
},
{
  path: 'change-pwd-admin',
  redirectTo: 'admin/change-pwd-admin',
  pathMatch: 'full'
},
// Layout User
{
  path: 'user', // Path baru untuk layout user
  component: LayoutUserComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { expectedRole: 'user' },
  children: [
    { path: 'templateFormValidation', component: TemplateFormValidationComponent, canActivate: [RegistrationGuard] },
    { path: 'user-data', component: UserDataComponent, canActivate: [RegistrationGuard] },
    { path: 'user-account', component: UserAccountComponent },
    { path: 'change-pwd', component: ChangePwdComponent },
    { path: 'home', component: MenuComponent },
    { path: '**', redirectTo: 'home' }
  ]
},
// Alias rute untuk rute lama
{
  path: 'templateFormValidation',
  redirectTo: 'user/templateFormValidation',
  pathMatch: 'full'
},
{
  path: 'user-data',
  redirectTo: 'user/user-data',
  pathMatch: 'full'
},
{
  path: 'user-account',
  redirectTo: 'user/user-account',
  pathMatch: 'full'
},
{
  path: 'change-pwd',
  redirectTo: 'user/change-pwd',
  pathMatch: 'full'
},
{
  path: 'home',
  redirectTo: 'user/home',
  pathMatch: 'full'
}
];
