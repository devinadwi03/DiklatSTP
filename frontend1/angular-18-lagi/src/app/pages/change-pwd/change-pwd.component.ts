import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';  // Import Router
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.css']
})
export class ChangePwdComponent {
  manualChangePassword = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService  // Injeksikan AuthService
  ) { }

  updatePassword() {
    this.http.put('/update-password', {
      currentPassword: this.manualChangePassword.oldPassword,
      newPassword: this.manualChangePassword.newPassword,
      confNewPassword: this.manualChangePassword.confirmNewPassword
    }).subscribe(
      (response: any) => {
        alert(response.msg || 'Password berhasil diperbarui');
        this.redirectBasedOnRole();
      },
      (error) => {
        alert(error.error.msg || 'Terjadi kesalahan saat memperbarui password');
        window.location.reload();  // Refresh halaman jika terjadi error
      }
    );
  }

  // Metode untuk redirect berdasarkan role pengguna
  redirectBasedOnRole() {
    this.authService.getUserRole().subscribe(role => {
      if (role === 'admin') {
        this.router.navigate(['/user-account-admin']); // Navigasi untuk admin
      } else {
        this.router.navigate(['/user-account']); // Navigasi untuk user
      }
    });
  }

  // Metode untuk navigasi ke halaman user-account
  navigateToUserAccount() {
    this.redirectBasedOnRole();
  }
}



