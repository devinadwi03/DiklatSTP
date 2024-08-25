import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Impor FormsModule di sini
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
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
  diklatOptions: string[] = [
    'Mekanik Manufaktur',
    'Welding Manufaktur',
    'Desain Manufaktur',
    'Otomasi Manufaktur',
    'Underwater Wet Welding'
  ]; // Daftar opsi jenis diklat

  constructor(
    private diklatService: DiklatService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) { }

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

  onJalurPendaftaranChange(): void {
    if (this.user && this.user.jalur_pendaftaran !== 'Other') {
      this.user.jalur_pendaftaran_lainnya = ''; // Reset field jika bukan "Lainnya"
    }
  }

  onTauDiklatDariChange(): void {
    if (this.user && this.user.tau_diklat_dari !== 'Lainnya') {
      this.user.tau_diklat_dari_lainnya = ''; // Reset field jika bukan "Lainnya"
    }
  }

  onDiklatChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (input.checked) {
      if (this.user && !this.user.jenis_diklat.includes(value)) {
        this.user.jenis_diklat.push(value);
      }
    } else {
      if (this.user) {
        const index = this.user.jenis_diklat.indexOf(value);
        if (index !== -1) {
          this.user.jenis_diklat.splice(index, 1);
        }
      }
    }
  }

  onSubmit(form: any): void {
    if (this.user && form.valid) {
      this.diklatService.updateDataDiklat(this.user).subscribe(
        response => {
          console.log('Data Diklat Berhasil Diperbarui', response);
          alert('Data Diklat Berhasil Diperbarui'); // Menampilkan alert setelah berhasil diperbarui
          location.reload(); // Mereload halaman setelah update berhasil
        },
        error => {
          console.error('Error updating profile:', error);
          alert('Terjadi kesalahan saat memperbarui data.');
        }
      );
    } else {
      alert('Form tidak valid. Periksa kembali data yang diisi.');
    }
  }

  cancelRegistration(): void {
    if (this.user) {
      const confirmation = confirm('Apakah Anda yakin ingin membatalkan pendaftaran?');
      if (confirmation) {
        this.diklatService.deleteDataDiklat(this.user.id).subscribe(
          response => {
            console.log('Pendaftaran berhasil dibatalkan:', response);
            alert('Pendaftaran berhasil dibatalkan.'); // Tampilkan pesan sukses
            this.user = null; // Reset data pengguna setelah pembatalan
            // Navigasi ke templateFormValidation setelah pembatalan
            this.router.navigate(['templateFormValidation']);
          },
          error => {
            console.error('Error cancelling registration:', error);
            alert('Terjadi kesalahan saat membatalkan pendaftaran.');
          }
        );
      }
    }
  }
  
}

