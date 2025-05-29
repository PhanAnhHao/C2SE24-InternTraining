const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Question = require('../models/Question');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
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
      .populate('idQuestion', 'question options correctAnswerIndex answer')
      .populate('idCourse', 'idCourse infor') // Lấy thông tin khóa học
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
      .populate('idQuestion', 'question options correctAnswerIndex answer')
      .populate('idCourse', 'idCourse infor'); // Lấy thông tin khóa học

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json({
      idTest: test.idTest,
      content: test.content,
      // Trả về thông tin khóa học
      // vì tên trường trong model Test là idCourse, nên sau khi populate, nó vẫn là test.idCourse, nhưng giá trị bây giờ là object chứa idCourse, infor chứ không phải chỉ là _id nữa
      idCourse: test.idCourse,
      questions: test.idQuestion,
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
      id: test._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by Business ID - Cải thiện xử lý lỗi
router.get('/business/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;

    // console.log('Finding tests for business ID:', businessId);

    // Validate business ID
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ error: 'Invalid business ID format' });
    }

    // Kiểm tra business có tồn tại không
    const business = await mongoose.model('Business').findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // 1. Find all courses by business ID
    const courses = await Course.find({ businessId });
    // console.log(`Found ${courses.length} courses for business ID ${businessId}`);

    if (courses.length === 0) {
      return res.json({
        success: true,
        message: 'No courses found for this business',
        business: {
          id: business._id,
          idBusiness: business.idBusiness
        },
        tests: []
      });
    }

    const courseIds = courses.map(course => course._id);

    // 2. Find all lessons from these courses
    const lessons = await Lesson.find({ idCourse: { $in: courseIds } });
    // console.log(`Found ${lessons.length} lessons from courses`);

    if (lessons.length === 0) {
      return res.json({
        success: true,
        message: 'No lessons found for the courses of this business',
        business: {
          id: business._id,
          idBusiness: business.idBusiness
        },
        coursesCount: courses.length,
        tests: []
      });
    }

    const lessonIds = lessons.map(lesson => lesson._id);

    // 3. Find all tests from these lessons
    const tests = await Test.find({ idLesson: { $in: lessonIds } })
      .populate('idLesson')
      .populate('idQuestion', 'idQuestion question options');

    // console.log(`Found ${tests.length} tests from lessons`);

    if (tests.length === 0) {
      return res.json({
        success: true,
        message: 'No tests found for the lessons of this business',
        business: {
          id: business._id,
          idBusiness: business.idBusiness
        },
        coursesCount: courses.length,
        lessonsCount: lessons.length,
        tests: []
      });
    }

    // 4. Structure the response by course and lesson

    // Create map of course IDs to course info
    const courseMap = {};
    courses.forEach(course => {
      courseMap[course._id.toString()] = {
        courseId: course._id,
        idCourse: course.idCourse,
        info: course.infor
      };
    });

    // Create map of lesson IDs to lesson info and course ID
    const lessonMap = {};
    lessons.forEach(lesson => {
      lessonMap[lesson._id.toString()] = {
        lessonId: lesson._id,
        idLesson: lesson.idLesson,
        name: lesson.name,
        courseId: lesson.idCourse
      };
    });

    // Organize tests by course and lesson - Thêm xử lý lỗi
    const organizedTests = [];
    let errorsCount = 0;

    tests.forEach(test => {
      try {
        // Kiểm tra xem test có thông tin về idLesson không
        if (!test.idLesson || !test.idLesson._id) {
          // console.log(`Test ${test._id} has no idLesson information`);
          errorsCount++;
          return; // Skip this test
        }

        const lessonId = test.idLesson._id.toString();

        // Kiểm tra xem lessonId có trong lessonMap không
        if (!lessonMap[lessonId]) {
          // console.log(`Lesson with ID ${lessonId} not found in lesson map for test ${test._id}`);
          errorsCount++;
          return; // Skip this test
        }

        const lessonInfo = lessonMap[lessonId];

        // Kiểm tra xem lessonInfo có courseId không
        if (!lessonInfo.courseId) {
          // console.log(`Lesson ${lessonId} has no courseId information for test ${test._id}`);
          errorsCount++;
          return; // Skip this test
        }

        const courseId = lessonInfo.courseId.toString();

        // Kiểm tra xem courseId có trong courseMap không
        if (!courseMap[courseId]) {
          // console.log(`Course with ID ${courseId} not found in course map for test ${test._id}`);
          errorsCount++;
          return; // Skip this test
        }

        const courseInfo = courseMap[courseId];

        // Thêm test vào danh sách đã tổ chức
        organizedTests.push({
          testId: test._id,
          idTest: test.idTest,
          content: test.content,
          questionsCount: test.idQuestion ? test.idQuestion.length : 0,
          lesson: {
            id: lessonInfo.lessonId,
            idLesson: lessonInfo.idLesson,
            name: lessonInfo.name
          },
          course: {
            id: courseInfo.courseId,
            idCourse: courseInfo.idCourse,
            info: courseInfo.info
          }
        });
      } catch (err) {
        console.error(`Error processing test ${test._id}:`, err);
        errorsCount++;
      }
    });

    // Nếu có lỗi, thêm thông tin lỗi vào response
    const responseMessage = errorsCount > 0
      ? `Found ${tests.length} tests (${errorsCount} could not be processed) for business ID ${businessId}`
      : `Found ${tests.length} tests for business ID ${businessId}`;

    res.json({
      success: true,
      message: responseMessage,
      business: {
        id: business._id,
        idBusiness: business.idBusiness
      },
      coursesCount: courses.length,
      lessonsCount: lessons.length,
      testsCount: tests.length,
      processedTestsCount: organizedTests.length,
      testsWithErrorsCount: errorsCount,
      tests: organizedTests
    });
  } catch (err) {
    console.error('Error in /business/:businessId route:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }
});

