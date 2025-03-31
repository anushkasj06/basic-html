const QuizAnswer = require('../models/QuizAnswer');

// Submit quiz answers
const submitQuiz = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware
    const quizData = req.body;

    // Check if user has already submitted quiz
    const existingAnswer = await QuizAnswer.findOne({ userId });
    if (existingAnswer) {
      return res.status(400).json({ message: 'You have already submitted the quiz' });
    }

    // Create new quiz answer
    const quizAnswer = new QuizAnswer({
      userId,
      ...quizData
    });

    await quizAnswer.save();
    res.status(201).json({ message: 'Quiz answers submitted successfully', quizAnswer });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ message: 'Error submitting quiz answers', error: error.message });
  }
};

// Get user's quiz answers
const getQuizAnswers = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware
    const quizAnswer = await QuizAnswer.findOne({ userId });

    if (!quizAnswer) {
      return res.status(404).json({ message: 'Quiz answers not found' });
    }

    res.json(quizAnswer);
  } catch (error) {
    console.error('Error fetching quiz answers:', error);
    res.status(500).json({ message: 'Error fetching quiz answers', error: error.message });
  }
};

module.exports = {
  submitQuiz,
  getQuizAnswers
}; 