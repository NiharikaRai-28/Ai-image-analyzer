import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigateToChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigateToChat }) => {
  return (
    <header className="bg-gray-800 p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-xl md:text-2xl font-bold text-teal-400">
        AI Image Analyzer
      </h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
        <button
          onClick={onNavigateToChat}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Chat
        </button>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
