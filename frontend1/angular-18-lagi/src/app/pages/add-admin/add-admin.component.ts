import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private apiUrl = 'http://localhost:5000'; // URL backend

  adminForm: FormGroup = this.fb.group({});  // Initialize the FormGroup to avoid errors
  passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/; // Aturan password

  ngOnInit() {
    // Initialize form in ngOnInit
    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confPassword: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // Validator untuk memastikan password dan konfirmasi password cocok
  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confPassword')?.value ? null : { 'passwordMismatch': true };
  }

  navigateToAccountList() {
    this.router.navigate(['/account-list']);
  }

  addAdmin() {
    if (this.adminForm.invalid) {
      alert('Form tidak valid. Mohon periksa kembali.');
      return;
    }

    this.http.post(`${this.apiUrl}/addAdmin`, this.adminForm.value).subscribe(
      (response: any) => {
        alert(response.msg || 'Admin berhasil ditambahkan, cek email terdaftar untuk verifikasi');
        this.router.navigate(['/account-list']); // Arahkan ke halaman daftar admin atau halaman lain yang relevan
      },
      (error) => {
        alert(error.error.msg || 'Terjadi kesalahan saat menambahkan admin');
        console.error('Error saat menambahkan admin', error);
      }
    );
  }
}
