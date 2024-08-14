import { Op } from 'sequelize';
import DaftarDiklat from '../models/DaftarDiklatModel.js';
import User from "../models/UserModel.js";
import { dataValid } from "../validation/dataValidation.js";
import { createDiklatPDF } from '../services/pdfService.js';
import { uploadToGoogleDrive, deleteFileFromGoogleDrive } from '../services/googleDriveService.js';

export const getPendaftar = async (req, res) => {
    try {
        const response = await DaftarDiklat.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.error(`Error fetching pendaftar: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const getPendaftarById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const response = await DaftarDiklat.findOne({
            where: {
                id: userId
            }
        });
        if (!response) {
            return res.status(404).json({ msg: "Pendaftar tidak ditemukan atau Anda tidak memiliki akses" });
        }
        res.status(200).json(response);
    } catch (error) {
        console.error(`Error fetching pendaftar by ID: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const validationRules = {
    nama: "required",
    tempat_lahir: "required",
    tanggal_lahir: "required",
    nik: "required",
    usia: "required",
    jenis_kelamin: "required",
    status: "required",
    alamat_rumah: "required",
    asal_sekolah_instansi: "required",
    no_wa_aktif: "required",
    no_telepon_orang_tua: "required",
    jalur_pendaftaran: "required",
    jenis_diklat: "required",
    tau_diklat_dari: "required"
};

export const createRegistrasi = async (req, res) => {
    const {
        nama, tempat_lahir, tanggal_lahir, nik, usia, jenis_kelamin,
        status, alamat_rumah, asal_sekolah_instansi, no_wa_aktif,
        no_telepon_orang_tua, jalur_pendaftaran, jalur_pendaftaran_lainnya,
        jenis_diklat, tau_diklat_dari, tau_diklat_dari_lainnya
    } = req.body;

    // Validasi data
    const { message, data } = await dataValid(validationRules, req.body);

    if (message.length > 0) {
        return res.status(400).json({ errors: message });
    }

    try {
        // Convert id_user and usia to integer if provided
        const idUserInt = parseInt(data.id_user, 10);
        const usiaInt = parseInt(data.usia, 10);

        // Convert jenis_diklat to array if needed
        const jenis_diklatArray = Array.isArray(data.jenis_diklat) ? data.jenis_diklat : data.jenis_diklat.split(',');

        // Convert tanggal_lahir to Date object and format to YYYY-MM-DD
        const tanggalLahirDate = new Date(data.tanggal_lahir.split('T')[0]);
        const formattedTanggalLahir = tanggalLahirDate.toISOString().split('T')[0];

        // Prepare data for registration
        const registrationData = {
            id: req.user.userId,
            id_user: req.user.userId,
            nama: data.nama,
            tempat_lahir: data.tempat_lahir,
            tanggal_lahir: formattedTanggalLahir,
            nik: data.nik,
            usia: usiaInt,
            jenis_kelamin: data.jenis_kelamin,
            status: data.status,
            alamat_rumah: data.alamat_rumah,
            asal_sekolah_instansi: data.asal_sekolah_instansi,
            no_wa_aktif: data.no_wa_aktif,
            no_telepon_orang_tua: data.no_telepon_orang_tua,
            jalur_pendaftaran: data.jalur_pendaftaran,
            jalur_pendaftaran_lainnya: data.jalur_pendaftaran_lainnya || null,
            jenis_diklat: jenis_diklatArray,
            tau_diklat_dari: data.tau_diklat_dari,
            tau_diklat_dari_lainnya: data.tau_diklat_dari_lainnya || null
        };

        console.log("Registration Data:", registrationData);

        // Create new registration record
        const newRegistration = await DaftarDiklat.create(registrationData);

        // Create a PDF for the new registration
        const pdfBytes = await createDiklatPDF(registrationData);
        const fileName = `${registrationData.nama}_Diklat_Registration.pdf`;
        const fileId = await uploadToGoogleDrive(pdfBytes, fileName);

        // Update the registration record with the fileId
        await DaftarDiklat.update({ fileId }, { where: { id: newRegistration.id } });

        res.status(201).json({ msg: "Registrasi berhasil dibuat!" });
    } catch (error) {
        console.error(`Error creating registration: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const updateRegistrasi = async (req, res) => {
    const { id } = req.user.userId;
    const {
        nama, tempat_lahir, tanggal_lahir, nik, usia, jenis_kelamin,
        status, alamat_rumah, asal_sekolah_instansi, no_wa_aktif,
        no_telepon_orang_tua, jalur_pendaftaran, jalur_pendaftaran_lainnya,
        jenis_diklat, tau_diklat_dari, tau_diklat_dari_lainnya
    } = req.body;

    // Validasi data
    const { message, data } = await dataValid(validationRules, req.body);

    if (message.length > 0) {
        return res.status(400).json({ errors: message });
    }

    console.log("Validated Data:", data);

    try {
        // Convert usia to integer if provided
        const usiaInt = parseInt(data.usia, 10);

        // Convert jenis_diklat to array if needed
        const jenis_diklatArray = Array.isArray(data.jenis_diklat) ? data.jenis_diklat : data.jenis_diklat.split(',');

        // Convert tanggal_lahir to Date object and format to YYYY-MM-DD
        const tanggalLahirDate = new Date(data.tanggal_lahir.split('T')[0]);
        const formattedTanggalLahir = tanggalLahirDate.toISOString().split('T')[0];

        // Prepare update data
        const updateData = {
            nama: data.nama,
            tempat_lahir: data.tempat_lahir,
            tanggal_lahir: formattedTanggalLahir,
            nik: data.nik,
            usia: usiaInt,
            jenis_kelamin: data.jenis_kelamin,
            status: data.status,
            alamat_rumah: data.alamat_rumah,
            asal_sekolah_instansi: data.asal_sekolah_instansi,
            no_wa_aktif: data.no_wa_aktif,
            no_telepon_orang_tua: data.no_telepon_orang_tua,
            jalur_pendaftaran: data.jalur_pendaftaran,
            jalur_pendaftaran_lainnya: data.jalur_pendaftaran_lainnya || null,
            jenis_diklat: jenis_diklatArray,
            tau_diklat_dari: data.tau_diklat_dari,
            tau_diklat_dari_lainnya: data.tau_diklat_dari_lainnya || null
        };

        console.log("Update Data:", updateData);

        // Remove undefined properties
        for (const key in updateData) {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        }

        // Find existing registration to get the current fileId and current nik
        const existingRegistration = await DaftarDiklat.findOne({ where: { id_user: req.user.userId } });

        if (!existingRegistration) {
            return res.status(404).json({ msg: "Data Pendaftaran tidak ditemukan atau Anda tidak memiliki akses" });
        }

        // Update the record
        const [updated] = await DaftarDiklat.update(updateData, {
            where: { 
                id,
                id_user: req.user.userId 
            }
        });

        if (updated === 0) {
            return res.status(404).json({ msg: "Data Pendaftaran tidak ditemukan atau Anda tidak memiliki akses" });
        }

        // Delete the old PDF file from Google Drive if it exists
        if (existingRegistration.fileId) {
            await deleteFileFromGoogleDrive(existingRegistration.fileId);
        }

        // Create a new PDF and upload it
        const pdfBytes = await createDiklatPDF(updateData);
        const fileName = `${updateData.nama}_Diklat_Registration.pdf`;
        const newFileId = await uploadToGoogleDrive(pdfBytes, fileName);

        // Update the fileId in the registration record
        await DaftarDiklat.update({ fileId: newFileId }, { where: { id, id_user: req.user.userId } });

        res.status(200).json({ msg: "Data Pendaftaran berhasil diubah!" });
    } catch (error) {
        console.error(`Error updating data: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const deleteRegistrasi = async (req, res) => {
    try {
        const deleted = await DaftarDiklat.destroy({
            where: {
                id: req.params.id,
                id_user: req.user.userId
            }
        });
        if (deleted === 0) {
            console.error("Registrasi tidak ditemukan");
            return res.status(404).json({ msg: "Registrasi tidak ditemukan" });
        }
        res.status(200).json({ msg: "Registrasi dibatalkan" });
    } catch (error) {
        console.error(`Error deleting registrasi: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
