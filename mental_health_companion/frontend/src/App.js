import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import MoodTracker from './pages/MoodTracker';
import News from './pages/News';
import MoodGame from './pages/MoodGame';
import Journal from './pages/Journal';
import Meditation from './pages/Meditation';
import Progress from './pages/Progress';
import Resources from './pages/Resources';
import Wellness from './pages/Wellness';
import SelfCare from './pages/SelfCare';
import './App.css';
import './pages/DarkMode.css';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/chat/:sessionId?" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/mood-tracker" element={<PrivateRoute><MoodTracker /></PrivateRoute>} />
            <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
            <Route path="/mood-game" element={<PrivateRoute><MoodGame /></PrivateRoute>} />
            <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
            <Route path="/meditation" element={<PrivateRoute><Meditation /></PrivateRoute>} />
            <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
            <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
            <Route path="/wellness" element={<PrivateRoute><Wellness /></PrivateRoute>} />
            <Route path="/selfcare" element={<PrivateRoute><SelfCare /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
