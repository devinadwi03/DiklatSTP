import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../pages/user-list/user-list.component'; // Sesuaikan dengan path yang benar
import { User1 } from '../pages/user-data/user-data.component'; // Sesuaikan dengan path yang benar

@Injectable({
  providedIn: 'root'
})
export class DiklatService {
  private apiUrl = 'http://localhost:5000'; // Sesuaikan dengan URL API Anda

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Fungsi untuk mengirim data diklat
  daftarDiklat(data: any): Observable<any> {
    console.log('Mengirim data diklat:', data); // Logging data yang dikirim

    return this.http.post<any>(`${this.apiUrl}/daftar-diklat`, data, {
      withCredentials: true // Jika Anda menggunakan cookies
    }).pipe(
      tap(response => {
        console.log('Daftar Diklat Sukses:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Daftar Diklat error:', error);
        // Mengembalikan observable error untuk ditangani di komponen
        return throwError(() => new Error(`Error: ${error.status} - ${error.message}`));
      })
    );
  }

  getPendaftar(): Observable<User[]> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<User[]>(`${this.apiUrl}/loadAll-daftar-diklat`, {
        withCredentials: true
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching pendaftar:', error);
          return throwError(() => new Error(`Error: ${error.status} - ${error.message}`));
        })
      );
    } else {
      // Jika tidak di browser, kembalikan array kosong atau error
      return of([]);
    }
  }
  
  getUserData(): Observable<User1 | null> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<User1>(`${this.apiUrl}/load-daftar-diklat`, {
        withCredentials: true
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching user data:', error);
          return throwError(() => new Error(`Error: ${error.status} - ${error.message}`));
        })
      );
    } else {
      return of(null);
    }
  }

  updateDataDiklat(user: User1): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-daftar-diklat`, user, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating user data:', error);
        return throwError(() => new Error(`Error: ${error.status} - ${error.message}`));
      })
    );
  }
  
  
  
}
