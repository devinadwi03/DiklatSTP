import express from "express";
import { 
    getPendaftar, 
    getPendaftarById,
    createRegistrasi,
    updateRegistrasi,
    deleteRegistrasi
} from "../controllers/DaftarDiklatController.js";
import { verifyToken, adminOnly, isUserOrAdmin, verifyLastActive } from "../middleware/auth.js";

const router = express.Router();

// Middleware untuk memastikan pengguna aktif dalam 30 menit terakhir
router.use(verifyToken, verifyLastActive);

router.get('/loadAll-daftar-diklat', adminOnly, getPendaftar); // Admin can view all
router.get('/load-daftar-diklat/:id', isUserOrAdmin, getPendaftarById); // Admin or user can view specific record
router.post('/daftar-diklat', createRegistrasi); // Any authenticated user can create their own
router.patch('/update-daftar-diklat/:id', isUserOrAdmin, updateRegistrasi); // Admin or user can update their own
router.delete('/delete-daftar-diklat/:id', isUserOrAdmin, deleteRegistrasi); // Admin or user can delete their own

export default router;
