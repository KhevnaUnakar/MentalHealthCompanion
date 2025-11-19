import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './Wellness.css';

function Wellness() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [completedActivities, setCompletedActivities] = useState([]);

  const activities = [
    {
      category: '🎨 Creative',
      items: [
        { 
          title: 'Art Therapy', 
          description: 'Express yourself through drawing or painting', 
          duration: '30 min', 
          icon: '🎨',
          instructions: [
            'Gather art supplies (paper, colors, brushes)',
            'Find a quiet, comfortable space',
            'Let your emotions guide your creativity',
            'Don\'t judge your work - focus on the process',
            'Reflect on how you feel after creating'
          ],
          benefits: 'Reduces stress, improves self-awareness, processes emotions'
        },
        { 
          title: 'Music Therapy', 
          description: 'Listen to calming music or create your own', 
          duration: '20 min', 
          icon: '🎵',
          instructions: [
            'Choose calming music or nature sounds',
            'Use headphones for better immersion',
            'Close your eyes and focus on the sounds',
            'Notice how different melodies affect your mood',
            'Try humming or singing along'
          ],
          benefits: 'Lowers anxiety, improves mood, enhances relaxation'
        },
        { 
          title: 'Creative Writing', 
          description: 'Write poetry, stories, or free-form thoughts', 
          duration: '25 min', 
          icon: '✍️',
          instructions: [
            'Start with a prompt or free write',
            'Don\'t worry about grammar or structure',
            'Write continuously without stopping',
            'Express your deepest thoughts and feelings',
            'Read what you wrote and reflect'
          ],
          benefits: 'Clarifies thoughts, processes emotions, boosts creativity'
        },
        { 
          title: 'Coloring', 
          description: 'Mindful coloring for relaxation', 
          duration: '15 min', 
          icon: '🖍️',
          instructions: [
            'Choose a coloring book or print patterns',
            'Select colors that appeal to you',
            'Focus on staying within the lines',
            'Notice the repetitive, calming motion',
            'Appreciate your finished artwork'
          ],
          benefits: 'Reduces anxiety, improves focus, promotes mindfulness'
        },
      ]
    },
    {
      category: '🏃 Physical',
      items: [
        { 
          title: 'Yoga', 
          description: 'Gentle yoga for mind-body connection', 
          duration: '30 min', 
          icon: '🧘',
          instructions: [
            'Find a quiet space with a yoga mat',
            'Start with gentle stretches and breathing',
            'Move through poses slowly and mindfully',
            'Listen to your body - don\'t push too hard',
            'End with relaxation pose (Savasana)'
          ],
          benefits: 'Improves flexibility, reduces stress, enhances body awareness'
        },
        { 
          title: 'Walking', 
          description: 'Mindful walk in nature', 
          duration: '20 min', 
          icon: '🚶',
          instructions: [
            'Choose a peaceful outdoor location',
            'Walk at a comfortable, steady pace',
            'Notice your surroundings - sights, sounds, smells',
            'Focus on your breath and footsteps',
            'Leave your phone behind or on silent'
          ],
          benefits: 'Boosts mood, increases energy, clears mind'
        },
        { 
          title: 'Stretching', 
          description: 'Release tension with gentle stretches', 
          duration: '10 min', 
          icon: '🤸',
          instructions: [
            'Start with neck and shoulder rolls',
            'Stretch each major muscle group',
            'Hold each stretch for 20-30 seconds',
            'Breathe deeply throughout',
            'Never bounce or force a stretch'
          ],
          benefits: 'Releases muscle tension, improves circulation, reduces pain'
        },
        { 
          title: 'Dancing', 
          description: 'Move your body to uplifting music', 
          duration: '15 min', 
          icon: '💃',
          instructions: [
            'Put on your favorite upbeat music',
            'Move freely without judgment',
            'Let the music guide your movements',
            'Focus on having fun, not perfection',
            'Notice how your mood lifts'
          ],
          benefits: 'Releases endorphins, boosts mood, increases energy'
        },
      ]
    },
    {
      category: '🌿 Nature',
      items: [
        { 
          title: 'Nature Walk', 
          description: 'Connect with nature outdoors', 
          duration: '30 min', 
          icon: '🌳',
          instructions: [
            'Visit a park, forest, or natural area',
            'Walk slowly and observe your surroundings',
            'Touch trees, feel grass, listen to birds',
            'Practice grounding - feel earth beneath feet',
            'Take deep breaths of fresh air'
          ],
          benefits: 'Reduces stress, improves mood, enhances wellbeing'
        },
        { 
          title: 'Gardening', 
          description: 'Tend to plants and flowers', 
          duration: '25 min', 
          icon: '🌱',
          instructions: [
            'Water plants or tend to a garden',
            'Feel the soil in your hands',
            'Notice the growth and changes',
            'Remove weeds mindfully',
            'Appreciate the life you\'re nurturing'
          ],
          benefits: 'Reduces anxiety, provides purpose, connects with nature'
        },
        { 
          title: 'Stargazing', 
          description: 'Find peace under the night sky', 
          duration: '20 min', 
          icon: '⭐',
          instructions: [
            'Find a dark spot away from city lights',
            'Lie down or sit comfortably',
            'Let your eyes adjust to darkness',
            'Identify constellations or just observe',
            'Reflect on the vastness of the universe'
          ],
          benefits: 'Provides perspective, promotes awe, reduces stress'
        },
        { 
          title: 'Sunrise/Sunset', 
          description: 'Watch the beauty of nature', 
          duration: '15 min', 
          icon: '🌅',
          instructions: [
            'Find a good viewing spot',
            'Arrive early to watch the full transition',
            'Observe the changing colors',
            'Practice gratitude for the new day/night',
            'Take photos or just be present'
          ],
          benefits: 'Promotes mindfulness, inspires gratitude, calms mind'
        },
      ]
    },
    {
      category: '🧠 Mental',
      items: [
        { 
          title: 'Puzzles', 
          description: 'Engage your mind with puzzles', 
          duration: '20 min', 
          icon: '🧩',
          instructions: [
            'Choose a puzzle (jigsaw, crossword, sudoku)',
            'Find a comfortable, well-lit space',
            'Focus completely on the task',
            'Take breaks if frustrated',
            'Celebrate small victories'
          ],
          benefits: 'Improves focus, provides distraction, boosts problem-solving'
        },
        { 
          title: 'Reading', 
          description: 'Read an inspiring book', 
          duration: '30 min', 
          icon: '📚',
          instructions: [
            'Choose uplifting or educational material',
            'Find a cozy reading spot',
            'Eliminate distractions',
            'Take notes on meaningful passages',
            'Reflect on what you learned'
          ],
          benefits: 'Reduces stress, expands knowledge, improves focus'
        },
        { 
          title: 'Learning', 
          description: 'Learn something new', 
          duration: '25 min', 
          icon: '🎓',
          instructions: [
            'Choose a topic that interests you',
            'Watch a tutorial or read an article',
            'Take notes and practice',
            'Set small, achievable goals',
            'Celebrate your progress'
          ],
          benefits: 'Boosts confidence, provides purpose, stimulates mind'
        },
        { 
          title: 'Gratitude Practice', 
          description: 'List things you\'re grateful for', 
          duration: '10 min', 
          icon: '🙏',
          instructions: [
            'Get a journal or paper',
            'Write 5-10 things you\'re grateful for',
            'Be specific and detailed',
            'Include small and large things',
            'Read your list and feel the gratitude'
          ],
          benefits: 'Improves mood, shifts perspective, increases happiness'
        },
      ]
    },
    {
      category: '👥 Social',
      items: [
        { 
          title: 'Call a Friend', 
          description: 'Connect with someone you care about', 
          duration: '20 min', 
          icon: '📞',
          instructions: [
            'Choose someone you trust and enjoy',
            'Find a quiet place to talk',
            'Share how you\'re really feeling',
            'Listen actively to their response',
            'Express appreciation for their time'
          ],
          benefits: 'Reduces loneliness, provides support, strengthens bonds'
        },
        { 
          title: 'Join a Group', 
          description: 'Participate in a support group', 
          duration: '60 min', 
          icon: '👥',
          instructions: [
            'Find a local or online support group',
            'Attend regularly for best results',
            'Share your experiences if comfortable',
            'Listen to others with empathy',
            'Exchange contact info for support'
          ],
          benefits: 'Reduces isolation, provides understanding, builds community'
        },
        { 
          title: 'Volunteer', 
          description: 'Help others in your community', 
          duration: '120 min', 
          icon: '🤝',
          instructions: [
            'Find a cause you care about',
            'Commit to regular volunteering',
            'Focus on helping others',
            'Connect with fellow volunteers',
            'Reflect on the impact you\'re making'
          ],
          benefits: 'Provides purpose, boosts mood, creates connections'
        },
        { 
          title: 'Pet Therapy', 
          description: 'Spend time with animals', 
          duration: '30 min', 
          icon: '🐕',
          instructions: [
            'Spend time with your pet or visit a shelter',
            'Pet, play, or just sit together',
            'Notice the unconditional love',
            'Take a walk together if possible',
            'Appreciate the companionship'
          ],
          benefits: 'Reduces stress, lowers blood pressure, increases oxytocin'
        },
      ]
    },
  ];

  const handleStartActivity = (activity) => {
    if (!completedActivities.includes(activity.title)) {
      setCompletedActivities([...completedActivities, activity.title]);
      alert(`🎉 Great! You've started "${activity.title}". Enjoy your wellness activity!`);
    }
    setSelectedActivity(null);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="page-title">🌟 Wellness Activities</h1>
        
        <div className="wellness-intro card">
          <p>Explore activities that promote mental wellness and self-care. Choose what resonates with you today!</p>
        </div>

        {activities.map((category, idx) => (
          <div key={idx} className="wellness-category">
            <h2>{category.category}</h2>
            <div className="activities-grid">
              {category.items.map((activity, i) => (
                <div 
                  key={i} 
                  className="activity-card"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="activity-icon">{activity.icon}</div>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <div className="activity-duration">⏱️ {activity.duration}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {selectedActivity && (
          <div className="modal-overlay" onClick={() => setSelectedActivity(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedActivity(null)}>×</button>
              <div className="modal-icon">{selectedActivity.icon}</div>
              <h2>{selectedActivity.title}</h2>
              <p className="modal-description">{selectedActivity.description}</p>
              <div className="modal-duration">⏱️ Duration: {selectedActivity.duration}</div>
              
              <div className="modal-section">
                <h3>📋 Step-by-Step Instructions:</h3>
                <ol className="instructions-list">
                  {selectedActivity.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
              </div>

              <div className="modal-section benefits-section">
                <h3>✨ Benefits:</h3>
                <p>{selectedActivity.benefits}</p>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-primary btn-large" 
                  onClick={() => handleStartActivity(selectedActivity)}
                >
                  {completedActivities.includes(selectedActivity.title) ? '✅ Completed' : '🚀 Start Activity'}
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedActivity(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wellness;
