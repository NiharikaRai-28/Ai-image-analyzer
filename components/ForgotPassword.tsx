import React, { useState } from 'react';
import { findUserByEmail, updatePassword } from '../services/authService';

interface ForgotPasswordProps {
  onSwitchToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const userExists = findUserByEmail(email);
    if (userExists) {
      setStep(2);
    } else {
      setError('No account found with that email address.');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const success = updatePassword(email, password);
    if (success) {
      setSuccess('Your password has been reset successfully!');
      setStep(3);
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-center text-teal-400">Reset Password</h2>
            <p className="text-center text-gray-400">Enter your email to receive instructions.</p>
            {error && <p className="text-red-500 text-center bg-red-100/10 border border-red-500 p-2 rounded-md">{error}</p>}
            <form onSubmit={handleEmailSubmit} className="space-y-6">
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
              <button type="submit" className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300">
                Continue
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold text-center text-teal-400">Enter New Password</h2>
             {error && <p className="text-red-500 text-center bg-red-100/10 border border-red-500 p-2 rounded-md">{error}</p>}
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
               <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-300">New Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300">
                Reset Password
              </button>
            </form>
          </>
        )}
        {step === 3 && (
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-center text-teal-400">Success!</h2>
                <p className="text-gray-300">{success}</p>
                <button onClick={onSwitchToLogin} className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300">
                    Back to Login
                </button>
            </div>
        )}
        {step !== 3 && (
            <p className="text-center text-gray-400">
                Remember your password?{' '}
                <button onClick={onSwitchToLogin} className="font-medium text-teal-400 hover:underline">
                    Login
                </button>
            </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
