import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  username = 'Nama User'; 
  isRegistered = false; 

  constructor(private router: Router) {
    //fetch data dari API untuk cek apakah user sudah register
    this.checkRegistrationStatus();
  }

  checkRegistrationStatus() {
    //cek status registrasi
    this.isRegistered = true; //  jika user sudah register
  }

  navigateBasedOnRegistration() {
    if (this.isRegistered) {
      this.router.navigate(['/user-data']);
    } else {
      this.router.navigate(['/templateFormValidation']);
    }
  }
}