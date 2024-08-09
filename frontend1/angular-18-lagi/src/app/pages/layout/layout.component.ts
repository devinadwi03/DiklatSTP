import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'] // Perbaiki 'styleUrl' menjadi 'styleUrls'
})
export class LayoutComponent {
  title = 'angular-18-lagi';
  isLogin = true; // Contoh status login
  isAdmin = false; // Contoh status admin

  // Tambahkan metode logout
  logout() {
    this.isLogin = false; // Mengubah status login
    // Logika lain yang diperlukan untuk logout, seperti menghapus token, dll.
    console.log("User logged out");
  }
}