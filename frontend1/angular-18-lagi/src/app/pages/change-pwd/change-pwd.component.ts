import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-pwd',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './change-pwd.component.html',
  styleUrl: './change-pwd.component.css'
})
export class ChangePwdComponent {
  isForgotPasswordView = true;
  isManualChangePasswordView = false;

  forgotPassword = {
    newPassword: '',
    confirmNewPassword: ''
  };

  manualChangePassword = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor() { }

  sendToken() {
    alert('Token sent for forgot password');
  }

  updatePassword() {
    if (this.manualChangePassword.newPassword !== this.manualChangePassword.confirmNewPassword) {
      alert('Password confirmation does not match');
      return;
    }
    
    if (!this.passwordPattern.test(this.manualChangePassword.newPassword)) {
      alert('Password does not meet the requirements');
      return;
    }

  
    alert('Password updated');
  }

  switchToManualChangePassword() {
    this.isForgotPasswordView = false;
    this.isManualChangePasswordView = true;
  }

  switchToForgotPassword() {
    this.isForgotPasswordView = true;
    this.isManualChangePasswordView = false;
  }
}