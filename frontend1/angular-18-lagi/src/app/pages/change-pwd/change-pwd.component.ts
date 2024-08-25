import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';  // Import Router
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient, private router: Router) { }  // Inject Router

  updatePassword() {
    this.http.put('/update-password', {
      currentPassword: this.manualChangePassword.oldPassword,
      newPassword: this.manualChangePassword.newPassword,
      confNewPassword: this.manualChangePassword.confirmNewPassword
    }).subscribe(
      (response: any) => {
        alert(response.msg || 'Password berhasil diperbarui');
        this.router.navigate(['/user-account']);  // Navigasi ke halaman user-account
      },
      (error) => {
        alert(error.error.msg || 'Terjadi kesalahan saat memperbarui password');
        window.location.reload();  // Refresh halaman jika terjadi error
      }
    );
  }

  // Metode untuk navigasi ke halaman user-account
  navigateToUserAccount() {
    this.router.navigate(['/user-account']);
  }
}
