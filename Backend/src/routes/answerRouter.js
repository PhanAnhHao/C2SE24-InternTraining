const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Test = require('../models/Test');
const History = require('../models/History');
const mongoose = require('mongoose');

// CREATE - Submit an answer
router.post('/', async (req, res) => {
  try {
    const { questionId, userId, selectedOptionIndex } = req.body;
    
    // Find the question to check correctness
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // Validate selectedOptionIndex
    if (selectedOptionIndex < 0 || selectedOptionIndex >= question.options.length) {
      return res.status(400).json({ 
        error: 'Selected option index is out of range' 
      });
    }
    
    // Determine if answer is correct and get the content
    const isCorrect = selectedOptionIndex === question.correctAnswerIndex;
    const content = question.options[selectedOptionIndex];
    
    // Create or update answer
    const answerData = {
      content,
      questionId,
      userId,
      selectedOptionIndex,
      isCorrect
    };
    
    // Use findOneAndUpdate with upsert to handle both creation and updates
    const answer = await Answer.findOneAndUpdate(
      { userId, questionId }, 
      answerData, 
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    res.status(201).json(answer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// NEW ENDPOINT - Submit answers for an entire test and calculate score
router.post('/submit-test', async (req, res) => {
  try {
    const { testId, userId, answers } = req.body;
    
    // Validate required fields
    if (!testId || !userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Test ID, User ID, and answers array are required' });
    }
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(testId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Get the test with its questions
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    const savedAnswers = [];
    let correctCount = 0;
    
    // Process each answer
    for (const answerData of answers) {
      const { questionId, selectedOptionIndex } = answerData;
      
      // Validate question ID
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ error: `Invalid question ID format: ${questionId}` });
      }
      
      // Check if question belongs to the test
      if (!test.idQuestion.includes(questionId)) {
        return res.status(400).json({ error: `Question ${questionId} does not belong to test ${testId}` });
      }
      
      // Get the question
      const question = await Question.findById(questionId);
      if (!question) {
        return res.status(404).json({ error: `Question not found: ${questionId}` });
      }
      
      // Validate selectedOptionIndex
      if (selectedOptionIndex < 0 || selectedOptionIndex >= question.options.length) {
        return res.status(400).json({ 
          error: `Selected option index is out of range for question ${questionId}` 
        });
      }
      
      // Determine if answer is correct and get the content
      const isCorrect = selectedOptionIndex === question.correctAnswerIndex;
      if (isCorrect) correctCount++;
      
      const content = question.options[selectedOptionIndex];
      
      // Create or update answer
      const answer = await Answer.findOneAndUpdate(
        { userId, questionId }, 
        {
          content,
          questionId,
          userId,
          selectedOptionIndex,
          isCorrect
        }, 
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      
      savedAnswers.push(answer);
    }
    
    // Calculate score
    const totalQuestions = test.idQuestion.length;
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    
    // Determine if passed (e.g., score >= 70%)
    const passThreshold = 70; // Can be configured as needed
    const passed = score >= passThreshold;
    
    // Create history entry
    const history = new History({
      studentId: userId,
      testId,
      score,
      completedAt: new Date(),
      passed
    });
    
    await history.save();
    
    res.status(201).json({
      savedAnswers,
      history: {
        id: history._id,
        score,
        passed,
        totalQuestions,
        correctAnswers: correctCount
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL - Get all answers
router.get('/', async (req, res) => {
  try {
    const answers = await Answer.find()
      .populate('userId', 'userName')
      .populate({
        path: 'questionId',
        select: 'question options correctAnswerIndex'
      });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID - Get a specific answer
router.get('/:id', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id)
      .populate('userId', 'userName')
      .populate({
        path: 'questionId',
        select: 'question options correctAnswerIndex'
      });
    
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY USER - Get all answers for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const answers = await Answer.find({ userId })
      .populate({
        path: 'questionId',
        select: 'question options correctAnswerIndex'
      })
      .sort({ createdAt: -1 });
    
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY QUESTION - Get all answers for a specific question
router.get('/question/:questionId', async (req, res) => {
  try {
    const questionId = req.params.questionId;
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: 'Invalid question ID format' });
    }

    const answers = await Answer.find({ questionId })
      .populate('userId', 'userName')
      .sort({ createdAt: -1 });
    
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update an answer
router.put('/:id', async (req, res) => {
  try {
    // If changing the selected option
    if (req.body.selectedOptionIndex !== undefined) {
      const answer = await Answer.findById(req.params.id);
      if (!answer) {
        return res.status(404).json({ message: 'Answer not found' });
      }
      
      // Get the question to verify the option index and check correctness
      const question = await Question.findById(answer.questionId);
      if (!question) {
        return res.status(404).json({ error: 'Associated question not found' });
      }
      
      // Validate the new selected option index
      if (req.body.selectedOptionIndex < 0 || req.body.selectedOptionIndex >= question.options.length) {
        return res.status(400).json({ error: 'Selected option index is out of range' });
      }
      
      // Update content and correctness
      req.body.content = question.options[req.body.selectedOptionIndex];
      req.body.isCorrect = req.body.selectedOptionIndex === question.correctAnswerIndex;
    }
    
    const updated = await Answer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Answer not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete an answer
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Answer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Answer not found' });
    res.json({ message: 'Answer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;