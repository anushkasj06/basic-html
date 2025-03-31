import React, { useState, useEffect } from 'react';
import { quiz } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      const response = await quiz.getAnswers();
      setQuizData(response.data);
      setLoading(false);
    } catch (err) {
      console.log('No quiz data available');
      setError('Please complete the quiz to view your dashboard');
      setLoading(false);
    }
  };

  // Helper function to determine if a subject is at risk and its severity
  const getRiskLevel = (marks, attendance) => {
    if (marks < 45 || attendance < 60) return 'high';
    if (marks < 60 || attendance < 75) return 'moderate';
    return 'safe';
  };

  // Calculate at-risk subjects with severity
  const atRiskSubjects = quizData?.subjects ? Object.entries(quizData.subjects)
    .filter(([_, subject]) => getRiskLevel(subject.marks, subject.attendance) !== 'safe')
    .map(([subject, data]) => ({
      name: subject,
      marks: data.marks,
      attendance: data.attendance,
      severity: getRiskLevel(data.marks, data.attendance)
    })) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 shadow-lg"></div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h2>
            <p className="text-gray-600 mb-6">{error || 'Please complete the quiz to view your dashboard'}</p>
            <a
              href="/quiz"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Take the Quiz
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for charts with enhanced colors
  const subjectPerformanceData = {
    labels: Object.keys(quizData.subjects || {}),
    datasets: [
      {
        label: 'Marks (%)',
        data: Object.values(quizData.subjects || {}).map(subject => subject.marks),
        borderColor: Object.values(quizData.subjects || {}).map(subject => {
          const riskLevel = getRiskLevel(subject.marks, subject.attendance);
          switch (riskLevel) {
            case 'high': return 'rgb(220, 38, 38)'; // Dark red
            case 'moderate': return 'rgb(234, 179, 8)'; // Yellow
            default: return 'rgb(34, 197, 94)'; // Green
          }
        }),
        backgroundColor: Object.values(quizData.subjects || {}).map(subject => {
          const riskLevel = getRiskLevel(subject.marks, subject.attendance);
          switch (riskLevel) {
            case 'high': return 'rgba(220, 38, 38, 0.2)';
            case 'moderate': return 'rgba(234, 179, 8, 0.2)';
            default: return 'rgba(34, 197, 94, 0.2)';
          }
        }),
        tension: 0.1,
      },
      {
        label: 'Attendance (%)',
        data: Object.values(quizData.subjects || {}).map(subject => subject.attendance),
        borderColor: Object.values(quizData.subjects || {}).map(subject => {
          const riskLevel = getRiskLevel(subject.marks, subject.attendance);
          switch (riskLevel) {
            case 'high': return 'rgb(220, 38, 38)';
            case 'moderate': return 'rgb(234, 179, 8)';
            default: return 'rgb(34, 197, 94)';
          }
        }),
        backgroundColor: Object.values(quizData.subjects || {}).map(subject => {
          const riskLevel = getRiskLevel(subject.marks, subject.attendance);
          switch (riskLevel) {
            case 'high': return 'rgba(220, 38, 38, 0.2)';
            case 'moderate': return 'rgba(234, 179, 8, 0.2)';
            default: return 'rgba(34, 197, 94, 0.2)';
          }
        }),
        tension: 0.1,
      },
    ],
  };

  const subjectInterestData = {
    labels: Object.keys(quizData.subjects || {}),
    datasets: [
      {
        data: Object.values(quizData.subjects || {}).map(subject => subject.interest),
        backgroundColor: Object.values(quizData.subjects || {}).map(subject => 
          getRiskLevel(subject.marks, subject.attendance) === 'high' || getRiskLevel(subject.marks, subject.attendance) === 'moderate'
            ? 'rgba(220, 38, 38, 0.8)'
            : 'rgba(34, 197, 94, 0.8)'
        ),
      },
    ],
  };

  const cgpaComparisonData = {
    labels: ['Current CGPA', 'Target CGPA'],
    datasets: [
      {
        label: 'CGPA Comparison',
        data: [quizData.currentCGPA || 0, quizData.goal || 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
      },
    ],
  };

  // New data for performance comparison
  const performanceComparisonData = {
    labels: Object.keys(quizData.subjects || {}),
    datasets: [
      {
        label: 'Your Performance',
        data: Object.values(quizData.subjects || {}).map(subject => subject.marks),
        backgroundColor: Object.values(quizData.subjects || {}).map(subject => 
          getRiskLevel(subject.marks, subject.attendance) === 'high' || getRiskLevel(subject.marks, subject.attendance) === 'moderate'
            ? 'rgba(220, 38, 38, 0.8)'
            : 'rgba(34, 197, 94, 0.8)'
        ),
        borderColor: Object.values(quizData.subjects || {}).map(subject => 
          getRiskLevel(subject.marks, subject.attendance) === 'high' || getRiskLevel(subject.marks, subject.attendance) === 'moderate'
            ? 'rgb(220, 38, 38)'
            : 'rgb(34, 197, 94)'
        ),
        borderWidth: 1,
      },
      {
        label: 'Best Possible Score',
        data: Object.values(quizData.subjects || {}).map(() => 100),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Academic Dashboard</h1>
          <p className="text-lg text-gray-600">Track your progress and performance</p>
        </div>

        {/* Enhanced At Risk Subjects Alert */}
        {atRiskSubjects.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="p-2 bg-red-100 rounded-full">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">At Risk Subjects</h3>
                <div className="mt-3">
                  <p className="text-sm text-red-700 mb-2">The following subjects need immediate attention:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {atRiskSubjects.map((subject, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${
                          subject.severity === 'high' 
                            ? 'bg-red-100 border border-red-200' 
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize text-gray-900">{subject.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            subject.severity === 'high'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subject.severity === 'high' ? 'High Risk' : 'Moderate Risk'}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Marks:</span>
                            <span className={`ml-2 font-medium ${
                              subject.marks < 45 ? 'text-red-700' : 'text-yellow-700'
                            }`}>{subject.marks}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Attendance:</span>
                            <span className={`ml-2 font-medium ${
                              subject.attendance < 60 ? 'text-red-700' : 'text-yellow-700'
                            }`}>{subject.attendance}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* CGPA Comparison Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">CGPA Comparison</h2>
            <div className="h-64">
              <Bar
                data={cgpaComparisonData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 10,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Subject Interest Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject Interest Distribution</h2>
            <div className="h-64">
              <Pie
                data={subjectInterestData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Performance Comparison Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance vs Best Possible Score</h2>
          <div className="h-96">
            <Bar
              data={performanceComparisonData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Marks (%)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${value}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Subject Performance Line Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject Performance Analysis</h2>
          <div className="h-96">
            <Line
              data={subjectPerformanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Style</h3>
            <p className="text-2xl font-bold text-blue-600 capitalize">{quizData.studyStyle}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Aim</h3>
            <p className="text-2xl font-bold text-indigo-600 capitalize">{quizData.aim}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">CGPA Gap</h3>
            <p className="text-2xl font-bold text-green-600">
              {(quizData.goal - quizData.currentCGPA).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 