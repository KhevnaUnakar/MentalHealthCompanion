import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { journalAPI } from '../services/journalAPI';
import './SelfCare.css';

function SelfCare() {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activityType, setActivityType] = useState('physical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);

  const activityTypes = [
    { value: 'physical', label: '🏃 Physical', color: '#10b981' },
    { value: 'mental', label: '🧠 Mental', color: '#3b82f6' },
    { value: 'emotional', label: '❤️ Emotional', color: '#ef4444' },
    { value: 'social', label: '👥 Social', color: '#f59e0b' },
    { value: 'spiritual', label: '🙏 Spiritual', color: '#8b5cf6' },
  ];

  const suggestions = {
    physical: ['Exercise', 'Yoga', 'Walk', 'Dance', 'Stretch'],
    mental: ['Read', 'Puzzle', 'Learn', 'Meditate', 'Journal'],
    emotional: ['Therapy', 'Talk to friend', 'Cry', 'Laugh', 'Express feelings'],
    social: ['Call friend', 'Join group', 'Volunteer', 'Family time', 'Pet time'],
    spiritual: ['Pray', 'Meditate', 'Nature', 'Gratitude', 'Reflect'],
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await journalAPI.getSelfCareActivities();
      setActivities(response.data);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await journalAPI.createSelfCareActivity({
        activity_type: activityType,
        title,
        description,
        scheduled_date: scheduledDate
      });
      resetForm();
      loadActivities();
    } catch (err) {
      console.error('Error creating activity:', err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await journalAPI.completeActivity(id);
      loadActivities();
    } catch (err) {
      console.error('Error completing activity:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this activity?')) {
      try {
        await journalAPI.deleteActivity(id);
        loadActivities();
      } catch (err) {
        console.error('Error deleting activity:', err);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setScheduledDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const todayActivities = activities.filter(a => a.scheduled_date === new Date().toISOString().split('T')[0]);
  const upcomingActivities = activities.filter(a => a.scheduled_date > new Date().toISOString().split('T')[0]);
  const completedCount = activities.filter(a => a.completed).length;

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="selfcare-header">
          <h1 className="page-title">💆 Self-Care Planner</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ Add Activity'}
          </button>
        </div>

        <div className="selfcare-stats">
          <div className="stat-box">
            <div className="stat-number">{todayActivities.length}</div>
            <div className="stat-label">Today's Activities</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{upcomingActivities.length}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>

        {showForm && (
          <div className="card selfcare-form">
            <h2>Plan Self-Care Activity</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Activity Type</label>
                <div className="type-selector">
                  {activityTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      className={`type-btn ${activityType === type.value ? 'active' : ''}`}
                      onClick={() => setActivityType(type.value)}
                      style={{ borderColor: activityType === type.value ? type.color : '#e5e7eb' }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Quick Suggestions</label>
                <div className="suggestions">
                  {suggestions[activityType].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      className="suggestion-btn"
                      onClick={() => setTitle(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Activity title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />

              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Add Activity</button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {todayActivities.length > 0 && (
          <div className="activities-section">
            <h2>📅 Today's Self-Care</h2>
            <div className="activities-list">
              {todayActivities.map(activity => (
                <div key={activity.id} className={`activity-item ${activity.completed ? 'completed' : ''}`}>
                  <div className="activity-checkbox">
                    <input
                      type="checkbox"
                      checked={activity.completed}
                      onChange={() => !activity.completed && handleComplete(activity.id)}
                    />
                  </div>
                  <div className="activity-content">
                    <h3>{activity.title}</h3>
                    {activity.description && <p>{activity.description}</p>}
                    <span className="activity-type">{activityTypes.find(t => t.value === activity.activity_type)?.label}</span>
                  </div>
                  <button onClick={() => handleDelete(activity.id)} className="btn-icon">🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcomingActivities.length > 0 && (
          <div className="activities-section">
            <h2>📆 Upcoming Activities</h2>
            <div className="activities-list">
              {upcomingActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-content">
                    <h3>{activity.title}</h3>
                    {activity.description && <p>{activity.description}</p>}
                    <div className="activity-meta">
                      <span className="activity-type">{activityTypes.find(t => t.value === activity.activity_type)?.label}</span>
                      <span className="activity-date">📅 {new Date(activity.scheduled_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(activity.id)} className="btn-icon">🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activities.length === 0 && !showForm && (
          <div className="card empty-state">
            <p>No self-care activities planned yet. Start by adding your first activity!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelfCare;
