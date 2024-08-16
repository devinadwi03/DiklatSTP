import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Impor FormsModule di sini
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { DiklatService } from '../../services/diklat.service'; // Sesuaikan dengan path yang benar

export interface User1 {
  id: number;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  nik: string;
  usia: number;
  jenis_kelamin: string;
  status: string;
  alamat_rumah: string;
  asal_sekolah_instansi: string;
  no_wa_aktif: string;
  no_telepon_orang_tua: string;
  jalur_pendaftaran: string;
  jalur_pendaftaran_lainnya: string | null;
  jenis_diklat: string[];
  tau_diklat_dari: string;
  tau_diklat_dari_lainnya: string | null;
  fileId: string;
}

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @Input() user: User1 | null = null; // Menerima data pengguna dari komponen lain

  constructor(
    private diklatService: DiklatService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.diklatService.getUserData().subscribe(
        (data: User1 | null) => {
          this.user = data;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }
}

  