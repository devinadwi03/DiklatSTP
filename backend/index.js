import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/UserRoute.js";
import DaftarDiklatRoute from "./routes/DaftarDiklatRoute.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middleware
app.use(cors({ 
  credentials: true, 
  origin: 'http://localhost:4200', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Tambahkan POST di sini
  allowedHeaders: 'Content-Type,Authorization' 
}));
app.use(cookieParser());
app.use(express.json());

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'public/browser')));

// API routes
app.use(UserRoute);
app.use(DaftarDiklatRoute);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'browser', 'index.html'));
});

// Start server
app.listen(5000, () => console.log('Server up and running...'));
