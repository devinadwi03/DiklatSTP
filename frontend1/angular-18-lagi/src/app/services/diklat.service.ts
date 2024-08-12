import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiklatService {
  private apiUrl = 'http://localhost:5000'; // Sesuaikan dengan URL API Anda

  constructor(private http: HttpClient) {}

  // Fungsi untuk mengirim data diklat
  daftarDiklat(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/daftar-diklat`, data, {
      withCredentials: true // Jika Anda menggunakan cookies
    });
  }
}
