const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const accountRoutes = require('./routes/accountRouter'); // Route cho bảng account
const roleRoutes = require('./routes/roleRouter'); // Route cho bảng role
const studentRouter = require('./routes/studentRouter');
const businessRouter = require('./routes/businessRouter');
const languageRouter = require('./routes/languageRouter');
const courseRouter = require('./routes/courseRouter');
const lessonRouter = require('./routes/lessonRouter');
const testRouter = require('./routes/testRouter');
const questionRouter = require('./routes/questionRouter');
const authRouter = require('./routes/authRouter');
const testMailRouter = require('./routes/testMailRouter');
const historyRouter = require('./routes/historyRouter'); // New router for History
const ratingRouter = require('./routes/ratingRouter'); // New router for Rating
const blogRouter = require('./routes/blogRouter'); // New router for Blog
const viewRequestRouter = require('./routes/viewRequestRouter');
const studentLessonProgressRouter = require('./routes/studentLessonProgressRouter'); // New router for tracking student lesson progress
const userRoutes = require('./routes/userRoutes'); // User routes for CV uploads
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(express.json()); // Để phân tích JSON trong body của request
app.use(cors({
  origin: 'https://localhost:5173', // Chỉ định rõ nguồn gốc của frontend
  credentials: true, // Hỗ trợ credentials (cookies, authorization headers, v.v.)
}));

// Upload image
const uploadRoute = require("./routes/upload.route");
const cvUploadRoute = require("./routes/cvUpload.route");
app.use("/api", uploadRoute);
app.use("/api", cvUploadRoute);

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'uploads', 'blogs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Sử dụng các route cho bảng tài khoản và vai trò
app.use('/api/accounts', accountRoutes);  // Route cho bảng account
app.use('/api/roles', roleRoutes);  // Route cho bảng role
// Use student routes
app.use('/students', studentRouter);
app.use('/businesses', businessRouter);
app.use('/languages', languageRouter);
app.use('/courses', courseRouter);
app.use('/lessons', lessonRouter);
app.use('/tests', testRouter);
app.use('/questions', questionRouter);
app.use('/auth', authRouter);
app.use('/send-mail', testMailRouter);
// Add routes for new collections
app.use('/history', historyRouter);
app.use('/ratings', ratingRouter);
app.use('/blogs', blogRouter); // Add the blog routes
app.use('/api/view-requests', viewRequestRouter);
app.use('/progress', studentLessonProgressRouter); // Add the student lesson progress routes
app.use('/users', userRoutes); // Add user routes for CV operations

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Để chạy server, chạy lệnh: node server.js hoặc node src/server.js (nếu .env ở ngoài src)
