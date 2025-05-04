const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Question = require('../models/Question');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// CREATE
router.post('/', async (req, res) => {
  try {
    const { idTest, idCourse, content, questions } = req.body;

    // Kiểm tra thông tin cơ bản
    if (!idCourse || !content || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Thiếu content, course hoặc danh sách câu hỏi rỗng' });
    }

    const existingTest = await Test.findOne({ idTest });
    if (existingTest) {
      return res.status(400).json({ error: `idTest "${idTest}" đã tồn tại, vui lòng chọn mã khác` });
    }

    // Kiểm tra từng câu hỏi trước khi lưu
    for (const q of questions) {
      if (!q.idQuestion || !q.question || !Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ error: `Câu hỏi không hợp lệ: ${q.question || 'Chưa có nội dung'}` });
      }

      if (
        typeof q.correctAnswerIndex !== 'number' ||
        q.correctAnswerIndex < 0 ||
        q.correctAnswerIndex >= q.options.length
      ) {
        return res.status(400).json({
          error: `Câu hỏi "${q.question}" có chỉ số đáp án đúng không hợp lệ`,
        });
      }
    }

    // Nếu qua được kiểm tra, bắt đầu lưu
    const newTest = new Test({ idTest, idCourse, content });
    await newTest.save();

    const createdQuestions = [];
    for (const q of questions) {
      const questionDoc = new Question({
        idQuestion: q.idQuestion,
        idTest: newTest._id,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        answer: q.options[q.correctAnswerIndex],
      });

      await questionDoc.save();
      createdQuestions.push(questionDoc);
    }

    newTest.idQuestion = createdQuestions.map(q => q._id);
    await newTest.save();

    return res.status(201).json({
      message: 'Tạo bài test và các câu hỏi thành công',
      test: newTest,
      questions: createdQuestions.map(q => ({ ...q.toObject(), _id: q._id })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});



// READ all
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find()
      .populate('idQuestion', '_id question options answer')
      .populate('idCourse', '_id idCourse courseName description') // Lấy thông tin khóa học
      .sort({ createdAt: -1 }); // Sắp xếp theo trường createdAt, mới nhất sẽ lên đầu

    res.json(tests.map(test => ({
      idTest: test.idTest,
      content: test.content,
      course: test.idCourse, // Trả về thông tin khóa học
      questions: test.idQuestion, // Mảng các câu hỏi
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
      id: test._id,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ by ID
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('idQuestion', '_id question options correctAnswerIndex answer')
      .populate('idCourse', '_id courseName description'); // Lấy thông tin khóa học

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json({
      idTest: test.idTest,
      content: test.content,
      idCourse: test.idCourse, // Trả về thông tin khóa học
      questions: test.idQuestion,
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
      id: test._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { idTest, idCourse, content, questions } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!idTest || !idCourse || !content || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Thiếu thông tin bài test hoặc câu hỏi không hợp lệ' });
    }

    // Kiểm tra bài kiểm tra đã tồn tại chưa
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Bài kiểm tra không tìm thấy' });
    }

    // Cập nhật bài kiểm tra
    test.idTest = idTest;
    test.idCourse = idCourse;
    test.content = content;

    // Lưu bài kiểm tra đã cập nhật
    await test.save();

    // Cập nhật các câu hỏi liên quan
    const updatedQuestions = [];
    for (const q of questions) {
      // Kiểm tra từng câu hỏi
      if (!q.idQuestion || !q.question || !Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ error: `Câu hỏi không hợp lệ: ${q.question || 'Chưa có nội dung'}` });
      }

      if (
        typeof q.correctAnswerIndex !== 'number' ||
        q.correctAnswerIndex < 0 ||
        q.correctAnswerIndex >= q.options.length
      ) {
        return res.status(400).json({
          error: `Câu hỏi "${q.question}" có chỉ số đáp án đúng không hợp lệ`,
        });
      }

      const updatedQuestion = await Question.findOneAndUpdate(
        { idQuestion: q.idQuestion, idTest: req.params.id },
        {
          question: q.question,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          answer: q.options[q.correctAnswerIndex],
        },
        { new: true }
      );

      updatedQuestions.push(updatedQuestion);
    }

    res.json({
      message: 'Cập nhật bài kiểm tra và các câu hỏi thành công!',
      test: test,
      questions: updatedQuestions.map(q => ({ ...q.toObject(), _id: q._id })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});



// DELETE
router.delete('/:id', async (req, res) => {
  try {
    // Lấy ID bài kiểm tra từ tham số URL
    const testId = req.params.id;

    // Xóa các câu hỏi liên quan đến bài kiểm tra
    await Question.deleteMany({ idTest: testId });

    // Xóa bài kiểm tra
    const deletedTest = await Test.findByIdAndDelete(testId);

    if (!deletedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json({ message: 'Test and related questions deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
