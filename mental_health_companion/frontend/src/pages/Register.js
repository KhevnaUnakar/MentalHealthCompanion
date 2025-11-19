import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authAPI.register({ username, email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data) {
        const errors = err.response.data;
        if (errors.username) {
          setError(`Username: ${errors.username[0]}`);
        } else if (errors.email) {
          setError(`Email: ${errors.email[0]}`);
        } else if (errors.password) {
          setError(`Password: ${errors.password[0]}`);
        } else {
          setError('Registration failed. Please check your information.');
        }
      } else {
        setError('Cannot connect to server. Please make sure the backend is running.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-[#667EEA] to-[#764BA2] relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-gradient-radial from-white/10 to-transparent animate-float"></div>
      <div className="absolute bottom-[-50%] left-[-50%] w-full h-full bg-gradient-radial from-white/8 to-transparent animate-float-reverse"></div>
      
      <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-md relative z-10 animate-slideUp">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2 tracking-tight">
          Create Account
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm">
          Start your mental wellness journey
        </p>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 rounded-lg mb-5 text-sm font-medium animate-shake">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-3 focus:ring-purple-500/20 focus:border-[#667EEA] transition-all duration-300"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-3 focus:ring-purple-500/20 focus:border-[#667EEA] transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-3 focus:ring-purple-500/20 focus:border-[#667EEA] transition-all duration-300"
          />
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-3.5 rounded-lg text-sm font-semibold hover:from-[#5568D3] hover:to-[#6A3F8F] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg mt-6"
          >
            Register
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#667EEA] font-semibold hover:text-[#5568D3] hover:underline transition-colors">
            Login
          </Link>
        </p>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, -30px); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 25s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease;
        }
        .animate-shake {
          animation: shake 0.5s ease;
        }
      `}</style>
    </div>
  );
}

export default Register;
