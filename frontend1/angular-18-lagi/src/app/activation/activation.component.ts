import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  styleUrl: './activation.component.css',
  templateUrl: './activation.component.html' 
})
export class ActivationComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    this.activateAccount(token);
  }

  activateAccount(token: string | null): void {
    if (token) {
      this.http.post('your-backend-url/api/activate', { token: token })
        .subscribe(
          response => {
            // Handle sukses, mungkin redirect ke halaman login
          },
          error => {
            // Handle error, tampilkan pesan error
          }
        );
    }
  }
}
