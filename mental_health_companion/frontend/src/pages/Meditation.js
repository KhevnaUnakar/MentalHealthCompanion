import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { journalAPI } from '../services/journalAPI';
import './Meditation.css';

function Meditation() {
  const [sessionType, setSessionType] = useState('breathing');
  const [duration, setDuration] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [stats, setStats] = useState(null);
  const intervalRef = useRef(null);

  const sessionTypes = [
    { value: 'breathing', label: '🌬️ Breathing Exercise', durations: [180, 300, 600] },
    { value: 'meditation', label: '🧘 Meditation', durations: [300, 600, 900, 1200] },
    { value: 'mindfulness', label: '🌸 Mindfulness', durations: [300, 600, 900] },
  ];

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const loadStats = async () => {
    try {
      const response = await journalAPI.getMeditationStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const startSession = () => {
    setIsActive(true);
    setTimeLeft(duration);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const handleComplete = async () => {
    setIsActive(false);
    try {
      await journalAPI.createMeditationSession({
        session_type: sessionType,
        duration: duration,
        notes: ''
      });
      loadStats();
      alert('🎉 Session complete! Great job!');
      setTimeLeft(duration);
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstructions = () => {
    const cycle = timeLeft % 16;
    if (cycle < 4) return '🌬️ Breathe In...';
    if (cycle < 8) return '⏸️ Hold...';
    if (cycle < 16) return '💨 Breathe Out...';
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="page-title">🧘 Meditation & Mindfulness</h1>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total_sessions}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.total_minutes}</div>
              <div className="stat-label">Minutes Meditated</div>
            </div>
          </div>
        )}

        <div className="meditation-container">
          <div className="session-selector">
            <h2>Choose Your Practice</h2>
            {sessionTypes.map(type => (
              <button
                key={type.value}
                className={`session-type-btn ${sessionType === type.value ? 'active' : ''}`}
                onClick={() => setSessionType(type.value)}
                disabled={isActive}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="duration-selector">
            <h3>Duration</h3>
            <div className="duration-buttons">
              {sessionTypes.find(t => t.value === sessionType)?.durations.map(d => (
                <button
                  key={d}
                  className={`duration-btn ${duration === d ? 'active' : ''}`}
                  onClick={() => setDuration(d)}
                  disabled={isActive}
                >
                  {d / 60} min
                </button>
              ))}
            </div>
          </div>

          <div className="timer-display">
            <div className="timer-circle">
              <div className="timer-text">{formatTime(timeLeft)}</div>
              {isActive && sessionType === 'breathing' && (
                <div className="breathing-instruction">{getBreathingInstructions()}</div>
              )}
            </div>
          </div>

          <div className="timer-controls">
            {!isActive ? (
              <button onClick={startSession} className="btn btn-primary btn-large">
                Start Session
              </button>
            ) : (
              <>
                <button onClick={pauseSession} className="btn btn-secondary">
                  Pause
                </button>
                <button onClick={resetSession} className="btn btn-secondary">
                  Reset
                </button>
              </>
            )}
          </div>

          <div className="meditation-tips card">
            <h3>💡 Tips for {sessionType}</h3>
            {sessionType === 'breathing' && (
              <ul>
                <li>Find a comfortable seated position</li>
                <li>Follow the breathing pattern: 4 seconds in, 4 hold, 8 out</li>
                <li>Focus on the sensation of breath</li>
              </ul>
            )}
            {sessionType === 'meditation' && (
              <ul>
                <li>Sit comfortably with your back straight</li>
                <li>Close your eyes or soften your gaze</li>
                <li>Focus on your breath or a mantra</li>
                <li>Gently return when your mind wanders</li>
              </ul>
            )}
            {sessionType === 'mindfulness' && (
              <ul>
                <li>Be present in the current moment</li>
                <li>Notice thoughts without judgment</li>
                <li>Observe sensations in your body</li>
                <li>Practice acceptance and compassion</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meditation;
