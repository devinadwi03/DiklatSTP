import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { isPlatformBrowser } from '@angular/common';
import { Workbook } from 'exceljs';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class AccountListComponent implements OnInit {
  users: User[] = [];
  private apiUrl = 'http://localhost:5000'; // URL backend

  constructor(private authService: AuthService, 
    private http: HttpClient, 
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object) {} // Inject AuthService

  ngOnInit(): void {
    this.authService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      console.log('Users loaded:', this.users);
    });
  }

  addAdmin() {
    this.router.navigate(['/add-admin']);
  }

  // Fungsi untuk menghapus pengguna
  deleteUser(id: number) {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      if (isPlatformBrowser(this.platformId)) {
        this.http.delete(`${this.apiUrl}/deleteUser/${id}`, { withCredentials: true })
          .subscribe(
            (response: any) => {
              alert(response.msg || 'Pengguna berhasil dihapus');
              // Refresh halaman untuk memperbarui tampilan
              window.location.reload(); 
            },
            (error) => {
              alert(error.error.msg || 'Terjadi kesalahan saat menghapus pengguna');
              console.error('Error saat menghapus pengguna:', error);
            }
          );
      }
    }
  }

  exportToExcel(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Data Akun');

    // Menentukan kolom header
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'First Name', key: 'first_name', width: 20 },
      { header: 'Last Name', key: 'last_name', width: 20 },
      { header: 'Role', key: 'role', width: 15 }
    ];

    // Menambahkan data pengguna ke worksheet
    this.users.forEach(user => {
      worksheet.addRow(user);
    });

    // Atur style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

    // Menambahkan data pengguna ke worksheet
    this.users.forEach(user => {
      worksheet.addRow(user);
    });

    // Atur wrap text, border, dan alignment untuk semua sel
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        // Untuk sel lainnya, Anda bisa menggunakan pengaturan default
        if (row.number === 1) {
          // Header: sudah diatur sebelumnya
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else {
          // Sel data: misalnya Anda tidak perlu menyesuaikan alignment khusus di sini
          cell.alignment = {
            wrapText: true,  // Mengatur wrap text pada sel data
            horizontal: 'left', // Atur sesuai kebutuhan Anda
            vertical: 'middle'
          };
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Simpan workbook ke buffer dan ekspor
    workbook.xlsx.writeBuffer().then(buffer => {
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '') + '_' + date.toTimeString().slice(0, 8).replace(/:/g, '');
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${formattedDate}_data-akun.xlsx`);
    });
  }
}
