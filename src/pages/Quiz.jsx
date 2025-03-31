import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({
    currentCGPA: '',
    education: '',
    subjects: {
      ads: { marks: '', attendance: '', interest: '' },
      ds: { marks: '', attendance: '', interest: '' },
      am: { marks: '', attendance: '', interest: '' },
      java: { marks: '', attendance: '', interest: '' },
      dbms: { marks: '', attendance: '', interest: '' }
    },
    achievements: '',
    hobbies: '',
    studyStyle: '',
    parentEducation: '',
    aim: '',
    goal: '',
    screenTime: '',
    sleepTime: ''
  });

  const questions = [
    {
      id: 'currentCGPA',
      title: '🎓 Your Current CGPA',
      description: 'Let\'s start with your current academic standing!',
      type: 'number',
      placeholder: 'Enter your current CGPA (0-10)',
      min: 0,
      max: 10,
      step: 0.1
    },
    {
      id: 'education',
      title: '📚 Current Education Level',
      description: 'What\'s your current educational journey?',
      type: 'select',
      options: [
        { value: 'btech1', label: 'B.Tech 1st Year' },
        { value: 'btech2', label: 'B.Tech 2nd Year' },
        { value: 'btech3', label: 'B.Tech 3rd Year' },
        { value: 'btech4', label: 'B.Tech 4th Year' }
      ]
    },
    {
      id: 'subjects',
      title: '📖 Subject Performance',
      description: 'Let\'s dive into your subject-wise performance!',
      type: 'subjects',
      subjects: ['ads', 'ds', 'am', 'java', 'dbms']
    },
    {
      id: 'achievements',
      title: '🏆 Your Achievements',
      description: 'Share your proud moments!',
      type: 'textarea',
      placeholder: 'List your academic achievements...'
    },
    {
      id: 'hobbies',
      title: '🎨 Your Hobbies',
      description: 'What makes you unique outside academics?',
      type: 'textarea',
      placeholder: 'Tell us about your hobbies...'
    },
    {
      id: 'studyStyle',
      title: '📝 Study Style',
      description: 'How do you prefer to learn?',
      type: 'select',
      options: [
        { value: 'visual', label: 'Visual Learner' },
        { value: 'auditory', label: 'Auditory Learner' },
        { value: 'reading', label: 'Reading/Writing Learner' },
        { value: 'kinesthetic', label: 'Kinesthetic Learner' }
      ]
    },
    {
      id: 'parentEducation',
      title: '👨‍👩‍👧‍👦 Parent\'s Education',
      description: 'Tell us about your parents\' educational background',
      type: 'select',
      options: [
        { value: 'high_school', label: 'High School' },
        { value: 'bachelors', label: 'Bachelor\'s Degree' },
        { value: 'masters', label: 'Master\'s Degree' },
        { value: 'phd', label: 'PhD' }
      ]
    },
    {
      id: 'aim',
      title: '🎯 Your Aim',
      description: 'What\'s your career aim?',
      type: 'select',
      options: [
        { value: 'software', label: 'Software Development' },
        { value: 'data', label: 'Data Science' },
        { value: 'ai', label: 'Artificial Intelligence' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'goal',
      title: '⭐ Your Goal',
      description: 'What\'s your target CGPA?',
      type: 'number',
      placeholder: 'Enter your target CGPA (0-10)',
      min: 0,
      max: 10,
      step: 0.1
    },
    {
      id: 'screenTime',
      title: '📱 Daily Screen Time',
      description: 'How many hours do you spend on screens daily?',
      type: 'number',
      placeholder: 'Enter hours (0-24)',
      min: 0,
      max: 24
    },
    {
      id: 'sleepTime',
      title: '😴 Sleep Schedule',
      description: 'How many hours do you sleep daily?',
      type: 'number',
      placeholder: 'Enter hours (0-12)',
      min: 0,
      max: 12
    }
  ];

  const handleAnswer = (value) => {
    const currentQuestion = questions[currentStep];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleSubjectAnswer = (subject, field, value) => {
    setAnswers(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          [field]: value
        }
      }
    }));
  };

  const validateAnswers = () => {
    // Validate required fields
    const requiredFields = ['currentCGPA', 'education', 'studyStyle', 'parentEducation', 'aim', 'goal', 'screenTime', 'sleepTime'];
    for (const field of requiredFields) {
      if (!answers[field]) {
        setError(`Please answer the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} question`);
        return false;
      }
    }

    // Validate subject data
    for (const subject of ['ads', 'ds', 'am', 'java', 'dbms']) {
      const subjectData = answers.subjects[subject];
      if (!subjectData.marks || !subjectData.attendance || !subjectData.interest) {
        setError(`Please complete all fields for ${subject.toUpperCase()}`);
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      if (!validateAnswers()) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Convert string values to numbers where needed
        const formattedAnswers = {
          ...answers,
          currentCGPA: parseFloat(answers.currentCGPA),
          goal: parseFloat(answers.goal),
          screenTime: parseInt(answers.screenTime),
          sleepTime: parseInt(answers.sleepTime),
          subjects: Object.entries(answers.subjects).reduce((acc, [subject, data]) => ({
            ...acc,
            [subject]: {
              marks: parseInt(data.marks),
              attendance: parseInt(data.attendance),
              interest: parseInt(data.interest)
            }
          }), {})
        };

        const response = await axios.post('http://localhost:5000/api/quiz/submit', formattedAnswers, {
          withCredentials: true
        });
        
        if (response.status === 201) {
          console.log('Quiz completed:', response.data);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error submitting quiz:', error);
        setError(error.response?.data?.message || 'Error submitting quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentStep];

    switch (question.type) {
      case 'number':
        return (
          <div className="space-y-4">
            <input
              type="number"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={question.placeholder}
              min={question.min}
              max={question.max}
              step={question.step}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.value}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  answers[question.id] === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleAnswer(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      case 'subjects':
        return (
          <div className="space-y-6">
            {question.subjects.map((subject) => (
              <div key={subject} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 capitalize">{subject.toUpperCase()}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marks (%)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                      value={answers.subjects[subject].marks || ''}
                      onChange={(e) => handleSubjectAnswer(subject, 'marks', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                      value={answers.subjects[subject].attendance || ''}
                      onChange={(e) => handleSubjectAnswer(subject, 'attendance', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest (1-10)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                      min="1"
                      max="10"
                      value={answers.subjects[subject].interest || ''}
                      onChange={(e) => handleSubjectAnswer(subject, 'interest', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4">
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder={question.placeholder}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{questions[currentStep].title}</h2>
          <p className="text-gray-600 mb-6">{questions[currentStep].description}</p>
          
          {renderQuestion()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 0 || loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                currentStep === questions.length - 1 ? 'Finish' : 'Next'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 