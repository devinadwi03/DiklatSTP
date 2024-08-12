import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TemplateFormValidationComponent } from './topics/template-form-validation/template-form-validation.component';
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
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // Pastikan AuthGuard diterapkan di sini
    children: [
      {
        path: 'templateFormValidation',
        component: TemplateFormValidationComponent
      },
      {
        path: '**',
        redirectTo: 'dashboard' // Rute wildcard untuk menangani rute yang tidak ditemukan
      }
      // Tambahkan rute anak lainnya di sini
    ]
  }
];