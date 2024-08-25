import express from "express";
import { 
    getPendaftar, 
    getPendaftarById,
    createRegistrasi,
    updateRegistrasi,
    deleteRegistrasi
} from "../controllers/DaftarDiklatController.js";
import DaftarDiklat from '../models/DaftarDiklatModel.js';
import { verifyToken, adminOnly, isUserOrAdmin, verifyLastActive } from "../middleware/auth.js";

const router = express.Router();

// Middleware global
router.use(verifyToken, verifyLastActive); // Apply globally, if needed

// Endpoint untuk memeriksa status pendaftaran
router.get('/check-registration-status', async (req, res) => {
    try {
      const userId = req.user.userId; // Ambil ID user dari token
      const registration = await DaftarDiklat.findOne({ where: { id_user: userId } });
  
      if (registration) {
        return res.json({ isRegistered: true });
      } else {
        return res.json({ isRegistered: false });
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

router.get('/loadAll-daftar-diklat', adminOnly, getPendaftar); // Admin can view all
router.get('/load-daftar-diklat', isUserOrAdmin, getPendaftarById); // Admin or user can view specific record
router.post('/daftar-diklat', createRegistrasi); // Any authenticated user can create their own
router.put('/update-daftar-diklat', isUserOrAdmin, updateRegistrasi); // Admin or user can update their own
router.delete('/delete-daftar-diklat/:id', isUserOrAdmin, deleteRegistrasi); // Admin or user can delete their own

export default router;
