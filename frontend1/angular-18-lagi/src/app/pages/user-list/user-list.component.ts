import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { DiklatService } from '../../services/diklat.service';
import { Workbook } from 'exceljs';

// Interface untuk mendefinisikan struktur User
export interface User {
  id: number;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  nik: string;
  usia: string;
  jenis_kelamin: string;
  status: string;
  alamat_rumah: string;
  asal_sekolah_instansi: string;
  no_wa_aktif: string;
  no_telpon_orang_tua: string;
  jalur_pendaftaran: string;
  jalur_pendaftaran_lainnya: string;
  jenis_diklat: string[]; // Sesuaikan jika bentuknya array
  tau_diklat_dari: string;
  tau_diklat_dari_lainnya: string;
  level: number;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private diklatService: DiklatService) {}

  ngOnInit(): void {
    this.diklatService.getPendaftar().subscribe((data: User[]) => {
      this.users = data;
      console.log('Users loaded:', this.users);
    });
  }

  addUser() {
    // Implementasi untuk menambah pengguna
  }

  editUser(userId: number) {
    // Implementasi untuk mengedit pengguna
  }

  deleteUser(userId: number) {
    // Implementasi untuk menghapus pengguna
  }

  exportToExcel(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Data Pendaftar Diklat');

    // Tambahkan header dengan format yang lebih baik
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nama', key: 'nama', width: 30 },
      { header: 'Tempat Lahir', key: 'tempat_lahir', width: 20 },
      { header: 'Tanggal Lahir', key: 'tanggal_lahir', width: 20 },
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'Usia', key: 'usia', width: 10 },
      { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Alamat Rumah', key: 'alamat_rumah', width: 30 },
      { header: 'Asal Sekolah Instansi', key: 'asal_sekolah_instansi', width: 30 },
      { header: 'No WA Aktif', key: 'no_wa_aktif', width: 15 },
      { header: 'No Telpon Orang Tua', key: 'no_telpon_orang_tua', width: 20 },
      { header: 'Jalur Pendaftaran', key: 'jalur_pendaftaran', width: 20 },
      { header: 'Jalur Pendaftaran Lainnya', key: 'jalur_pendaftaran_lainnya', width: 30 },
      { header: 'Jenis Diklat', key: 'jenis_diklat', width: 30 },
      { header: 'Tau Diklat Dari', key: 'tau_diklat_dari', width: 20 },
      { header: 'Tau Diklat Dari Lainnya', key: 'tau_diklat_dari_lainnya', width: 30 },
    ];

    // Atur style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

    // Tambahkan data pengguna ke worksheet
    this.users.forEach(user => {
      worksheet.addRow({
        ...user,
        jenis_diklat: user.jenis_diklat.join(', ') // Konversi array ke string dengan pemisah koma
      });
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

    // Ekspor workbook ke buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '') + '_' + date.toTimeString().slice(0, 8).replace(/:/g, '');
      saveAs(blob, `${formattedDate}_data-pendaftar-diklat.xlsx`);
    });
  }
}
