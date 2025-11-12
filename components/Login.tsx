import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { login } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
  onSwitchToHome: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup, onSwitchToForgotPassword, onSwitchToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    const user = login(email, password);
    if (user) {
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      onLogin(user);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-teal-400">Welcome Back</h2>
        {error && <p className="text-red-500 text-center bg-red-100/10 border border-red-500 p-2 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-500 rounded bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">Remember me</label>
            </div>
            <div className="text-sm">
              <button type="button" onClick={onSwitchToForgotPassword} className="font-medium text-teal-400 hover:underline">
                Forgot your password?
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300">
            Login
          </button>
        </form>
        <div className="text-center text-gray-400 space-y-2">
            <p>
                Don't have an account?{' '}
                <button onClick={onSwitchToSignup} className="font-medium text-teal-400 hover:underline">
                    Sign up
                </button>
            </p>
            <p>
                 <button onClick={onSwitchToHome} className="font-medium text-teal-400 hover:underline">
                    &larr; Back to Home
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;