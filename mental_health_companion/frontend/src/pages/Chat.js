import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Chat.css';

function Chat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cleanup speech synthesis on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSession = async () => {
    try {
      const response = await chatAPI.getSession(sessionId);
      setMessages(response.data.messages);
    } catch (err) {
      console.error('Error loading session:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
      }
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use a more natural voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Google')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeaking(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(sessionId, userMsg);
      // Use functional update to ensure we have the latest state
      setMessages(prevMessages => [...prevMessages, response.data.user_message, response.data.bot_message]);
      
      // Auto-speak bot response if enabled
      if (autoSpeak && response.data.bot_message?.content) {
        setTimeout(() => speakText(response.data.bot_message.content), 500);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
      } else {
        alert('Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCurrentSession = async () => {
    if (window.confirm('Are you sure you want to delete this conversation? This cannot be undone.')) {
      try {
        await chatAPI.deleteSession(sessionId);
        alert('Conversation deleted successfully!');
        navigate('/dashboard');
      } catch (err) {
        console.error('Error deleting session:', err);
        alert('Failed to delete conversation. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="chat-container">
        {/* Chat Header with Controls */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Session</h2>
          <div className="flex items-center gap-3">
            {/* Auto-speak Toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 border flex items-center gap-2 ${
                autoSpeak
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
              }`}
              title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              {autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
            </button>
            
            {/* Stop Speaking Button */}
            {speaking && (
              <button
                onClick={stopSpeaking}
                className="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300 border border-orange-200 dark:border-orange-800 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop
              </button>
            )}
            
            {/* Delete Button */}
            <button
              onClick={deleteCurrentSession}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 border border-red-200 dark:border-red-800 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Chat
            </button>
          </div>
        </div>
        <div className="chat-box">
          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  <div className="flex justify-between items-start gap-2">
                    <strong>{msg.sender === 'user' ? 'You' : 'Therapist Bot'}</strong>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakText(msg.content)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Read aloud"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p>{msg.content}</p>
                  <span className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-content">
                  <strong>Therapist Bot</strong>
                  <p className="typing">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="message-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
