const express = require('express');
const router = express.Router();
const { submitQuiz, getQuizAnswers } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

// Submit quiz answers
router.post('/submit', protect, submitQuiz);

// Get user's quiz answers
router.get('/answers', protect, getQuizAnswers);

module.exports = router; 