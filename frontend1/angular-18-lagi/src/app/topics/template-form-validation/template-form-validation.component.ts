import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';  // 1. Impor Router
import { DiklatService } from '../../services/diklat.service'; 

@Component({
  selector: 'app-template-form-validation',
  standalone: true,
  imports: [FormsModule, CommonModule, JsonPipe],
  templateUrl: './template-form-validation.component.html',
  styleUrls: ['./template-form-validation.component.css']
})
export class TemplateFormValidationComponent {

  isFormSubmited: boolean = false;
  jenisDiklatOptions: string[] = [
    'Mekanik Manufaktur',
    'Welding Manufaktur',
    'Desain Manufaktur',
    'Otomasi Manufaktur',
    'Underwater Wet Welding'
  ];

  userObj: any = {
    'nama': '',
    'tempat_lahir': '',
    'tanggal_lahir': '',
    'nik': '',
    'usia': '',
    'jenis_kelamin': '',
    'status': '',
    'alamat_rumah': '',
    'asal_sekolah_instansi': '',
    'no_wa_aktif': '',
    'no_telepon_orang_tua': '',
    'jalur_pendaftaran': '',
    'jalur_pendaftaran_lainnya': '',
    'jenis_diklat': [],
    'tau_diklat_dari': '',
    'tau_diklat_dari_lainnya': '',
    'isAgree': true,
  }

  jenisDiklatError: boolean = false;

  constructor(private diklatService: DiklatService, private router: Router) {}

  onJenisDiklatChange(event: any, jenis: string) {
    const checked = event.target.checked;

    if (checked) {
      // Tambah jenis diklat jika belum ada di array
      if (!this.userObj.jenis_diklat.includes(jenis)) {
        this.userObj.jenis_diklat.push(jenis);
      }
    } else {
      // Hapus jenis diklat dari array jika dicentang
      const index = this.userObj.jenis_diklat.indexOf(jenis);
      if (index > -1) {
        this.userObj.jenis_diklat.splice(index, 1);
      }
    }

    // Cek apakah ada jenis diklat yang dipilih
    this.jenisDiklatError = this.userObj.jenis_diklat.length === 0;
  }

  onSubmit(form: NgForm) {
    this.isFormSubmited = true;

    if (form.form.valid && this.userObj.jenis_diklat.length > 0) {
      this.diklatService.daftarDiklat(this.userObj).subscribe(
        response => {
          alert('Data berhasil disimpan!');
          this.router.navigate(['/user-data']); 
        },
        error => {
          alert('Terjadi kesalahan, harap coba lagi.');
          console.error('Error:', error);
        }
      );
    } else {
      alert('Data belum lengkap, harap isi semua field dengan benar.');
    }
  }
}