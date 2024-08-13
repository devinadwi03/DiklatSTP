import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

// Fungsi untuk refresh token
export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);

        const newAccessToken = jwt.sign({ userId: decoded.userId, username: decoded.username, email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1m'
        });

        // Kirimkan access token dalam cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            maxAge: 1 * 60 * 1000, // Masa berlaku access token
            secure: false, // Use 'secure' flag in production
            sameSite: 'Lax', // Adjust SameSite policy based on your needs
            path: '/' // Ensure the cookie is accessible throughout your application
        });
        res.json({ accessToken: newAccessToken });
        console.log('New Token:', newAccessToken);
    });
};