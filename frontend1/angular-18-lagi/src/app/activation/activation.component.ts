import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  styleUrls: ['./activation.component.css'],
  templateUrl: './activation.component.html'
})
export class ActivationComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000'; // URL backend

  activationMessage: string = ''; // Variable to store message

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.activateAccount(token);
    } else {
      this.activationMessage = 'Token tidak ditemukan.';
    }
  }

  activateAccount(token: string | null): void {
    if (token) {
      this.http.get(`${this.apiUrl}/activation/${token}`)
        .subscribe(
          response => {
            this.activationMessage = 'Akun Anda telah berhasil diaktifkan!';
          },
          error => {
            this.activationMessage = 'Gagal mengaktifkan akun. Token mungkin tidak valid atau sudah kadaluwarsa.';
            console.error('Gagal mengaktifkan akun', error);
          }
        );
    } else {
      this.activationMessage = 'Token tidak ditemukan.';
    }
  }

  resendVerificationEmail(): void {
    // Logic to resend verification email
    const email = prompt('Masukkan email Anda untuk mengirim ulang verifikasi:');
    if (email) {
      this.http.post(`${this.apiUrl}/resend-verification-email`, { email })
        .subscribe(
          response => {
            this.activationMessage = 'Email verifikasi telah dikirim ulang. Silakan periksa email Anda.';
          },
          error => {
            this.activationMessage = 'Gagal mengirim ulang email verifikasi. Pastikan email yang Anda masukkan benar.';
            console.error('Gagal mengirim ulang email verifikasi', error);
          }
        );
    }
  }
}
