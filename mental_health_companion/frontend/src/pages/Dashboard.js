import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI, authAPI } from '../services/api';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const moods = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
    { value: 'angry', emoji: '😠', label: 'Angry' },
    { value: 'stressed', emoji: '😫', label: 'Stressed' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsRes, profileRes] = await Promise.all([
        chatAPI.getSessions(),
        authAPI.getProfile()
      ]);
      setSessions(sessionsRes.data);
      setUser(profileRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      if (err.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your session has expired. Please login again.');
        navigate('/login');
      }
    }
  };

  const startNewChat = async () => {
    if (!selectedMood) {
      alert('Please select a mood first');
      return;
    }
    try {
      const response = await chatAPI.createSession(selectedMood);
      console.log('Session created:', response.data);
      navigate(`/chat/${response.data.id}`);
    } catch (err) {
      console.error('Error creating session:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to create chat session. Please try again.');
      }
    }
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await chatAPI.deleteSession(sessionId);
        // Remove from local state
        setSessions(sessions.filter(s => s.id !== sessionId));
      } catch (err) {
        console.error('Error deleting session:', err);
        alert('Failed to delete conversation. Please try again.');
      }
    }
  };

  const clearAllSessions = async () => {
    if (sessions.length === 0) {
      alert('No conversations to clear.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete all ${sessions.length} conversations? This cannot be undone.`)) {
      try {
        // Delete all sessions
        await Promise.all(sessions.map(session => chatAPI.deleteSession(session.id)));
        setSessions([]);
        alert('All conversations cleared successfully!');
      } catch (err) {
        console.error('Error clearing sessions:', err);
        alert('Failed to clear all conversations. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-10 mb-8 animate-fadeInDown transition-colors duration-300">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">How are you feeling today?</p>
        </div>

        {/* Mood Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-10 mb-6 animate-fadeInUp transition-colors duration-300">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
            Select Your Mood
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
            {moods.map((mood) => (
              <div
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer
                  transition-all duration-300 transform hover:-translate-y-1
                  ${selectedMood === mood.value
                    ? 'border-primary bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-primary hover:bg-white dark:hover:bg-gray-600 hover:shadow-md'
                  }
                `}
              >
                <span className="text-5xl mb-3 transition-transform duration-300 hover:scale-110">
                  {mood.emoji}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{mood.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={startNewChat}
              disabled={!selectedMood}
              className="px-10 py-3.5 bg-primary text-white rounded-lg font-semibold text-sm
                hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                shadow-lg hover:shadow-xl"
            >
              Start New Chat
            </button>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Conversations</h2>
            {sessions.length > 0 && (
              <button
                onClick={clearAllSessions}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 border border-red-200 dark:border-red-800"
              >
                🗑️ Clear All
              </button>
            )}
          </div>
          {sessions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No conversations yet. Start your first chat above!
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center p-5 bg-white dark:bg-gray-700 rounded-xl
                    border border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-300
                    hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md group"
                >
                  <div 
                    onClick={() => navigate(`/chat/${session.id}`)}
                    className="flex-1 flex justify-between items-center"
                  >
                    <div>
                      <strong className="block text-gray-900 dark:text-white font-semibold mb-1 capitalize">
                        Mood: {session.mood}
                      </strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(session.updated_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xl text-primary font-semibold transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="ml-4 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                    title="Delete conversation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease 0.2s both;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
