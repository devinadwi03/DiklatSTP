import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // Adjust this URL as needed

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.accessToken) {
          console.log('Login successful, accessToken received:', response.accessToken); // Debugging
          // Handle token storage or other login-related logic
        } else {
          console.warn('Login successful, but no accessToken received'); // Debugging
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        console.log('Logout successful'); // Debugging
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
      tap(response => {
        if (response.accessToken) {
          console.log('Refresh token successful, new accessToken received:', response.accessToken); // Debugging
          // Update token storage with the new access token
        } else {
          console.warn('Refresh token successful, but no new accessToken received'); // Debugging
        }
      })
    );
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.getCookie('accessToken');
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const loggedIn = !!token;
    console.log('User is', loggedIn ? 'logged in' : 'not logged in'); // Debugging
    return loggedIn;
  }  

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createUser`, user, {
      withCredentials: true
    }).pipe(
      tap(() => {
        console.log('Registration successful'); // Debugging
      })
    );
  }

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
