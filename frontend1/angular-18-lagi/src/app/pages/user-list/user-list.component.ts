import { Component, OnInit } from '@angular/core';
//import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Pastikan ini ditambahkan
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Interface untuk mendefinisikan struktur User
interface User {
  id: number;
  emailId: string;
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
  jenis_diklat: string;
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

  constructor() {}

  ngOnInit(): void {
    //this.userService.getUsers().subscribe((data: User[]) => {
      //this.users = data;
      //console.log('Users loaded:', this.users); // Menampilkan data di konsol
    //});
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
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'user_data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
