import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // URL backend

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Fungsi untuk login
  login(data: any): Observable<any> {
    const url = `${this.apiUrl}/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, data, { headers, withCredentials: true });
  }

  // Fungsi untuk logout
  logout(): Observable<any> {
    const url = `${this.apiUrl}/logout`;
    return this.http.post(url, {}, { withCredentials: true });
  }


  // Refresh the access token by making a request to the refresh token endpoint
  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
      tap(response => {
        if (response.accessToken) {
          console.log('Refresh token successful, new accessToken received:', response.accessToken);
          // Token is managed by the backend with HttpOnly cookie, no need to store it manually
        } else {
          console.warn('Refresh token successful, but no new accessToken received');
        }
      }),
      catchError(error => {
        console.error('Refresh token error:', error);
        return of(null); // Handle error appropriately
      })
    );
  }

  // Check if user is logged in based on the presence of the access token
  isLoggedIn(): boolean {
    // Since the cookie is HttpOnly, this check might be redundant.
    // You might want to add additional logic based on your application's needs.
    return true; // Placeholder for logic if needed
  }

  // Register a new user
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createUser`, user, {
      withCredentials: true
    }).pipe(
      tap(() => {
        console.log('Registration successful');
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return of(null); // Handle error appropriately
      })
    );
  }

  // Since the token is managed by the backend with HttpOnly cookie, this method might be redundant.
  private getCookie(name: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
    }
    return null;
  }
}
