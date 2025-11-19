import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './Resources.css';

function Resources() {
  const [activeCategory, setActiveCategory] = useState('articles');
  const [selectedResource, setSelectedResource] = useState(null);

  const resources = {
    articles: [
      { 
        title: 'Understanding Anxiety', 
        description: 'Learn about anxiety disorders and coping strategies', 
        link: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders', 
        icon: '📚',
        content: 'Comprehensive guide to understanding anxiety, its symptoms, and evidence-based treatment options.'
      },
      { 
        title: 'Depression: Signs and Support', 
        description: 'Recognizing depression and finding help', 
        link: 'https://www.nimh.nih.gov/health/topics/depression', 
        icon: '📖',
        content: 'Learn to identify depression symptoms and discover various treatment approaches and support resources.'
      },
      { 
        title: 'Stress Management Techniques', 
        description: 'Practical ways to manage daily stress', 
        link: 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/basics/stress-basics/hlv-20049495', 
        icon: '📝',
        content: 'Evidence-based stress management techniques you can use in your daily life.'
      },
      { 
        title: 'Building Resilience', 
        description: 'Strengthen your mental resilience', 
        link: 'https://www.apa.org/topics/resilience', 
        icon: '💪',
        content: 'Discover how to build psychological resilience and bounce back from life\'s challenges.'
      },
    ],
    videos: [
      { 
        title: 'Guided Meditation for Beginners', 
        description: '10-minute meditation session', 
        link: 'https://www.youtube.com/watch?v=ZToicYcHIOU', 
        icon: '🎥',
        content: 'Perfect introduction to meditation with step-by-step guidance for beginners.'
      },
      { 
        title: 'Breathing Exercises for Anxiety', 
        description: 'Learn effective breathing techniques', 
        link: 'https://www.youtube.com/watch?v=tybOi4hjZFQ', 
        icon: '🎬',
        content: 'Simple breathing exercises to help manage anxiety and promote relaxation.'
      },
      { 
        title: 'Mindfulness in Daily Life', 
        description: 'Practical mindfulness tips', 
        link: 'https://www.youtube.com/watch?v=F6eFFCi12v8', 
        icon: '📹',
        content: 'Learn how to incorporate mindfulness practices into your everyday routine.'
      },
    ],
    podcasts: [
      { 
        title: 'The Mental Health Podcast', 
        description: 'Weekly discussions on mental wellness', 
        link: 'https://open.spotify.com/show/2Yz8VPOdhVmFcHzgn8tTuM', 
        icon: '🎙️',
        content: 'In-depth conversations about mental health topics with experts and real stories.'
      },
      { 
        title: 'Ten Percent Happier', 
        description: 'Meditation and mindfulness podcast', 
        link: 'https://www.tenpercent.com/podcast', 
        icon: '🎧',
        content: 'Practical meditation advice and interviews with mindfulness experts.'
      },
      { 
        title: 'Therapy for Black Girls', 
        description: 'Mental health for women of color', 
        link: 'https://therapyforblackgirls.com/podcast/', 
        icon: '🎤',
        content: 'Addressing mental health topics specifically relevant to women of color.'
      },
    ],
    books: [
      { 
        title: 'The Anxiety and Worry Workbook', 
        description: 'By David A. Clark & Aaron T. Beck', 
        link: 'https://www.amazon.com/Anxiety-Worry-Workbook-Cognitive-Behavioral/dp/1462544002', 
        icon: '📕',
        content: 'Practical CBT techniques for managing anxiety and worry.'
      },
      { 
        title: 'Feeling Good: The New Mood Therapy', 
        description: 'By David D. Burns', 
        link: 'https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336', 
        icon: '📗',
        content: 'Classic book on cognitive behavioral therapy for depression.'
      },
      { 
        title: 'The Mindful Way Through Depression', 
        description: 'By Mark Williams', 
        link: 'https://www.amazon.com/Mindful-Way-Through-Depression-Unhappiness/dp/1593851286', 
        icon: '📘',
        content: 'Mindfulness-based approach to preventing depression relapse.'
      },
      { 
        title: 'Lost Connections', 
        description: 'By Johann Hari', 
        link: 'https://www.amazon.com/Lost-Connections-Uncovering-Depression-Unexpected/dp/1632868315', 
        icon: '📙',
        content: 'Explores the real causes of depression and anxiety in our modern world.'
      },
    ],
    worksheets: [
      { 
        title: 'Thought Record Sheet', 
        description: 'CBT worksheet for challenging thoughts', 
        link: '/worksheets/thought-record.pdf', 
        icon: '📄',
        content: 'Identify and challenge negative thought patterns using this CBT tool.',
        downloadable: true
      },
      { 
        title: 'Daily Mood Tracker', 
        description: 'Track your daily moods and triggers', 
        link: '/worksheets/mood-tracker.pdf', 
        icon: '📋',
        content: 'Monitor your mood patterns and identify triggers over time.',
        downloadable: true
      },
      { 
        title: 'Gratitude Journal Template', 
        description: 'Daily gratitude practice guide', 
        link: '/worksheets/gratitude-journal.pdf', 
        icon: '📃',
        content: 'Structured template for developing a daily gratitude practice.',
        downloadable: true
      },
      { 
        title: 'Coping Skills Toolbox', 
        description: 'Comprehensive list of healthy coping strategies', 
        link: '/worksheets/coping-skills.pdf', 
        icon: '✅',
        content: 'Build your personal toolkit of healthy coping mechanisms.',
        downloadable: true
      },
    ],
  };

  const categories = [
    { key: 'articles', label: '📚 Articles', icon: '📚' },
    { key: 'videos', label: '🎥 Videos', icon: '🎥' },
    { key: 'podcasts', label: '🎙️ Podcasts', icon: '🎙️' },
    { key: 'books', label: '📚 Books', icon: '📚' },
    { key: 'worksheets', label: '📄 Worksheets', icon: '📄' },
  ];

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="page-title">📚 Resources Library</h1>

        <div className="resources-tabs">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`tab-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="resources-grid">
          {resources[activeCategory].map((resource, index) => (
            <div key={index} className="resource-card" onClick={() => setSelectedResource(resource)}>
              <div className="resource-icon">{resource.icon}</div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <div className="resource-actions">
                <button className="resource-link">
                  {resource.downloadable ? '📥 Download' : '🔗 Learn More'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedResource && (
          <div className="modal-overlay" onClick={() => setSelectedResource(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedResource(null)}>×</button>
              <div className="modal-icon">{selectedResource.icon}</div>
              <h2>{selectedResource.title}</h2>
              <p className="modal-description">{selectedResource.description}</p>
              
              <div className="modal-section">
                <h3>📖 About this resource:</h3>
                <p>{selectedResource.content}</p>
              </div>

              <div className="modal-actions">
                <a 
                  href={selectedResource.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-large"
                  onClick={() => setSelectedResource(null)}
                >
                  {selectedResource.downloadable ? '📥 Download Resource' : '🚀 Open Resource'}
                </a>
                <button className="btn btn-secondary" onClick={() => setSelectedResource(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card crisis-resources">
          <h2>🆘 Crisis Resources</h2>
          <p>If you're in crisis or need immediate help:</p>
          <div className="crisis-contacts">
            <div className="crisis-item">
              <strong>National Suicide Prevention Lifeline</strong>
              <p>📞 1-800-273-8255 (Available 24/7)</p>
            </div>
            <div className="crisis-item">
              <strong>Crisis Text Line</strong>
              <p>📱 Text HOME to 741741</p>
            </div>
            <div className="crisis-item">
              <strong>Emergency Services</strong>
              <p>🚨 Call 911 for immediate emergency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
