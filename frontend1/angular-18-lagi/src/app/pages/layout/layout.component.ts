import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isLogin = true; // Contoh status login

  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout().subscribe(
      () => {
        this.isLogin = false; // Mengubah status login
        
        // Redirect ke halaman login
        this.router.navigateByUrl('login');
        // Logika lain yang diperlukan untuk logout, seperti menghapus token dari cookie, dll.
        console.log("User logged out");
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }
}
