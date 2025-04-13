const express = require('express');
const mongoose = require('mongoose');
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


require('dotenv').config();

const app = express();
app.use(express.json()); // Để phân tích JSON trong body của request

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

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Để chạy server, chạy lệnh: node server.js hoặc node src/server.js (nếu .env ở ngoài src)
