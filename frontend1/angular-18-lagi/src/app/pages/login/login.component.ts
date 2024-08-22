import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Import service yang dibuat

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginView = true;

  router = inject(Router);
  authService = inject(AuthService); // Injeksi AuthService

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      confPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    }, { validators: this.passwordMatchValidator }); // Apply custom validator
  }

  userRegisterObj: any = {
    username: '',
    password: '',
    confPassword:'',
    email: '',
    first_name: '',
    last_name: '',
  }

  userLogin: any = {
    identifier: '',
    password: '',
  }

  // Regex untuk validasi password
  passwordPattern: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;

  // Validator function as a class method
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confPassword = formGroup.get('confPassword')?.value;
    return password === confPassword ? null : { passwordMismatch: true };
  }

  onRegister() {
    if (this.registerForm.valid) {
      // Check if the form has password mismatch error
      this.authService.register(this.registerForm.value).subscribe(
        response => {
          alert('Pendaftaran sukses! Silakan cek email untuk Verifikasi!');
          this.router.navigateByUrl('login').then(() => {
            window.location.reload(); // Refresh halaman setelah navigasi
          });
        },
        error => {
          alert('Pendaftaran gagal.');
          console.error(error);
        }
      );
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          if (response) { // Pastikan response tidak null
            alert('Login Berhasil!');
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'templateFormValidation';
            this.router.navigateByUrl(returnUrl);
          } else {
            alert('Username atau password salah');
          }
        },
        error => {
          alert('Username atau password salah');
          console.error('Login error:', error); // Log detail kesalahan
        }
      );
    }
  }
}
