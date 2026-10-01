import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GAMES, CATEGORIES } from '../constants/games';
import { Play, Search, Clock, Zap, Brain, Target, ArrowUpRight, Star } from 'lucide-react';
import { sound } from '../utils/sound';

const CAT_COLORS = {
  memory:           { bg: '#5B4FE9', light: '#EAE8FF', text: '#fff' },
  speed:            { bg: '#FF5733', light: '#FFE8E3', text: '#fff' },
  attention:        { bg: '#00C896', light: '#D6F7EF', text: '#fff' },
  'problem-solving':{ bg: '#FFB800', light: '#FFF7D6', text: '#111' },
  language:         { bg: '#FF3864', light: '#FFE0E8', text: '#fff' },
  flexibility:      { bg: '#1A1A1A', light: '#E8E8E8', text: '#fff' },
};

const DIFF_LABEL = { 1: 'Kolay', 2: 'Orta', 3: 'Zor' };
const DIFF_DOTS  = { 1: 1,       2: 2,      3: 3      };

const CAT_ICONS = {
  memory: <Brain size={13} />,
  speed: <Zap size={13} />,
  attention: <Target size={13} />,
  'problem-solving': <Brain size={13} />,
  language: <Brain size={13} />,
  flexibility: <Zap size={13} />,
};

export default function GameMenu() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const initial   = location.state?.category || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initial);
  const [searchQuery,       setSearchQuery]       = useState('');

  const filteredGames = GAMES.filter((game) => {
    const matchCat  = selectedCategory === 'all' || game.category === selectedCategory;
    const matchName = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchName;
  });

  const handleGameSelect = (gameId) => {
    sound.playClick();
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto px-5 pt-10 pb-20">

        {/* ── HEADER ───────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
            {GAMES.length} Egzersiz · 6 Kategori
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-ink">Oyun Kataloğu</h1>
          <p className="text-ink-2 text-base mt-2 font-medium">
            Bilişsel becerilerini geliştirmek için bir oyun seç ve oynamaya başla.
          </p>
        </div>

        {/* ── FİLTRE + ARAMA ÇUBUĞU ───────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">

          {/* Kategori pilleri */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const col = CAT_COLORS[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => { sound.playClick(); setSelectedCategory(cat.id); }}
                  className={`cat-tab ${isActive ? 'active' : ''}`}
                  style={isActive && col ? { backgroundColor: col.bg, color: col.text || '#fff', border: 'none' } : {}}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Arama */}
          <div className="relative w-full md:w-64 flex-shrink-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
            <input
              type="text"
              placeholder="Oyun ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-ink/12 rounded-xl pl-9 pr-4 py-2.5 text-sm text-ink placeholder-mist focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            />
          </div>
        </div>

        {/* ── OYUN KARTI IZGARASI ──────────────────────────────── */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-lg font-bold text-ink-2">Sonuç bulunamadı</div>
            <div className="text-sm text-mist mt-1">Farklı bir arama dene veya filtreyi temizle.</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGames.map((game) => {
              const col = CAT_COLORS[game.category] || CAT_COLORS.memory;
              const dots = DIFF_DOTS[game.difficulty] || 1;
              return (
                <div
                  key={game.id}
                  onClick={() => handleGameSelect(game.id)}
                  className="game-card group flex flex-col"
                >
                  {/* Renkli üst bölüm — büyük icon */}
                  <div
                    className="h-28 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: col.bg }}
                  >
                    {/* Sağ üst köşe ışık efekti */}
                    <div
                      className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20"
                      style={{ backgroundColor: '#fff' }}
                    />
                    {/* Sol alt köşe ışık efekti */}
                    <div
                      className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-15"
                      style={{ backgroundColor: '#fff' }}
                    />
                    <span
                      className="text-5xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 select-none drop-shadow-sm relative z-10"
                    >
                      {game.icon}
                    </span>

                    {/* Zorluk yıldızları — sağ alt */}
                    <div className="absolute bottom-1.5 right-2 flex gap-0.5">
                      {[1, 2, 3].map((d) => (
                        <Star
                          key={d}
                          size={15}
                          strokeWidth={1.5}
                          style={{
                            fill: d <= dots ? '#FFD700' : 'rgba(0,0,0,0.25)',
                            color: d <= dots ? '#FFD700' : 'rgba(0,0,0,0.25)',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Alt bilgi */}
                  <div className="p-3.5 flex flex-col flex-1 bg-transparent">
                    {/* Kategori etiketi */}
                    <div
                      className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider mb-1.5 px-1.5 py-0.5 rounded-md w-fit"
                      style={{ backgroundColor: col.light, color: col.bg }}
                    >
                      {CAT_ICONS[game.category]}
                      {game.categoryLabel}
                    </div>

                    {/* Oyun adı */}
                    <h3 className="font-bold text-ink text-sm leading-snug mb-auto line-clamp-2">
                      {game.name}
                    </h3>

                    {/* Alt meta: süre + zorluk */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-ink/8">
                      <div className="flex items-center gap-1 text-mist text-[11px]">
                        <Clock size={10} />
                        <span>{game.timeLimit || 60}s</span>
                      </div>
                      <div
                        className="text-[11px] font-bold"
                        style={{ color: col.bg }}
                      >
                        {DIFF_LABEL[game.difficulty] || 'Orta'}
                      </div>
                    </div>
                  </div>

                  {/* Hover — Oyna butonu */}
                  <div
                    className="px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{ backgroundColor: col.bg }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Play size={11} fill="currentColor" />
                      Oyna
                    </span>
                    <ArrowUpRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sonuç sayısı */}
        {filteredGames.length > 0 && (
          <div className="mt-8 text-sm text-mist text-center">
            {filteredGames.length} egzersiz gösteriliyor
          </div>
        )}
      </div>
    </div>
  );
}
