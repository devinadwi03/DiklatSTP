import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout-user',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout-user.component.html',
  styleUrls: ['./layout-user.component.css']
})
export class LayoutUserComponent implements OnInit {
  isLogin: boolean = true;
  isRegistered: boolean = false; // Status registrasi pengguna

  // Menggunakan inject untuk AuthService dan Router seperti di LayoutComponent
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {  // Tambahkan `: void` untuk tipe pengembalian
    this.checkRegistrationStatus(); // Memeriksa status registrasi saat komponen diinisialisasi
  }

  // Memeriksa status registrasi pengguna
  checkRegistrationStatus() {
    this.authService.getUserRegistrationStatus().subscribe({
      next: (status) => {
        this.isRegistered = status; // Set isRegistered berdasarkan status
      },
      error: (error) => {
        console.error('Error checking registration status:', error);
      }
    });
  }

  // Fungsi untuk navigasi ke halaman home
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  // Fungsi untuk navigasi ke halaman akun pengguna
  navigateToUserAccount() {
    this.router.navigate(['/user-account']);
  }

  // Fungsi untuk navigasi ke halaman registrasi
  navigateToRegister() {
    if (this.isRegistered) {
      this.router.navigate(['/user-data']);
    } else {
      this.router.navigate(['/templateFormValidation']);
    }
  }

  // Fungsi logout
  logout() {
    this.authService.logout().subscribe(
      () => {
        this.isLogin = false; // Mengubah status login
        this.router.navigateByUrl('login'); // Redirect ke halaman login
        console.log("User logged out");
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }
}
