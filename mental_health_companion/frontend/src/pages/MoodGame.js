import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './MoodGame.css';

function MoodGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const [options, setOptions] = useState([]);

  const emojiMoods = [
    { emoji: '😊', mood: 'Happy' },
    { emoji: '😢', mood: 'Sad' },
    { emoji: '😰', mood: 'Anxious' },
    { emoji: '😠', mood: 'Angry' },
    { emoji: '😫', mood: 'Stressed' },
    { emoji: '😐', mood: 'Neutral' },
    { emoji: '😴', mood: 'Tired' },
    { emoji: '🤗', mood: 'Loved' },
  ];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    generateQuestion();
  };

  const generateQuestion = () => {
    const correct = emojiMoods[Math.floor(Math.random() * emojiMoods.length)];
    setCurrentEmoji(correct);

    const wrongOptions = emojiMoods
      .filter(e => e.mood !== correct.mood)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [correct, ...wrongOptions]
      .sort(() => 0.5 - Math.random());

    setOptions(allOptions);
  };

  const handleAnswer = (selectedMood) => {
    if (selectedMood === currentEmoji.mood) {
      setScore(score + 1);
    }
    generateQuestion();
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="page-title">Mood Matching Game</h1>

        <div className="game-card">
          {!gameActive ? (
            <div className="game-start">
              <h2>Match the Emoji to the Mood!</h2>
              <p>Test your emotional intelligence by matching emojis to their moods.</p>
              {score > 0 && (
                <div className="final-score">
                  <h3>Final Score: {score}</h3>
                </div>
              )}
              <button onClick={startGame} className="btn btn-primary">
                Start Game
              </button>
            </div>
          ) : (
            <div className="game-active">
              <div className="game-header">
                <div className="score">Score: {score}</div>
                <div className="timer">Time: {timeLeft}s</div>
              </div>

              <div className="emoji-display">
                {currentEmoji && <span className="big-emoji">{currentEmoji.emoji}</span>}
              </div>

              <div className="options-grid">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.mood)}
                    className="option-btn"
                  >
                    {option.mood}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Why Play This Game?</h2>
          <p>
            Recognizing emotions is a key skill in mental health. This game helps you:
          </p>
          <ul>
            <li>Improve emotional awareness</li>
            <li>Practice identifying feelings</li>
            <li>Have fun while learning about emotions</li>
            <li>Take a break and relax</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MoodGame;
