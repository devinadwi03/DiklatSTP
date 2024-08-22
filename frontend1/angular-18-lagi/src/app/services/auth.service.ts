import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, map, tap, filter, take } from 'rxjs/operators';
import { User } from '../pages/user-list/user-list.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // URL backend

  private isRefreshing = false; // Flag untuk menandakan status refresh token
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Untuk platform checking
  ) {}

  login(data: any): Observable<any> {
    const url = `${this.apiUrl}/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, data, { headers, withCredentials: true }).pipe(
      tap(() => {
        console.log('Login successful');
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(error); // Mengembalikan error untuk ditangani oleh subscriber
      })
    );
  }

  // Fungsi untuk logout
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true // Untuk menyertakan cookies
    }).pipe(
      tap(() => {
        alert('Logout Berhasil!');
        console.log('Logout successful');
      }),
      catchError(error => {
        const status = error.status || 0;
        console.error('Logout error:', error);
        // Arahkan ke halaman login jika terjadi kesalahan
        this.router.navigateByUrl('login').then(() => {
          // Tidak mengembalikan observable dari sini
        });
        // Kembalikan Observable dengan nilai default
        return of({ error: true, status });
      })
    );
  }

  // Refresh the access token by making a request to the refresh token endpoint
  refreshToken(): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
        switchMap((response) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken);
          return of(response.accessToken);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1)
      );
    }
  }

  // Register a new user
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user, {
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

  // Check if the user is logged in by checking the backend
  isLoggedIn(): Observable<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<{ authenticated: boolean }>(`${this.apiUrl}/check-auth`, { withCredentials: true }).pipe(
        tap(response => {
          console.log('check-auth response:', response); // Log respon dari backend
        }),
        map(response => response.authenticated), // Extract `authenticated` from the response
        catchError(((error: HttpErrorResponse) => {
          console.error('check-auth error:', error.status);
          console.error('check-auth full error:', error);
          // Penanganan untuk status selain 200
          if (error.status === 401) {
            console.warn('Unauthorized (401): Redirecting to login page');
            this.router.navigate(['/login']); // Redirect ke halaman login jika tidak terautentikasi
          } else if (error.status === 403) {
            console.warn('Forbidden (403): Redirecting to access denied page');
            this.router.navigate(['/access-denied']); // Redirect ke halaman akses ditolak jika tidak memiliki izin
          } else {
            console.error('Unexpected error:', error.message); // Log kesalahan tak terduga
            // Kamu bisa menambahkan penanganan error lain sesuai kebutuhan
          }
          return of(false); // Jika ada kesalahan, pengguna dianggap tidak terautentikasi
        }))
      )
    } else {
      // If not in browser, assume user is not authenticated
      return of(false);
    }
  }
  getUserRole(): Observable<string> {
    return this.http.get<{ role: string }>(`${this.apiUrl}/user-role`, { withCredentials: true })
      .pipe(
        map(response => response.role),
        catchError(error => {
          console.error('Error fetching user role:', error);
          return of(''); // Kembalikan nilai default jika ada error
        })
      );
  }

  getUserRegistrationStatus(): Observable<boolean> {
    const url = `${this.apiUrl}/check-registration-status`; // Sesuaikan endpoint
    return this.http.get<{ isRegistered: boolean }>(url, { withCredentials: true }).pipe(
      map(response => response.isRegistered)
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getUsers`, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching pendaftar:', error);
        return throwError(() => new Error(`Error: ${error.status} - ${error.message}`));
      })
    );
  }
}
