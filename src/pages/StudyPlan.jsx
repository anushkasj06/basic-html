import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudyPlan.css';

const StudyPlan = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [completedTopics, setCompletedTopics] = useState({});
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  const subjects = [
    { id: 'ads', name: 'ADS (Advanced Data Structures)' },
    { id: 'ds', name: 'DS (Data Structures)' },
    { id: 'am', name: 'AM (Applied Mathematics)' },
    { id: 'java', name: 'Java Programming' },
    { id: 'dbms', name: 'DBMS (Database Management)' }
  ];

  const roadmaps = {
    ads: [
      {
        week: 'Week 1-2',
        title: 'Advanced Tree Structures',
        topics: [
          { name: 'AVL Trees', difficulty: 'Hard', estimatedTime: '4 hours' },
          { name: 'Red-Black Trees', difficulty: 'Hard', estimatedTime: '4 hours' },
          { name: 'B-Trees', difficulty: 'Medium', estimatedTime: '3 hours' },
          { name: 'Tree Balancing Techniques', difficulty: 'Hard', estimatedTime: '3 hours' }
        ],
        resources: ['Video Lectures', 'Practice Problems', 'Visualization Tools']
      },
      {
        week: 'Week 3-4',
        title: 'Graph Algorithms',
        topics: [
          { name: 'DFS Implementation', difficulty: 'Medium', estimatedTime: '3 hours' },
          { name: 'BFS Applications', difficulty: 'Medium', estimatedTime: '3 hours' },
          { name: 'Shortest Path Algorithms', difficulty: 'Hard', estimatedTime: '4 hours' },
          { name: 'Minimum Spanning Trees', difficulty: 'Hard', estimatedTime: '4 hours' }
        ],
        resources: ['Interactive Tutorials', 'Coding Exercises', 'Real-world Applications']
      }
    ],
    ds: [
      {
        week: 'Week 1-2',
        title: 'Linear Data Structures',
        topics: [
          { name: 'Arrays and Strings', difficulty: 'Easy', estimatedTime: '3 hours' },
          { name: 'Linked Lists', difficulty: 'Medium', estimatedTime: '4 hours' },
          { name: 'Stacks', difficulty: 'Medium', estimatedTime: '3 hours' },
          { name: 'Queues', difficulty: 'Medium', estimatedTime: '3 hours' }
        ],
        resources: ['Practice Problems', 'Implementation Exercises', 'Visualization Tools']
      }
    ],
    // Add similar structures for other subjects
  };

  const handleTopicCompletion = (subjectId, weekIndex, topicIndex) => {
    setCompletedTopics(prev => ({
      ...prev,
      [`${subjectId}-${weekIndex}-${topicIndex}`]: !prev[`${subjectId}-${weekIndex}-${topicIndex}`]
    }));
  };

  const handleTakeTest = (topicName) => {
    navigate('/test', {
      state: {
        topicName: topicName,
        subject: selectedSubject
      }
    });
  };

  return (
    <div className="study-plan-container">
      <div className="study-plan-header">
        <h1>Interactive Learning Journey</h1>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="subject-selector"
        >
          <option value="">Choose Your Subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSubject && roadmaps[selectedSubject] && (
        <>
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowRoadmapModal(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg 
              hover:bg-blue-700 transition-all duration-200 flex items-center gap-2
              shadow-md hover:shadow-lg"
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Visualize Complete Roadmap
            </button>
          </div>

          {showRoadmapModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="relative bg-white rounded-lg max-w-7xl max-h-[90vh] overflow-auto">
                <button
                  onClick={() => setShowRoadmapModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Complete DSA Roadmap</h2>
                  <img 
                    src="/roadmap-image.png" 
                    alt="DSA Roadmap" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="roadmap-timeline">
            {roadmaps[selectedSubject].map((section, weekIndex) => (
              <div key={weekIndex} className="timeline-section">
                <div className="timeline-header">
                  <h2>{section.week}</h2>
                  <h3>{section.title}</h3>
                </div>

                <div className="topics-container">
                  {section.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="topic-card">
                      <div className="topic-header">
                        <h4>{topic.name}</h4>
                        <span className={`difficulty-badge ${topic.difficulty.toLowerCase()}`}>
                          {topic.difficulty}
                        </span>
                      </div>

                      <div className="topic-details">
                        <p>
                          <i className="far fa-clock"></i>
                          Estimated Time: {topic.estimatedTime}
                        </p>
                        
                        <div className="topic-actions">
                          <label className="completion-checkbox">
                            <input
                              type="checkbox"
                              checked={completedTopics[`${selectedSubject}-${weekIndex}-${topicIndex}`] || false}
                              onChange={() => handleTopicCompletion(selectedSubject, weekIndex, topicIndex)}
                            />
                            Mark as Complete
                          </label>
                          
                          <button 
                            className="take-test-btn bg-blue-500 text-white px-4 py-2 rounded-md 
                            hover:bg-blue-600 transition-duration-200 flex items-center gap-2"
                            onClick={() => handleTakeTest(topic.name)}
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            Take Test
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="resources-section">
                  <h4>Learning Resources</h4>
                  <ul>
                    {section.resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudyPlan; 