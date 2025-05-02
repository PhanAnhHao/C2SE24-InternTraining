const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Question = require('../models/Question');
const mongoose = require('mongoose');

// CREATE
router.post('/', async (req, res) => {
  try {
    const { idTest, content, questions } = req.body;

    if (!content || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Thiếu content hoặc questions' });
    }

    // // Tạo idTest mới theo định dạng
    // const idTest = `test-${Date.now()}`;

    // Tạo test với idTest tự động tạo ra
    const newTest = new Test({ idTest, content });
    await newTest.save();

    // Duyệt và lưu từng câu hỏi
    const createdQuestions = [];
    for (const q of questions) {
      if (q.correctAnswerIndex >= q.options.length) {
        return res.status(400).json({
          error: `Câu hỏi "${q.question}" có chỉ số đáp án đúng không hợp lệ`,
        });
      }

      const questionDoc = new Question({
        idQuestion: q.idQuestion,
        idTest: newTest._id,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        answer: q.options[q.correctAnswerIndex], // optional
      });

      await questionDoc.save();
      createdQuestions.push(questionDoc); // Lưu câu hỏi
    }

    // Cập nhật test với danh sách idQuestion (lấy _id của các câu hỏi)
    newTest.idQuestion = createdQuestions.map(q => q._id); // Lấy _id của câu hỏi thay vì idQuestion
    await newTest.save(); // Lưu lại test với idQuestion đã được cập nhật

    return res.status(201).json({
      message: 'Tạo bài test và các câu hỏi thành công',
      test: newTest,
      questions: createdQuestions.map(q => ({ ...q.toObject(), _id: q._id })), // Trả về câu hỏi với _id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});


// READ all
router.get('/', async (req, res) => {
  try {
    // Lấy tất cả bài kiểm tra với thông tin câu hỏi (idQuestion) liên quan
    const tests = await Test.find()
      .populate('idQuestion', '_id question options answer'); // Chỉ lấy các trường cần thiết từ câu hỏi

    // Trả về danh sách các bài kiểm tra, bao gồm các câu hỏi liên quan
    res.json(tests.map(test => ({
      idTest: test.idTest,
      content: test.content,
      idQuestion: test.idQuestion, // Mảng các câu hỏi liên kết với bài kiểm tra
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
      id: test.id
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID
router.get('/:id', async (req, res) => {
  try {
    // Tìm Test theo id và populate các câu hỏi liên quan, lấy thêm correctAnswerIndex
    const test = await Test.findById(req.params.id)
      .populate('idQuestion', '_id question options correctAnswerIndex answer');

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Trả về dữ liệu bài test cùng các câu hỏi
    res.json({
      idTest: test.idTest,
      content: test.content,
      questions: test.idQuestion, // Mảng các câu hỏi (đã bao gồm correctAnswerIndex)
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
      id: test.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Test not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Test.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Test not found' });
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
