import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  username = ''; // Inisialisasi username sebagai string kosong
  isRegistered = false;

  constructor(private router: Router, private authService: AuthService) {
    this.loadUserData(); // Panggil fungsi untuk memuat data user saat komponen diinisialisasi
    this.checkRegistrationStatus(); // Panggil fungsi untuk cek status registrasi
  }

  loadUserData() {
    this.authService.getUserById().subscribe({
      next: (user) => {
        this.username = user.username; // Ambil username dari respons
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  checkRegistrationStatus() {
    this.authService.getUserRegistrationStatus().subscribe({
      next: (status) => {
        this.isRegistered = status;
      },
      error: (error) => {
        console.error('Error checking registration status:', error);
      }
    });
  }

  navigateBasedOnRegistration() {
    if (this.isRegistered) {
      this.router.navigate(['/user-data']);
    } else {
      this.router.navigate(['/templateFormValidation']);
    }
  }
}
