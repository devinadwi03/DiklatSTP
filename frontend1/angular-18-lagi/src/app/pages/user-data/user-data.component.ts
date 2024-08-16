import { Component, Input, OnInit } from '@angular/core';
import { DiklatService } from '../../services/diklat.service'; // Sesuaikan dengan path yang benar

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @Input() user: User1 | null = null; // Menerima data pengguna dari komponen lain

  constructor(private diklatService: DiklatService) {
  }

  ngOnInit(): void {
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

// Sesuaikan path dan lokasi file model sesuai struktur proyekmu
export interface User1 {
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
  jenis_diklat: string;
  tau_diklat_dari: string;
  tau_diklat_dari_lainnya: string;
}