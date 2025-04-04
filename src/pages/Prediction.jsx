import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Prediction = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const predictions = [
    {
      subject: "ADS (Advanced Data Structures)",
      currentScore: 75,
      predictedScore: 82,
      improvement: "+7",
      confidence: "85%",
      recommendations: "Focus on Tree and Graph algorithms"
    },
    {
      subject: "DS (Data Structures)",
      currentScore: 68,
      predictedScore: 75,
      improvement: "+7",
      confidence: "78%",
      recommendations: "Practice more on Linked Lists and Stacks"
    },
    {
      subject: "AM (Applied Mathematics)",
      currentScore: 82,
      predictedScore: 88,
      improvement: "+6",
      confidence: "90%",
      recommendations: "Keep practicing Calculus problems"
    },
    {
      subject: "Java Programming",
      currentScore: 70,
      predictedScore: 78,
      improvement: "+8",
      confidence: "82%",
      recommendations: "Focus on OOP concepts and Collections"
    },
    {
      subject: "DBMS (Database Management)",
      currentScore: 77,
      predictedScore: 85,
      improvement: "+8",
      confidence: "87%",
      recommendations: "Practice more SQL queries and Normalization"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/studyplan')}
            className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-2.5 rounded-lg 
            hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg 
            active:transform active:scale-95"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Get Study Plan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-8">Performance Predictions</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 text-center">
              Based on your past performance, attendance, and interest levels, here are your predicted scores for upcoming assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((pred, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{pred.subject}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    parseInt(pred.improvement) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pred.improvement}%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Score:</span>
                    <span className="font-medium">{pred.currentScore}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Predicted Score:</span>
                    <span className="font-medium text-blue-600">{pred.predictedScore}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Prediction Confidence:</span>
                    <span className="font-medium">{pred.confidence}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommendations:</h4>
                    <p className="text-sm text-gray-600">{pred.recommendations}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Factors Considered in Prediction</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-2">
              <li>Previous quiz marks</li>
              <li>Attendance percentage</li>
              <li>Subject interest level</li>
              <li>Overall performance trend</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction; 