import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routers/userRoutes.js';
import connectDB from './config/db.js';
import postRoutes from './routers/postRoutes.js';

const app = express();
dotenv.config();

// Kết nối đến MongoDB
connectDB();

// Sử dụng middleware để phân tích body request dạng JSON
app.use(express.json());

// Cấu hình CORS - cho phép tất cả các nguồn truy cập (bạn có thể tùy chỉnh lại nếu cần)
app.use(cors({
  origin: 'http://localhost:3000', // Chỉ định chính xác origin frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP cho phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header cho phép
  credentials: true, // Cho phép gửi cookie và Authorization headers
}));

// Định tuyến API
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);

// Lắng nghe và khởi động server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
});
