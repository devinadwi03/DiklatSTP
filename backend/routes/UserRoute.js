import express from "express";
import { 
    getUsers, 
    getUsersById,
    createUser,
    updateUser,
    updatePassword,
    deleteUser,
    Login,
    Logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail
} from "../controllers/UserController.js";
import { verifyToken, adminOnly, isUserOrAdmin, verifyLastActive } from '../middleware/auth.js';
import { refreshToken } from "../services/RefreshToken.js";

const router = express.Router();

router.get('/check-auth', verifyToken, (req, res) => {
  res.json({ authenticated: true });
});

router.get('/user-role', verifyToken, (req, res) => {
  const role = req.user.role; // Ambil role dari token yang sudah terverifikasi
  res.json({ role: role });
});

router.get('/users', verifyToken, verifyLastActive, adminOnly, getUsers);
router.get('/users/:id', verifyToken, verifyLastActive, isUserOrAdmin, getUsersById);
router.post('/register', createUser);
router.put('/users/:id', verifyToken, verifyLastActive, isUserOrAdmin, updateUser);
router.delete('/users/:id', verifyToken, verifyLastActive, adminOnly, deleteUser);
router.put('/users/update-password/:id', verifyToken, verifyLastActive, isUserOrAdmin, updatePassword);
router.post('/resend-verification-email', resendVerificationEmail); // Endpoint baru

router.post('/login', Login);
router.post('/logout', Logout); // Logout harus terautentikasi untuk mengetahui siapa yang logout

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.post('/refresh-token', refreshToken);

router.get('/activation/:token', verifyEmail);


export default router;