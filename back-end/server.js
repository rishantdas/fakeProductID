// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToMongoDB from './db/connectToMongoDB.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.route.js';
import userRoutes from './routes/user.routes.js';
// import uploadRoute from './routes/uploadRoutes.js';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import multer from 'multer';
import cookieParser from 'cookie-parser';



const app = express();
dotenv.config();


const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());


// // Configure multer storage
// const Storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/profile'); // Directory to save the uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Filename format
//   }
// });
// const upload = multer({
//   storage: Storage,
// }).single('image');


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
// app.use('/api/uploads', uploadRoute);

// Start server and connect to MongoDB
app.listen(PORT, () => {
  connectToMongoDB(); // Connect to MongoDB
  console.log(`Server running on http://localhost:${PORT}`);
});
