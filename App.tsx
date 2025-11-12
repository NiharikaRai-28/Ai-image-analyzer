import React, { useState, useEffect, useCallback } from 'react';
import { User, Category } from './types';
import { getCurrentUser, logout } from './services/authService';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ImageAnalyzer from './components/ImageAnalyzer';
import Header from './components/Header';
import Chat from './components/Chat';
import ForgotPassword from './components/ForgotPassword';

type View = 'home' | 'login' | 'signup' | 'dashboard' | 'analyzer' | 'chat' | 'forgotPassword';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setView('dashboard');
    } else {
      setView('home');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setView('home');
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setView('analyzer');
  };

  const handleBackToDashboard = useCallback(() => {
    setSelectedCategory(null);
    setView('dashboard');
  }, []);

  const handleNavigateToChat = () => {
    setView('chat');
  };

  const renderView = () => {
    if (!currentUser) {
      switch (view) {
        case 'login':
          return <Login onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} onSwitchToForgotPassword={() => setView('forgotPassword')} onSwitchToHome={() => setView('home')} />;
        case 'signup':
          return <Signup onSignupSuccess={() => setView('login')} onSwitchToLogin={() => setView('login')} />;
        case 'forgotPassword':
          return <ForgotPassword onSwitchToLogin={() => setView('login')} />;
        case 'home':
        default:
          return <Home onGetStarted={() => setView('login')} />;
      }
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard onSelectCategory={handleSelectCategory} />;
      case 'analyzer':
        return selectedCategory ? <ImageAnalyzer category={selectedCategory} onBack={handleBackToDashboard} /> : <Dashboard onSelectCategory={handleSelectCategory} />;
      case 'chat':
        return <Chat onBack={handleBackToDashboard} />;
      default:
        return <Dashboard onSelectCategory={handleSelectCategory} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {currentUser && <Header user={currentUser} onLogout={handleLogout} onNavigateToChat={handleNavigateToChat} />}
      <main className="container mx-auto p-4 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;