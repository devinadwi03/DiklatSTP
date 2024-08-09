import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken; // Mengambil token dari cookies

    if (token == null) return res.sendStatus(401); // Jika tidak ada token, kirim status 401 Unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // Jika token tidak valid, kirim status 403 Forbidden
        req.user = decoded; // Simpan data user dari token ke req.user
        next(); // Lanjutkan ke middleware berikutnya
    });
};


export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    if (user.role !== "admin") return res.status(403).json({ msg: "Akses terlarang" });
    next();
};

// Middleware untuk memverifikasi bahwa ia adalah user pemilik data atau admin
export const isUserOrAdmin = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Ambil userId dari token yang terverifikasi
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
        }

        if (user.role === "admin" || user.id === userId) {
            next();
        } else {
            return res.status(403).json({ msg: "Akses terlarang" });
        }
    } catch (error) {
        console.error("Error in isUserOrAdmin middleware:", error.message);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

// Middleware untuk memverifikasi bahwa pengguna aktif dalam 30 menit terakhir
export const verifyLastActive = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.userId } });

        if (!user) {
            return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
        }

        const thirtyMinutesAgo = new Date(new Date() - 30 * 60 * 1000);
        if (user.last_active && user.last_active < thirtyMinutesAgo) {
            await User.update({ refresh_token: null, status: false }, { where: { id: user.id } });
            return res.status(400).json({ msg: "Akun telah logout otomatis karena tidak aktif lebih dari 30 menit" });
        }

        await User.update({ last_active: new Date() }, { where: { id: user.id } });

        next();
    } catch (error) {
        console.error("Error in verifyLastActive middleware:", error.message);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};