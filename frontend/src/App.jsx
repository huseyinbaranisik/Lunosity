import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GameMenuPage from './pages/GameMenuPage';
import GamePage from './pages/GamePage';
import DashboardPage from './pages/DashboardPage';
import AuthModal from './components/AuthModal';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // ── TEMA YÖNETİMİ ──────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    // localStorage'dan oku, yoksa sistem tercihine bak
    const saved = localStorage.getItem('lunosity_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('lunosity_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    const visited = localStorage.getItem('lunosity_visited');
    if (!visited) {
      setIsAuthOpen(true);
    }
  }, []);

  const handleGuestLogin = () => {
    localStorage.setItem('lunosity_visited', 'true');
    localStorage.setItem(
      'lunosity_user',
      JSON.stringify({ name: 'Misafir Oyuncu 🚀', avatar: '🎮', isGuest: true })
    );
    setIsAuthOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-paper text-ink font-sans selection:bg-neo-yellow selection:text-black relative transition-colors duration-300">
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} isDark={isDark} onToggleTheme={toggleTheme} />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home onOpenAuth={() => setIsAuthOpen(true)} />} />
            <Route path="/games" element={<GameMenuPage />} />
            <Route path="/game/:gameId" element={<GamePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => {
            localStorage.setItem('lunosity_visited', 'true');
            setIsAuthOpen(false);
          }}
          onGuestLogin={handleGuestLogin}
        />
      </div>
    </Router>
  );
}
