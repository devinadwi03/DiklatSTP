import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AuthService } from '../../services/auth.service'; // Import UserService

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
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private AuthService: AuthService) {} // Inject UserService

  ngOnInit(): void {
    this.AuthService.getUsers().subscribe((data: User[]) => {
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
