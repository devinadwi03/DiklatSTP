import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // Sesuaikan dengan URL API Anda

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true // Untuk menyertakan cookies
    });
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true // Untuk menyertakan cookies
    });
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true });
  }

  getToken(): string | null {
    return localStorage.getItem('authToken'); // Jika menggunakan token dari localStorage
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null; // Sesuaikan dengan logika Anda
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createUser`, user, {
      withCredentials: true // Untuk menyertakan cookies jika perlu
    });
  }
}
