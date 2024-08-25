import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router'; // Tambahkan import Router dan RouterModule

@Component({
  selector: 'app-forgot-pwd',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule], // Tambahkan RouterModule di sini
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPwdComponent {
  forgotPwd: any = {
    email: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    // Lakukan request ke backend untuk reset password
    this.http.post('/forgot-password', { email: this.forgotPwd.email })
      .subscribe(
        (response: any) => {
          alert(`Email reset password berhasil dikirim ke ${this.forgotPwd.email}`);
          this.router.navigate(['/login']); // Navigasi ke halaman login jika berhasil
        },
        (error) => {
          alert(`Terjadi kesalahan: ${error.error.msg || 'Kesalahan tidak diketahui'}`);
          window.location.reload(); // Refresh halaman jika gagal
        }
      );
  }
}
