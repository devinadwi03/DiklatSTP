import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Impor AuthService
import { Router } from '@angular/router'; // Impor Router untuk navigasi

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  userdata: any = {
    id: '',
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  };

  isEditing: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUserById().subscribe(
      (data) => {
        this.userdata = data;
      },
      (error) => {
        console.error('Error fetching user data:', error);
        // Arahkan ke halaman login jika gagal mendapatkan data pengguna
        this.router.navigateByUrl('/login');
      }
    );
  }

  enableEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    // Tidak perlu mengambil data dari localStorage, data akan tetap di state
  }

  onUpdate() {
    this.authService.updateUser(this.userdata).subscribe(
      (response) => {
        this.isEditing = false;
        alert('Data berhasil diupdate!');
      },
      (error) => {
        console.error('Error updating user data:', error);
        alert('Gagal memperbarui data pengguna. Silakan coba lagi.');
      }
    );
  }
}
