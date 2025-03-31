import React, { useState, useEffect, useMemo } from 'react';
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
    if (marks < 45 || attendance < 60) {
      return 'high';
    } else if (marks < 60 || attendance < 75) {
      return 'moderate';
    }
    return 'good';
  };

  const atRiskSubjects = useMemo(() => {
    return quizData?.subjects ? Object.entries(quizData.subjects)
      .filter(([_, subject]) => getRiskLevel(subject.marks, subject.attendance) !== 'good')
      .map(([subject, data]) => ({
        name: subject,
        marks: data.marks,
        attendance: data.attendance,
        riskLevel: getRiskLevel(data.marks, data.attendance)
      })) : [];
  }, [quizData]);

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
        label: 'Marks',
        data: Object.values(quizData.subjects || {}).map(subject => subject.marks),
        borderColor: Object.values(quizData.subjects || {}).map(subject => {
          const riskLevel = getRiskLevel(subject.marks, subject.attendance);
          return riskLevel === 'high' ? '#dc2626' : 
                 riskLevel === 'moderate' ? '#f97316' : 
                 '#22c55e';
        }),
        backgroundColor: Object.values(quizData.subjects || {}).map(subject => {
          const riskLevel = getRiskLevel(subject.marks, subject.attendance);
          return riskLevel === 'high' ? 'rgba(220, 38, 38, 0.2)' : 
                 riskLevel === 'moderate' ? 'rgba(249, 115, 22, 0.2)' : 
                 'rgba(34, 197, 94, 0.2)';
        }),
      },
    ],
  };

  const subjectInterestData = {
    labels: Object.keys(quizData.subjects || {}),
    datasets: [
      {
        label: 'Attendance',
        data: Object.values(quizData.subjects || {}).map(subject => subject.attendance),
        borderColor: Object.values(quizData.subjects || {}).map(subject => {
          const riskLevel = getRiskLevel(subject.marks, subject.attendance);
          return riskLevel === 'high' ? '#dc2626' : 
                 riskLevel === 'moderate' ? '#f97316' : 
                 '#22c55e';
        }),
        backgroundColor: Object.values(quizData.subjects || {}).map(subject => {
          const riskLevel = getRiskLevel(subject.marks, subject.attendance);
          return riskLevel === 'high' ? 'rgba(220, 38, 38, 0.2)' : 
                 riskLevel === 'moderate' ? 'rgba(249, 115, 22, 0.2)' : 
                 'rgba(34, 197, 94, 0.2)';
        }),
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
          <div className="p-4 mb-6 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-100">
            <h3 className="text-lg font-semibold mb-3 text-red-800">Subjects Requiring Attention</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {atRiskSubjects.map((subject, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md transition-all hover:scale-105 ${
                    subject.riskLevel === 'high' 
                      ? 'bg-red-100 border-red-200' 
                      : 'bg-orange-100 border-orange-200'
                  } border`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subject.name}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      subject.riskLevel === 'high'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-orange-200 text-orange-800'
                    }`}>
                      {subject.riskLevel === 'high' ? 'High Risk' : 'Moderate Risk'}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Marks: {subject.marks}%</p>
                    <p>Attendance: {subject.attendance}%</p>
                  </div>
                </div>
              ))}
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