// UPDATE
router.put('/:idTest', async (req, res) => {
  try {
    const { idTest, idCourse, content, questions } = req.body;

    if (!idCourse || !content || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Thiếu content, course hoặc danh sách câu hỏi rỗng' });
    }

    const existingTest = await Test.findOne({ idTest });
    if (!existingTest) {
      return res.status(404).json({ error: `Không tìm thấy bài test với idTest "${idTest}"` });
    }

    // Cập nhật nội dung bài test
    existingTest.idCourse = idCourse;
    existingTest.content = content;
    await existingTest.save();

    const updatedQuestionIds = [];

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

      // Kiểm tra xem câu hỏi đã tồn tại chưa
      let questionDoc = await Question.findOne({ idQuestion: q.idQuestion, idTest: existingTest._id });

      // console.log("questionDoc: ", questionDoc);

      if (questionDoc) {
        // Cập nhật câu hỏi
        questionDoc.question = q.question;
        questionDoc.options = q.options;
        questionDoc.correctAnswerIndex = q.correctAnswerIndex;
        questionDoc.answer = q.options[q.correctAnswerIndex];
        await questionDoc.save();
      } else {
        // Tạo mới câu hỏi
        questionDoc = new Question({
          idQuestion: q.idQuestion,
          idTest: existingTest._id,
          question: q.question,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          answer: q.options[q.correctAnswerIndex],
        });
        await questionDoc.save();
      }

      updatedQuestionIds.push(questionDoc._id);
    }

    // (Tùy chọn) Xoá các câu hỏi không còn tồn tại trong danh sách
    await Question.deleteMany({
      idTest: existingTest._id,
      _id: { $nin: updatedQuestionIds },
    });

    // Cập nhật lại danh sách idQuestion trong bài test
    existingTest.idQuestion = updatedQuestionIds;
    await existingTest.save();

    const updatedQuestions = await Question.find({ _id: { $in: updatedQuestionIds } });

    return res.status(200).json({
      message: 'Cập nhật bài test và câu hỏi thành công',
      test: existingTest,
      questions: updatedQuestions,
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