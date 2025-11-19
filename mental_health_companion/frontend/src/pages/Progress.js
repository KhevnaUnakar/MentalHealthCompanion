import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { moodAPI } from '../services/api';
import { journalAPI } from '../services/journalAPI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Progress.css';

function Progress() {
  const [moodData, setMoodData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [meditationStats, setMeditationStats] = useState(null);
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [moodHistory, moodAnalytics, medStats, journalEntries] = await Promise.all([
        moodAPI.getHistory(30),
        moodAPI.getAnalytics(30),
        journalAPI.getMeditationStats(),
        journalAPI.getEntries()
      ]);
      
      setMoodData(moodHistory.data);
      setAnalytics(moodAnalytics.data);
      setMeditationStats(medStats.data);
      setJournalCount(journalEntries.data.length);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const getMoodScore = (mood) => {
    const scores = { happy: 5, neutral: 3, stressed: 2, anxious: 2, sad: 1, angry: 1 };
    return scores[mood] || 3;
  };

  const chartData = moodData.slice(0, 14).reverse().map(entry => ({
    date: new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: getMoodScore(entry.mood)
  }));

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="page-title">📊 Progress Dashboard</h1>

        <div className="progress-grid">
          <div className="progress-card">
            <div className="card-icon">📝</div>
            <div className="card-content">
              <div className="card-value">{journalCount}</div>
              <div className="card-label">Journal Entries</div>
            </div>
          </div>

          <div className="progress-card">
            <div className="card-icon">🧘</div>
            <div className="card-content">
              <div className="card-value">{meditationStats?.total_sessions || 0}</div>
              <div className="card-label">Meditation Sessions</div>
            </div>
          </div>

          <div className="progress-card">
            <div className="card-icon">⏱️</div>
            <div className="card-content">
              <div className="card-value">{meditationStats?.total_minutes || 0}</div>
              <div className="card-label">Minutes Meditated</div>
            </div>
          </div>

          <div className="progress-card">
            <div className="card-icon">😊</div>
            <div className="card-content">
              <div className="card-value">{analytics?.total_entries || 0}</div>
              <div className="card-label">Mood Check-ins</div>
            </div>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="card">
            <h2>Mood Trend (Last 14 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#667eea" strokeWidth={2} name="Mood Score" />
              </LineChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <span>1 = Low mood</span>
              <span>5 = Great mood</span>
            </div>
          </div>
        )}

        {analytics && analytics.mood_distribution.length > 0 && (
          <div className="card">
            <h2>Mood Distribution</h2>
            <div className="mood-bars">
              {analytics.mood_distribution.map(item => (
                <div key={item.mood} className="mood-bar-container">
                  <div className="mood-bar-label">{item.mood}</div>
                  <div className="mood-bar-wrapper">
                    <div 
                      className="mood-bar" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="mood-bar-value">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card insights">
          <h2>💡 Insights</h2>
          <ul>
            <li>You've been consistent with your mental health journey! Keep it up! 🎉</li>
            {meditationStats?.total_sessions > 5 && (
              <li>Great meditation practice! Regular meditation can reduce stress by up to 30%.</li>
            )}
            {journalCount > 10 && (
              <li>Journaling regularly helps process emotions and improve self-awareness.</li>
            )}
            <li>Remember: Progress isn't always linear. Every step counts! 💪</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Progress;
