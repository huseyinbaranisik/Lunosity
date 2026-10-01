import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, LayoutGrid, BarChart3, Home, Volume2, VolumeX, Music, User, Sun, Moon } from 'lucide-react';
import { GAMES } from '../constants/games';
import { sound } from '../utils/sound';

export default function Navbar({ onOpenAuth, isDark, onToggleTheme }) {
  const location = useLocation();
  const [musicOn, setMusicOn] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const handleToggleMusic = () => {
    const isPlaying = sound.toggleMusic();
    setMusicOn(isPlaying);
    sound.playClick();
  };

  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setSoundOn(enabled);
    if (enabled) sound.playClick();
  };

  const navItems = [
    { path: '/',          label: 'Ana Sayfa', icon: <Home size={16} /> },
    { path: '/games',     label: 'Oyunlar',   icon: <LayoutGrid size={16} /> },
    { path: '/dashboard', label: 'Profil',    icon: <BarChart3 size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-xl border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          onClick={() => sound.playClick()}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-neo-yellow border-2 border-black flex items-center justify-center text-black font-extrabold shadow-brutal-sm group-hover:rotate-6 transition-transform">
            <Brain size={20} className="text-black" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-xl text-ink tracking-tight leading-none">LUNOCITY</span>
            <span className="border-2 border-black bg-neo-purple text-black px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#000] rotate-[-2deg]">
              v2.0 BETA
            </span>
          </div>
        </Link>

        {/* NAV LINKS — ortada */}
        <nav className="hidden md:flex items-center gap-1 bg-ink/5 px-1.5 py-1.5 rounded-2xl">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => sound.playClick()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-ink shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
                    : 'text-ink/60 hover:text-ink hover:bg-white/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* SAĞ KONTROLLER */}
        <div className="flex items-center gap-2">
          {/* Müzik */}
          <button
            onClick={handleToggleMusic}
            title={musicOn ? 'Müziği Kapat' : 'Arka Plan Müziği'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              musicOn
                ? 'bg-brand text-white shadow-[0_2px_8px_rgba(91,79,233,0.4)]'
                : 'bg-[#E6E0D4] text-slate-700 hover:bg-neo-purple hover:text-black dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-neo-purple dark:hover:text-black'
            }`}
          >
            <Music size={16} />
          </button>

          {/* Ses */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              soundOn
                ? 'bg-[#E6E0D4] text-slate-800 hover:bg-neo-green hover:text-black dark:bg-slate-800 dark:text-white dark:hover:bg-neo-green dark:hover:text-black'
                : 'bg-[#E6E0D4] text-slate-400 hover:bg-neo-red hover:text-black dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-neo-red dark:hover:text-black'
            }`}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* 🌙 / ☀️ Tema Toggle */}
          <button
            onClick={() => { sound.playClick(); onToggleTheme(); }}
            title={isDark ? 'Açık Temaya Geç' : 'Karanlık Temaya Geç'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isDark
                ? 'bg-neo-yellow text-black hover:bg-neo-orange shadow-[0_2px_8px_rgba(250,204,21,0.4)]'
                : 'bg-[#E6E0D4] text-slate-700 hover:bg-slate-800 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-neo-yellow dark:hover:text-black'
            }`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Profil */}
          <button
            onClick={() => { sound.playClick(); onOpenAuth(); }}
            className="navbar-auth-btn ml-1 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_2px_12px_rgba(91,79,233,0.4)]"
          >
            <User size={15} />
            <span className="hidden sm:inline">Giriş Yap</span>
          </button>
        </div>
      </div>

      {/* MOBİL NAV */}
      <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => sound.playClick()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-ink text-white'
                  : 'text-ink/60 hover:text-ink hover:bg-ink/8'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Mobilde tema toggle */}
        <button
          onClick={() => { sound.playClick(); onToggleTheme(); }}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            isDark
              ? 'bg-neo-yellow text-black'
              : 'text-ink/60 hover:text-ink hover:bg-ink/8'
          }`}
        >
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
          <span>{isDark ? 'Açık' : 'Koyu'}</span>
        </button>
      </div>
    </header>
  );
}
