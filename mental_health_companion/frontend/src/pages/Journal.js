import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { journalAPI } from '../services/journalAPI';
import './Journal.css';

function Journal() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [tags, setTags] = useState('');
  const [editingId, setEditingId] = useState(null);

  const moods = ['happy', 'sad', 'anxious', 'angry', 'stressed', 'neutral', 'grateful', 'peaceful'];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await journalAPI.getEntries();
      setEntries(response.data);
    } catch (err) {
      console.error('Error loading entries:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { title, content, mood, tags };
      if (editingId) {
        await journalAPI.updateEntry(editingId, data);
      } else {
        await journalAPI.createEntry(data);
      }
      resetForm();
      loadEntries();
    } catch (err) {
      console.error('Error saving entry:', err);
    }
  };

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setTags(entry.tags);
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this entry?')) {
      try {
        await journalAPI.deleteEntry(id);
        loadEntries();
      } catch (err) {
        console.error('Error deleting entry:', err);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('neutral');
    setTags('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="journal-header">
          <h1 className="page-title">📝 My Journal</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ New Entry'}
          </button>
        </div>

        {showForm && (
          <div className="card journal-form">
            <h2>{editingId ? 'Edit Entry' : 'New Journal Entry'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                required
              />
              <div className="form-row">
                <div className="form-group">
                  <label>Mood</label>
                  <select value={mood} onChange={(e) => setMood(e.target.value)}>
                    {moods.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="work, family, health"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update' : 'Save'} Entry
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="journal-entries">
          {entries.length === 0 ? (
            <div className="card empty-state">
              <p>No journal entries yet. Start writing to track your thoughts and feelings!</p>
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="journal-entry-card">
                <div className="entry-header">
                  <h3>{entry.title}</h3>
                  <span className={`mood-badge mood-${entry.mood}`}>{entry.mood}</span>
                </div>
                <p className="entry-content">{entry.content}</p>
                {entry.tags && (
                  <div className="entry-tags">
                    {entry.tags.split(',').map((tag, i) => (
                      <span key={i} className="tag">{tag.trim()}</span>
                    ))}
                  </div>
                )}
                <div className="entry-footer">
                  <span className="entry-date">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                  <div className="entry-actions">
                    <button onClick={() => handleEdit(entry)} className="btn-icon">✏️</button>
                    <button onClick={() => handleDelete(entry.id)} className="btn-icon">🗑️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Journal;
