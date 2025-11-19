import React, { useState, useEffect } from 'react';
import { moodAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './MoodTracker.css';

function MoodTracker() {
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);

  const COLORS = {
    happy: '#10b981',
    sad: '#3b82f6',
    anxious: '#f59e0b',
    angry: '#ef4444',
    stressed: '#8b5cf6',
    neutral: '#6b7280',
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsRes, historyRes] = await Promise.all([
        moodAPI.getAnalytics(30),
        moodAPI.getHistory(30)
      ]);
      setAnalytics(analyticsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error('Error loading mood data:', err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="page-title">Mood Tracker</h1>

        {analytics && analytics.mood_distribution.length > 0 ? (
          <>
            <div className="card">
              <h2>Mood Distribution (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.mood_distribution}
                    dataKey="count"
                    nameKey="mood"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.mood}: ${entry.percentage}%`}
                  >
                    {analytics.mood_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.mood]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="stats">
                <p>Total Entries: {analytics.total_entries}</p>
              </div>
            </div>

            <div className="card">
              <h2>Recent Mood Entries</h2>
              <div className="mood-history">
                {history.map((entry) => (
                  <div key={entry.id} className="mood-entry">
                    <div className="mood-badge" style={{ background: COLORS[entry.mood] }}>
                      {entry.mood}
                    </div>
                    <div className="mood-details">
                      {entry.notes && <p>{entry.notes}</p>}
                      <span className="date">
                        {new Date(entry.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card">
            <p>No mood data yet. Start chatting to track your moods!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodTracker;
