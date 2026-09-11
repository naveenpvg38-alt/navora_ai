import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import AuthModal from './components/AuthModal';
import Home from './components/Home';
import Planner from './components/Planner';
import GenerationLoader from './components/GenerationLoader';
import ItineraryView from './components/ItineraryView';
import Profile from './components/Profile';
import Footer from './components/Footer';
import ScrollLoadIndicator from './components/ScrollLoadIndicator';
import LoginPage from './components/LoginPage';
import { api } from './api';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('home'); // 'home', 'planner', 'itinerary', 'profile', 'saved'
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [pendingPreferences, setPendingPreferences] = useState({});
  const [plannerInitialPrefs, setPlannerInitialPrefs] = useState({});

  // Check existing session on load
  useEffect(() => {
    const token = localStorage.getItem('navora_token');
    if (!token || token.startsWith('mock_jwt_')) {
      localStorage.removeItem('navora_token');
      localStorage.removeItem('navora_user');
      setUser(null);
      return;
    }

    api.getMe()
      .then((res) => {
        if (res && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('navora_token');
          localStorage.removeItem('navora_user');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('navora_token');
        localStorage.removeItem('navora_user');
        setUser(null);
      });
  }, []);

  const [postAuthRedirect, setPostAuthRedirect] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  const handleOpenAuth = (mode = 'login', redirectView = null) => {
    setPostAuthRedirect(redirectView);
    setAuthMode(mode);
    setActiveView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
    setPostAuthRedirect(null);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    const destination = postAuthRedirect || 'home';
    setPostAuthRedirect(null);
    setActiveView(destination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (user) {
      // If user is already logged in -> directly discover the website
      setActiveView('planner');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If user didn't login -> prompt login/signup, then automatically redirect to discover website
      handleOpenAuth('signup', 'planner');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('navora_token');
    localStorage.removeItem('navora_user');
    setUser(null);
    setActiveView('home');
  };

  const handleStartPlanning = () => {
    setActiveView('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickTemplate = (preset) => {
    setPlannerInitialPrefs(preset);
    setActiveView('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGeneratePlan = async (preferences) => {
    setPendingPreferences(preferences);
    setIsGenerating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // Simulate minimum 2.5s for the immersive AI multi-step animation
      const [planResult] = await Promise.all([
        api.generatePlan(preferences),
        new Promise((resolve) => setTimeout(resolve, 2800))
      ]);

      setCurrentPlan(planResult);
      setActiveView('itinerary');
    } catch (err) {
      alert(err.message || 'Failed to generate plan.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async (planToSave) => {
    try {
      const res = await api.savePlan(planToSave);
      setCurrentPlan((prev) => ({
        ...prev,
        plan_id: res.plan_id
      }));
      return res;
    } catch (err) {
      alert(err.message || 'Failed to save plan.');
    }
  };

  const handleToggleFavourite = async (planId) => {
    try {
      const res = await api.toggleFavourite(planId);
      setCurrentPlan((prev) => (prev ? { ...prev, is_favourite: res.is_favourite } : prev));
    } catch (err) {
      console.error('Favourite error:', err);
    }
  };

  const handleToggleComplete = async (planId) => {
    try {
      const res = await api.toggleComplete(planId);
      setCurrentPlan((prev) => (prev ? { ...prev, is_completed: res.is_completed } : prev));
    } catch (err) {
      console.error('Complete error:', err);
    }
  };

  const handleSelectSavedPlan = (plan) => {
    setCurrentPlan(plan);
    setActiveView('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* 2. Dedicated Login Portal View (Full-page experience) */}
      {activeView === 'login' ? (
        <LoginPage
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
          onBack={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreAsGuest={handleStartPlanning}
        />
      ) : (
        <>
          {/* Top Navigation Bar & Cyber Scroll-Load Indicator */}
          <Navbar
            activeView={activeView}
            setActiveView={setActiveView}
            user={user}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onGetStarted={handleGetStarted}
          />
          <ScrollLoadIndicator />

          {/* Main Views */}
          <main className="flex-grow pt-16 sm:pt-20">
            {isGenerating ? (
              <GenerationLoader preferences={pendingPreferences} />
            ) : (
              <div key={activeView} className="animate-fade-up md:pb-0 pb-24">
                {activeView === 'home' && (
                  <Home
                    user={user}
                    onGetStarted={handleGetStarted}
                    onStartPlanning={handleStartPlanning}
                    onQuickTemplate={handleQuickTemplate}
                  />
                )}

                {activeView === 'planner' && (
                  <Planner
                    onGenerate={handleGeneratePlan}
                    initialPreferences={plannerInitialPrefs}
                  />
                )}

                {activeView === 'itinerary' && (
                  <ItineraryView
                    plan={currentPlan}
                    user={user}
                    onSave={handleSavePlan}
                    onToggleFavourite={handleToggleFavourite}
                    onToggleComplete={handleToggleComplete}
                    onBack={() => setActiveView('planner')}
                    onOpenAuth={handleOpenAuth}
                  />
                )}

                {activeView === 'profile' && user && (
                  <Profile
                    user={user}
                    onSelectPlan={handleSelectSavedPlan}
                    onLogout={handleLogout}
                    defaultTab="saved"
                    onOpenPlanner={handleStartPlanning}
                  />
                )}

                {activeView === 'saved' && user && (
                  <Profile
                    user={user}
                    onSelectPlan={handleSelectSavedPlan}
                    onLogout={handleLogout}
                    defaultTab="saved"
                    onOpenPlanner={handleStartPlanning}
                  />
                )}
              </div>
            )}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav
            activeView={activeView}
            setActiveView={setActiveView}
            user={user}
            onOpenAuth={handleOpenAuth}
          />

          {/* Informative Footer */}
          <Footer
            setActiveView={setActiveView}
            onOpenAuth={handleOpenAuth}
            user={user}
          />
        </>
      )}
    </div>
  );
}
