import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiklatService {
  private apiUrl = 'http://localhost:5000'; // Sesuaikan dengan URL API Anda

  constructor(private http: HttpClient) {}

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
}
