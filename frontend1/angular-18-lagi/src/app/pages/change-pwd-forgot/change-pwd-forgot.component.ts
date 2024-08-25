import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';  // Impor Router
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password-forgot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],  // Tambahkan FormsModule di sini
  styleUrls: ['./change-pwd-forgot.component.css'],
  templateUrl: './change-pwd-forgot.component.html'
})
export class ChangePwdForgotComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000'; // URL backend

  forgotPassword = {
    newPassword: '',
    confirmNewPassword: ''
  };
  token: string | null = null;
  resetMessage: string = ''; // Variable to store message

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  ngOnInit(): void {
    // Mengambil token dari parameter rute
    this.token = this.route.snapshot.paramMap.get('token');
  }

  resetPass(): void {
    if (this.token) {
      if (!this.passwordPattern.test(this.forgotPassword.newPassword)) {
        this.resetMessage = 'Password harus memiliki setidaknya 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 simbol.';
        alert(this.resetMessage);
        return;
      }
      if (this.forgotPassword.newPassword !== this.forgotPassword.confirmNewPassword) {
        this.resetMessage = 'Password konfirmasi tidak cocok.';
        alert(this.resetMessage);
        return;
      }

      this.http.post(`${this.apiUrl}/reset-password/${this.token}`, {
        newPassword: this.forgotPassword.newPassword,
        confNewPassword: this.forgotPassword.confirmNewPassword
      }).subscribe(
        (response: any) => {
          this.resetMessage = response.msg || 'Password berhasil diperbarui';
          alert(this.resetMessage); // Menampilkan alert jika berhasil
          window.location.href = `${this.apiUrl}/login`; // Navigasi ke halaman login jika berhasil
        },
        (error) => {
          this.resetMessage = error.error.msg || 'Terjadi kesalahan saat memperbarui password';
          alert(this.resetMessage); // Menampilkan alert jika gagal
          console.error('Error saat memperbarui password', error);
          window.location.reload(); // Refresh halaman jika terjadi kesalahan
        }
      );
    } else {
      this.resetMessage = 'Token tidak ditemukan';
      alert(this.resetMessage); // Menampilkan alert jika token tidak ditemukan
    }
  }
}
