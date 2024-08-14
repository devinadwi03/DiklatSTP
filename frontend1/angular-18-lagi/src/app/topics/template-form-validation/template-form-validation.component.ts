import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
    'jenis_diklat': '',
    'tau_diklat_dari': '',
    'tau_diklat_dari_lainnya': '',
    'isAgree': true,
  }

  constructor(private diklatService: DiklatService) {}

  onSubmit(form: NgForm) {
    this.isFormSubmited = true;

    if (form.form.valid) {
      this.diklatService.daftarDiklat(this.userObj).subscribe(
        response => {
          alert('Data berhasil disimpan!');
          // Lakukan tindakan tambahan jika diperlukan
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