import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameEngine } from '../hooks/useGameEngine';
import { GameContext } from '../games/GameContext';
import FeedbackBadge from './FeedbackBadge';
import { Play, RotateCcw, ArrowLeft, BarChart2, Clock, Award, Star } from 'lucide-react';
import { sound } from '../utils/sound';

export default function GameWrapper({ game, children }) {
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);

  const engine = useGameEngine({
    gameId: game.id,
    timeLimit: game.timeLimit || 60,
  });

  const {
    status,
    score,
    timeLeft,
    countdown,
    startGame,
    endGame,
    addScore,
    comparisonData,
    loadingComparison,
    scoreFlash,
    timeFlash,
  } = engine;

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };

  const enhancedAddScore = (points) => {
    if (points < 0) {
      triggerShake();
    }
    addScore(points);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GameContext.Provider value={{ ...engine, addScore: enhancedAddScore, triggerShake }}>
      <div className={`min-h-[85vh] flex flex-col justify-center items-center p-4 relative ${timeLeft <= 10 && status === 'playing' ? 'animate-red-pulse' : ''}`}>
        {/* BACK BUTTON */}
        <button
          onClick={() => {
            sound.playClick();
            navigate('/games');
          }}
          className="absolute top-4 left-4 flex items-center gap-2 text-black bg-white border-2 border-black px-3.5 py-2 rounded-xl text-xs font-black shadow-brutal hover:bg-neo-yellow transition-all"
        >
          <ArrowLeft size={16} />
          <span>Oyun Kataloğu</span>
        </button>

        {/* ─── 1. IDLE STATE ───────────────────────────────────────────────── */}
        {status === 'idle' && (
          <div className="max-w-md w-full bg-white border-[3px] border-black rounded-3xl p-8 shadow-brutal-lg text-center animate-fade-in">
            <div
              className="w-24 h-24 mx-auto rounded-3xl border-[3px] border-black flex items-center justify-center text-5xl mb-4 shadow-brutal"
              style={{ backgroundColor: `${game.color}30` }}
            >
              {game.icon}
            </div>

            <h1 className="text-3xl font-black text-black mb-2">{game.name}</h1>

            <div className="flex items-center justify-center gap-2 mb-4">
              <span
                className="px-3 py-1 rounded-xl text-xs font-black border-2 border-black shadow-brutal-sm"
                style={{ backgroundColor: `${game.color}30` }}
              >
                {game.categoryLabel || game.category}
              </span>

              <div className="flex items-center gap-1 bg-neo-yellow border-2 border-black px-3 py-1 rounded-xl text-xs font-black shadow-brutal-sm">
                <Star size={14} fill="currentColor" />
                <span>Zorluk: {game.difficulty}/3</span>
              </div>
            </div>

            <p className="text-black text-sm font-semibold mb-6 bg-neo-bg p-4 rounded-2xl border-2 border-black">
              {game.description}
            </p>

            <div className="flex items-center justify-center gap-6 mb-8 text-xs font-black text-black">
              <div className="flex items-center gap-1.5 bg-neo-blue border-2 border-black px-3 py-1.5 rounded-xl shadow-brutal-sm">
                <Clock size={16} />
                <span>Süre: {game.timeLimit} sn</span>
              </div>
              <div className="flex items-center gap-1.5 bg-neo-purple border-2 border-black px-3 py-1.5 rounded-xl shadow-brutal-sm">
                <Award size={16} />
                <span>Hedef: Maksimum Skor</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full py-4 bg-neo-yellow border-[3px] border-black rounded-2xl font-black text-xl text-black shadow-brutal flex items-center justify-center gap-2 hover:bg-black hover:text-neo-yellow transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Play size={24} fill="currentColor" />
              <span>Oyunu Başlat</span>
            </button>
          </div>
        )}

        {/* ─── 2. COUNTDOWN STATE ───────────────────────────────────────────── */}
        {status === 'countdown' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="text-9xl font-black text-neo-yellow bg-black border-4 border-white rounded-3xl p-8 shadow-[8px_8px_0px_0px_#fff] animate-bounce">
              {countdown > 0 ? countdown : 'GO!'}
            </div>
            <p className="text-white mt-6 text-2xl font-black tracking-wider">{game.name} Başlıyor!</p>
          </div>
        )}

        {/* ─── 3. PLAYING STATE (VISUAL SCORE & TIME FLASH EFFECTS) ────────── */}
        {status === 'playing' && (
          <div className={`w-full max-w-4xl flex flex-col items-center ${isShaking ? 'animate-shake' : ''}`}>
            {/* HEADER */}
            <div className="w-full bg-white border-[3px] border-black rounded-2xl p-4 mb-6 flex items-center justify-between shadow-brutal">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{game.icon}</span>
                <div>
                  <h3 className="font-black text-black text-lg leading-none">{game.name}</h3>
                  <span className="text-xs font-bold text-slate-600">{game.categoryLabel}</span>
                </div>
              </div>

              {/* TIMER & SCORE WITH SUBTLE TEXT SCALING & COLOR FLASH */}
              <div className="flex items-center gap-4">
                {/* SÜRE KUTUSU (Yazı Rengi Kırmızı Olur & %15-20 Büyür) */}
                <div className="flex items-center gap-2 border-2 border-black px-4 py-2 rounded-xl font-mono text-lg font-black shadow-brutal-sm bg-neo-blue text-black">
                  <Clock size={20} className={timeFlash ? 'text-red-600 transition-colors' : 'text-black'} />
                  <span className={`inline-block transition-all duration-200 ${
                    timeFlash ? 'text-red-600 scale-120 font-black' : timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-black'
                  }`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {/* SKOR KUTUSU (+Puanda Yeşil, -Puanda Kırmızı Yazı Büyümesi %15-20) */}
                <div className="flex items-center gap-2 border-2 border-black px-4 py-2 rounded-xl font-mono text-lg font-black shadow-brutal-sm bg-neo-yellow text-black">
                  <Award size={20} className={scoreFlash === 'plus' ? 'text-emerald-600' : scoreFlash === 'minus' ? 'text-red-600' : 'text-black'} />
                  <span className={`inline-block transition-all duration-200 ${
                    scoreFlash === 'plus'
                      ? 'text-emerald-600 scale-120 font-black'
                      : scoreFlash === 'minus'
                      ? 'text-red-600 scale-120 font-black'
                      : 'text-black'
                  }`}>
                    {score}
                  </span>
                </div>

                <button
                  onClick={endGame}
                  className="bg-neo-red hover:bg-black hover:text-white border-2 border-black px-3 py-2 rounded-xl text-xs font-black shadow-brutal-sm transition-all"
                >
                  Bitir
                </button>
              </div>
            </div>

            {/* GAME CANVAS */}
            <div className="w-full bg-white border-[3px] border-black rounded-3xl p-6 shadow-brutal-lg min-h-[420px] flex items-center justify-center">
              {children}
            </div>
          </div>
        )}

        {/* ─── 4. FINISHED STATE ────────────────────────────────────────────── */}
        {status === 'finished' && (
          <div className="max-w-md w-full bg-white border-[3px] border-black rounded-3xl p-8 shadow-brutal-lg text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-neo-yellow border-[3px] border-black rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-brutal">
              🎉
            </div>

            <h2 className="text-3xl font-black text-black mb-1">Oyun Tamamlandı!</h2>
            <p className="text-slate-700 font-bold text-sm mb-6">{game.name} skorun hazır.</p>

            {/* SCORE DISPLAY */}
            <div className="bg-neo-purple border-[3px] border-black rounded-2xl p-6 mb-6 shadow-brutal">
              <span className="text-xs font-black uppercase tracking-wider block mb-1 text-black">
                TOPLAM SKOR
              </span>
              <span className="text-6xl font-black text-black">
                {score}
              </span>
            </div>

            {/* BIG DATA FEEDBACK BADGE */}
            {loadingComparison ? (
              <div className="p-4 bg-neo-blue border-2 border-black rounded-xl font-bold text-xs flex items-center justify-center gap-2 mb-6 shadow-brutal-sm">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Lumosity büyük verisiyle kıyaslanıyor...</span>
              </div>
            ) : (
              comparisonData && <FeedbackBadge data={comparisonData} />
            )}

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={startGame}
                className="w-full py-4 bg-neo-yellow border-[3px] border-black rounded-2xl font-black text-lg text-black shadow-brutal flex items-center justify-center gap-2 hover:bg-black hover:text-neo-yellow transition-all"
              >
                <RotateCcw size={20} />
                <span>Tekrar Oyna</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/games');
                  }}
                  className="py-3 bg-white hover:bg-slate-100 border-2 border-black text-black rounded-xl font-black text-sm shadow-brutal-sm"
                >
                  Oyun Kataloğu
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/dashboard');
                  }}
                  className="py-3 bg-neo-green hover:bg-black hover:text-white border-2 border-black text-black rounded-xl font-black text-sm shadow-brutal-sm flex items-center justify-center gap-1.5"
                >
                  <BarChart2 size={16} />
                  <span>Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameContext.Provider>
  );
}
