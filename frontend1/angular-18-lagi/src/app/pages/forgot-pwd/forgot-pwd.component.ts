import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-pwd',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-pwd.component.html',
  styleUrl: './forgot-pwd.component.css'
})
export class ForgotPwdComponent {

  forgotPwd : any = {
    email: '',
  }

  //   onSubmit() {
  //   // Cek apakah email ada di daftar Emails (simulasi pengecekan di database)
  //   const emailFound = this.existingEmails.includes(this.forgotPwd.email);

  //   if (emailFound) {
  //     alert(`Email telah dikirim ke ${this.forgotPwd.email}`);
  //   } else {
  //     alert(`Email ${this.forgotPwd.email} tidak ditemukan`);
  //   }
  // }
}
