import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      setMenuOpen(false);
    }
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => 
    `block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
      isActive(path)
        ? 'bg-primary text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-primary'
    }`;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors duration-300"
            onClick={handleNavClick}
          >
            <span className="text-2xl">🧠</span>
            <span>MindCare</span>
          </Link>
          
          {/* Right Side Buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 right-0 w-72 bg-white dark:bg-gray-800 shadow-2xl rounded-bl-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto transition-colors duration-300">
            <div className="p-4 space-y-1">
              {/* Main Navigation */}
              <div className="mb-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Main
                </p>
                <Link to="/dashboard" className={navLinkClass('/dashboard')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">🏠</span>
                    Dashboard
                  </span>
                </Link>
                <Link to="/mood-tracker" className={navLinkClass('/mood-tracker')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">📊</span>
                    Mood Tracker
                  </span>
                </Link>
                <Link to="/progress" className={navLinkClass('/progress')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">📈</span>
                    Progress
                  </span>
                </Link>
              </div>

              {/* Wellness Section */}
              <div className="mb-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Wellness
                </p>
                <Link to="/journal" className={navLinkClass('/journal')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">📝</span>
                    Journal
                  </span>
                </Link>
                <Link to="/meditation" className={navLinkClass('/meditation')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">🧘</span>
                    Meditation
                  </span>
                </Link>
                <Link to="/selfcare" className={navLinkClass('/selfcare')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">💆</span>
                    Self-Care
                  </span>
                </Link>
                <Link to="/wellness" className={navLinkClass('/wellness')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">🌟</span>
                    Wellness Activities
                  </span>
                </Link>
              </div>

              {/* Resources Section */}
              <div className="mb-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resources
                </p>
                <Link to="/resources" className={navLinkClass('/resources')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">📚</span>
                    Resources
                  </span>
                </Link>
                <Link to="/news" className={navLinkClass('/news')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">📰</span>
                    News
                  </span>
                </Link>
              </div>

              {/* Fun Section */}
              <div className="mb-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Activities
                </p>
                <Link to="/mood-game" className={navLinkClass('/mood-game')} onClick={handleNavClick}>
                  <span className="flex items-center">
                    <span className="mr-3">🎮</span>
                    Mood Game
                  </span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
