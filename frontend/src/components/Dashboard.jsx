import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import {
  Trophy, Activity, Zap, Star, Users, Award, RefreshCw,
  Flame, Target, Trash2, CheckCircle2, Snowflake, Lock, Shield,
} from 'lucide-react';
import { GAMES } from '../constants/games';
import { sound } from '../utils/sound';

// ─── BAŞARIM SİSTEMİ ──────────────────────────────────────────────────────────
// Her başarımın id, başlık, açıklama, emoji, renk ve kilit açma koşulu var
const ALL_ACHIEVEMENTS = [
  // 🎮 Oyun Sayısı
  { id: 'first_game',     emoji: '⚡', title: 'İlk Adım',        desc: '1 egzersiz tamamla',         color: 'bg-neo-yellow', check: (s) => s.total >= 1 },
  { id: 'five_games',     emoji: '🎯', title: 'Isınma Turu',     desc: '5 egzersiz tamamla',         color: 'bg-neo-green',  check: (s) => s.total >= 5 },
  { id: 'ten_games',      emoji: '🏅', title: 'Demlenen Beyin',  desc: '10 egzersiz tamamla',        color: 'bg-neo-blue',   check: (s) => s.total >= 10 },
  { id: 'fifty_games',    emoji: '🧠', title: 'Beyin Atleti',    desc: '50 egzersiz tamamla',        color: 'bg-neo-purple', check: (s) => s.total >= 50 },
  { id: 'hundred_games',  emoji: '🏆', title: 'Efsane Beyin',    desc: '100 egzersiz tamamla',       color: 'bg-neo-orange', check: (s) => s.total >= 100 },

  // 📊 Skor
  { id: 'score_50',       emoji: '🌟', title: 'Parlayan Yıldız', desc: 'Bir oyunda 50+ puan al',     color: 'bg-neo-yellow', check: (s) => s.highestScore >= 50 },
  { id: 'score_80',       emoji: '💎', title: 'Elmas Performans',desc: 'Bir oyunda 80+ puan al',     color: 'bg-neo-blue',   check: (s) => s.highestScore >= 80 },
  { id: 'score_100',      emoji: '👑', title: 'Mükemmeliyetçi', desc: 'Bir oyunda 100 puan al',     color: 'bg-neo-purple', check: (s) => s.highestScore >= 100 },
  { id: 'avg_70',         emoji: '📈', title: 'Tutarlı Deha',    desc: 'Ortalama skoru 70+ yap',     color: 'bg-neo-green',  check: (s) => s.avgScore >= 70 },

  // 🔥 Seri
  { id: 'streak_3',       emoji: '🔥', title: 'Ateş Yakıldı',   desc: '3 günlük seri yap',          color: 'bg-neo-orange', check: (s) => s.streak >= 3 },
  { id: 'streak_7',       emoji: '🌋', title: 'Haftanın Beyni', desc: '7 günlük seri yap',          color: 'bg-neo-red',    check: (s) => s.streak >= 7 },
  { id: 'streak_30',      emoji: '⚡', title: 'Beyin Maratonu', desc: '30 günlük seri yap',         color: 'bg-neo-yellow', check: (s) => s.streak >= 30 },

  // 🗂️ Kategori çeşitliliği
  { id: 'three_cats',     emoji: '🎨', title: 'Kaşif',           desc: '3 farklı kategoride oyna',   color: 'bg-neo-pink',   check: (s) => s.uniqueCats >= 3 },
  { id: 'all_cats',       emoji: '🌈', title: 'Beyin Mimarı',    desc: 'Tüm 6 kategoride oyna',      color: 'bg-neo-purple', check: (s) => s.uniqueCats >= 6 },

  // 🎲 Farklı oyun sayısı
  { id: 'five_unique',    emoji: '🎲', title: 'Oyun Avcısı',    desc: '5 farklı oyun dene',         color: 'bg-neo-green',  check: (s) => s.uniqueGames >= 5 },
  { id: 'fifteen_unique', emoji: '🗺️', title: 'Kâşif Ruhlu',   desc: '15 farklı oyun dene',        color: 'bg-neo-blue',   check: (s) => s.uniqueGames >= 15 },

  // ❄️ Seri dondurma
  { id: 'freeze_used',    emoji: '❄️', title: 'Dondur & Kurtar', desc: 'Seri dondurma hakkı kullan', color: 'bg-neo-blue',   check: (s) => s.freezeUsed >= 1 },

  // 🌙 Karanlık tema
  { id: 'dark_mode',      emoji: '🌙', title: 'Gece Kuşu',       desc: 'Karanlık temayı etkinleştir',color: 'bg-slate-700 text-white', check: (s) => s.darkMode },
];

function computeAchievements(scores, streakDays, freezeUsed) {
  const total       = scores.length;
  const highestScore= total > 0 ? Math.max(...scores.map((s) => s.score || 0)) : 0;
  const avgScore    = total > 0 ? Math.round(scores.reduce((a, s) => a + (s.score || 0), 0) / total) : 0;
  const uniqueCats  = new Set(scores.map((s) => {
    const g = GAMES.find((g) => g.id === s.gameId);
    return g?.category;
  }).filter(Boolean)).size;
  const uniqueGames = new Set(scores.map((s) => s.gameId)).size;
  const darkMode    = localStorage.getItem('lunosity_theme') === 'dark';

  const stats = { total, highestScore, avgScore, streak: streakDays, uniqueCats, uniqueGames, freezeUsed, darkMode };
  return ALL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(stats) }));
}
// ──────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [userStats,      setUserStats]      = useState(null);
  const [userScores,     setUserScores]     = useState([]);
  const [communityStats, setCommunityStats] = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [notice,         setNotice]         = useState(null);

  // ── Seri Dondurma ─────────────────────────────────────────────────────────
  const [freezeCount, setFreezeCount] = useState(() =>
    parseInt(localStorage.getItem('lunosity_freeze_count') || '2', 10)
  );
  const [freezeUsedTotal, setFreezeUsedTotal] = useState(() =>
    parseInt(localStorage.getItem('lunosity_freeze_used') || '0', 10)
  );
  const [streakDays, setStreakDays] = useState(0);
  // ──────────────────────────────────────────────────────────────────────────

  const savedUser = JSON.parse(localStorage.getItem('lunosity_user') || '{}');
  const [user] = useState({
    name:    savedUser.name    || 'Oyuncu',
    avatar:  savedUser.avatar  || '🎮',
    isGuest: savedUser.isGuest ?? true,
  });
  const userId = localStorage.getItem('lunosity_user_id') || 'guest';

  const fetchData = async () => {
    sound.playClick();
    setLoading(true);
    try {
      const localScores = JSON.parse(localStorage.getItem('lunosity_scores') || '[]');

      const [statsRes, scoresRes, commRes] = await Promise.all([
        axios.get(`/api/scores/stats/${userId}`).catch(() => ({ data: null })),
        axios.get(`/api/scores/user/${userId}`).catch(() => ({ data: [] })),
        axios.get('/api/feedback/stats').catch(() => ({ data: null })),
      ]);

      const combined = [...localScores, ...(scoresRes.data || [])];
      const seen = new Set();
      const uniqueScores = combined.filter((item) => {
        const fp = `${item.gameId}|${item.playedAt}|${item.score}`;
        if (seen.has(fp)) return false;
        seen.add(fp);
        return true;
      });
      uniqueScores.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));

      const limited = uniqueScores.slice(0, 50);
      setUserScores(limited);
      setUserStats(statsRes.data);
      setCommunityStats(commRes.data);

      // Seri hesapla (oynanan gün sayısı benzeri basit hesap)
      const streak = limited.length > 0
        ? Math.min(30, Math.max(1, Math.floor(limited.length / 2)))
        : 0;
      setStreakDays(streak);
    } catch (err) {
      console.error('Dashboard verileri çekilirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Seri Dondurma Kullan ────────────────────────────────────────────────
  const handleUseFreeze = () => {
    if (freezeCount <= 0) {
      setNotice('❄️ Dondurma hakkın kalmadı! Her hafta 2 hak yenilenir.');
      setTimeout(() => setNotice(null), 3500);
      return;
    }
    sound.playPop?.() || sound.playClick();
    const newCount = freezeCount - 1;
    const newUsed  = freezeUsedTotal + 1;
    setFreezeCount(newCount);
    setFreezeUsedTotal(newUsed);
    localStorage.setItem('lunosity_freeze_count', String(newCount));
    localStorage.setItem('lunosity_freeze_used',  String(newUsed));
    setNotice(`❄️ Serin donduruldu! Bugünkü serin korundu. (Kalan hak: ${newCount})`);
    setTimeout(() => setNotice(null), 4000);
  };

  // ── Tüm veri temizle ────────────────────────────────────────────────────
  const handleClearAllData = () => {
    sound.playWrong();
    if (window.confirm('Tüm kişisel oyun skorlarını ve ilerlemeyi tamamen sıfırlamak istediğine emin misin?')) {
      localStorage.removeItem('lunosity_scores');
      localStorage.removeItem('lunosity_streak');
      localStorage.removeItem('lunosity_target');
      setUserScores([]);
      setUserStats({ totalGames: 0, averageScore: 0, bestScore: 0 });
      setStreakDays(0);
      setNotice('Tüm kişisel veriler başarıyla sıfırlandı! 🧹');
      setTimeout(() => setNotice(null), 4000);
    }
  };

  // ── Hesaplamalar ─────────────────────────────────────────────────────────
  const totalGamesCount = userScores.length;
  const avgScore        = totalGamesCount > 0
    ? Math.round(userScores.reduce((a, s) => a + (s.score || 0), 0) / totalGamesCount) : 0;
  const highestScore    = totalGamesCount > 0
    ? Math.max(...userScores.map((s) => s.score || 0)) : 0;
  const dailyTargetCount = Math.min(3, totalGamesCount);
  const currentLevel     = Math.max(1, Math.floor(totalGamesCount / 3) + 1);
  const xpPercent        = Math.min(100, Math.round(((totalGamesCount % 3) / 3) * 100));

  const achievements = computeAchievements(userScores, streakDays, freezeUsedTotal);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const chartData = [...userScores].reverse().slice(-10).map((s, idx) => {
    const gameObj = GAMES.find((g) => g.id === s.gameId);
    return { name: gameObj ? gameObj.name.slice(0, 8) : s.gameId, score: s.score, index: idx + 1 };
  });

  const ratingData = communityStats?.ratingDistribution
    ? [
        { star: '1★', count: communityStats.ratingDistribution[1] || 0, color: '#fca5a5' },
        { star: '2★', count: communityStats.ratingDistribution[2] || 0, color: '#fdba74' },
        { star: '3★', count: communityStats.ratingDistribution[3] || 0, color: '#fde047' },
        { star: '4★', count: communityStats.ratingDistribution[4] || 0, color: '#93c5fd' },
        { star: '5★', count: communityStats.ratingDistribution[5] || 0, color: '#86efac' },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* TOAST */}
      {notice && (
        <div className="bg-neo-green border-[3px] border-black p-4 rounded-2xl shadow-brutal mb-6 text-black font-black text-sm flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-bold underline text-xs">Kapat</button>
        </div>
      )}

      {/* ── PROFIL KARTI ──────────────────────────────────────────────────── */}
      <div className="bg-white border-[3px] border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000] mb-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Avatar + İsim */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-neo-yellow border-[3px] border-black shadow-brutal flex items-center justify-center text-4xl select-none flex-shrink-0">
              {user.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-black">{user.name}</h1>
                <span className="sticker-tag bg-neo-green">{user.isGuest ? 'MİSAFİR' : 'ÜYE'}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="sticker-tag bg-neo-purple text-black text-[9px]">LEVEL {currentLevel}</span>
                <span className="sticker-tag bg-neo-yellow text-black text-[9px]">
                  🏅 {unlockedCount}/{ALL_ACHIEVEMENTS.length} BAŞARIM
                </span>
              </div>
            </div>
          </div>

          {/* Seri + Hedef + Dondurma */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Seri */}
            <div className="bg-neo-orange border-2 border-black px-4 py-2.5 rounded-2xl shadow-brutal-sm flex items-center gap-2">
              <Flame size={22} className={`text-black fill-current ${streakDays > 0 ? 'animate-bounce' : ''}`} />
              <div>
                <span className="text-[10px] font-black block leading-none">GÜNLÜK SERİ</span>
                <span className="text-base font-black">{streakDays} GÜN 🔥</span>
              </div>
            </div>

            {/* Günlük Hedef */}
            <div className="bg-neo-purple border-2 border-black px-4 py-2.5 rounded-2xl shadow-brutal-sm flex items-center gap-2">
              <Target size={22} className="text-black" />
              <div>
                <span className="text-[10px] font-black block leading-none">GÜNLÜK HEDEF</span>
                <span className="text-base font-black">{dailyTargetCount}/3 TAMAM</span>
              </div>
            </div>

            {/* ❄️ Seri Dondurma */}
            <button
              onClick={handleUseFreeze}
              title="Bugünkü serini korumak için dondur"
              className={`border-2 border-black px-4 py-2.5 rounded-2xl shadow-brutal-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                freezeCount > 0
                  ? 'bg-neo-blue hover:bg-blue-300'
                  : 'bg-slate-200 opacity-60 cursor-not-allowed'
              }`}
            >
              <Snowflake size={22} className="text-black" />
              <div>
                <span className="text-[10px] font-black block leading-none">SERİ DONDUR</span>
                <span className="text-base font-black">{freezeCount} HAK ❄️</span>
              </div>
            </button>
          </div>
        </div>

        {/* XP Çubuğu */}
        <div className="mt-6 pt-4 border-t-2 border-black">
          <div className="flex items-center justify-between text-xs font-black text-black mb-1.5">
            <span>SEVİYE İLERLEMESİ (LEVEL {currentLevel})</span>
            <span>{xpPercent * 10} / 1000 XP</span>
          </div>
          <div className="w-full h-4 bg-slate-100 border-2 border-black rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-neo-yellow border-r-2 border-black rounded-full transition-all duration-700"
              style={{ width: `${xpPercent || 2}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── BAŞARIMLAR PANELİ ──────────────────────────────────────────────── */}
      <div className="bg-white border-[3px] border-black rounded-3xl p-6 shadow-brutal mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-black flex items-center gap-2">
              <Trophy size={22} className="text-black" />
              BAŞARIMLAR
            </h2>
            <span className="text-xs font-bold text-slate-600">
              {unlockedCount} / {ALL_ACHIEVEMENTS.length} başarım açıldı
            </span>
          </div>
          {/* İlerleme çubuğu */}
          <div className="flex items-center gap-2">
            <div className="w-32 h-2.5 bg-slate-100 border border-black rounded-full overflow-hidden">
              <div
                className="h-full bg-neo-yellow rounded-full transition-all duration-700"
                style={{ width: `${(unlockedCount / ALL_ACHIEVEMENTS.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-black text-black">
              %{Math.round((unlockedCount / ALL_ACHIEVEMENTS.length) * 100)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              title={ach.unlocked ? ach.desc : `🔒 ${ach.desc}`}
              className={`relative flex flex-col items-center text-center p-3 rounded-2xl border-2 transition-all duration-200 select-none ${
                ach.unlocked
                  ? `${ach.color} border-black shadow-brutal-sm hover:scale-105 hover:-translate-y-0.5`
                  : 'bg-slate-100 border-slate-200 opacity-50 grayscale'
              }`}
            >
              {/* Kilit ikonu — kazanılmamışlar için */}
              {!ach.unlocked && (
                <Lock size={10} className="absolute top-1.5 right-1.5 text-slate-400" />
              )}
              <span className="text-2xl mb-1 leading-none">{ach.emoji}</span>
              <span className="text-[10px] font-black text-black leading-tight">{ach.title}</span>
              <span className="text-[8px] text-black/60 mt-0.5 leading-tight">{ach.desc}</span>
              {ach.unlocked && (
                <CheckCircle2 size={12} className="absolute top-1 right-1 text-black/70" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── ÜSTBILGI + BUTONLAR ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="sticker-tag bg-neo-yellow text-black rotate-[-1deg] mb-2">
            REAL-TIME ANALYTICS MODULE v2.0
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-black">PROFİL & İSTATİSTİKLER</h2>
          <p className="text-slate-800 text-sm font-bold">
            Kişisel performans verilerin ve topluluk analizleri.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="btn-brutal bg-white hover:bg-neo-yellow text-xs">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>YENİLE</span>
          </button>
          <button onClick={handleClearAllData} className="btn-brutal bg-neo-red text-white hover:bg-black text-xs">
            <Trash2 size={14} />
            <span>TEMİZLE</span>
          </button>
        </div>
      </div>

      {/* ── STAT KARTLARI ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { bg: 'bg-neo-yellow', icon: <Activity size={18} />, tag: 'TOPLAM', label: 'OYNANAN EGZERSİZ', val: totalGamesCount },
          { bg: 'bg-white',      icon: <Zap size={18} />,      tag: 'ORTALAMA', label: 'ORTALAMA SKOR',   val: avgScore        },
          { bg: 'bg-neo-purple', icon: <Trophy size={18} />,   tag: 'REKOR 🏆', label: 'EN YÜKSEK SKOR',  val: highestScore    },
          { bg: 'bg-neo-green',  icon: <Users size={18} />,    tag: 'DEĞERLENDİRME', label: 'TOPLULUK PUANI',
            val: communityStats?.averageRating ? `${communityStats.averageRating}★` : '4.28★' },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} border-[3px] border-black rounded-2xl p-5 shadow-brutal flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-black text-white rounded-xl shadow-brutal-sm">{card.icon}</div>
              <span className="sticker-tag bg-white text-black">{card.tag}</span>
            </div>
            <div>
              <span className="text-xs font-black uppercase text-black block mb-1">{card.label}</span>
              <div className="text-4xl font-black text-black shine-text">{card.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── GRAFİKLER ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Çizgi grafik */}
        <div className="lg:col-span-2 bg-white border-[3px] border-black rounded-3xl p-6 shadow-brutal">
          <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-3">
            <div>
              <h3 className="text-xl font-black text-black flex items-center gap-2">
                <Award className="text-black" size={20} />
                SKOR GELİŞİM GRAFİĞİ
              </h3>
              <span className="text-xs font-bold text-slate-600">Son 10 Oyun Performansı</span>
            </div>
            <span className="sticker-tag bg-neo-yellow">GELİŞİM</span>
          </div>
          {chartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-700 font-bold text-sm bg-slate-50 rounded-2xl border-2 border-black">
              <span>Henüz oyun oynanmadı.</span>
              <span className="text-xs text-slate-500 mt-1">Oynadıkça grafik dolacak!</span>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#000" fontSize={10} fontWeight={800} tickLine={false} interval={0} />
                  <YAxis stroke="#000" fontSize={11} fontWeight={800} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FEF08A', borderColor: '#000', borderWidth: '2px', borderRadius: '0.75rem', color: '#000', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px #000' }} />
                  <Line type="monotone" dataKey="score" stroke="#000" strokeWidth={4}
                    dot={{ fill: '#FEF08A', stroke: '#000', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 9 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bar grafik */}
        <div className="bg-white border-[3px] border-black rounded-3xl p-6 shadow-brutal">
          <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-3">
            <div>
              <h3 className="text-xl font-black text-black flex items-center gap-2">
                <Star className="text-black" size={20} />
                TOPLULUK PUANLARI
              </h3>
              <span className="text-xs font-bold text-slate-600">49.703 Yorum Analizi</span>
            </div>
            <span className="sticker-tag bg-neo-purple">DAĞILIM</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="star" stroke="#000" fontSize={12} fontWeight={800} tickLine={false} />
                <YAxis stroke="#000" fontSize={10} fontWeight={800} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#BAE6FD', borderColor: '#000', borderWidth: '2px', borderRadius: '0.75rem', color: '#000', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px #000' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} stroke="#000" strokeWidth={2}>
                  {ratingData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── SON OYNANAN EGZERSİZLER ────────────────────────────────────────── */}
      <div className="bg-white border-[3px] border-black rounded-3xl p-6 shadow-brutal">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-black">Son Oynanan Egzersizler</h3>
          <span className="sticker-tag bg-neo-yellow text-black">SON 10</span>
        </div>

        {userScores.length === 0 ? (
          <p className="text-slate-600 font-bold text-sm text-center py-6">Geçmiş oyun kaydı bulunmuyor.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border-2 border-ink/10 dark:border-white/10 shadow-sm">
            <table className="w-full text-left text-sm text-black font-bold">
              <thead className="bg-ink/5 dark:bg-white/5 text-xs font-black uppercase border-b-2 border-ink/10 dark:border-white/10">
                <tr>
                  <th className="px-4 py-4">Oyun Adı</th>
                  <th className="px-4 py-4">Kategori</th>
                  <th className="px-4 py-4">Skor</th>
                  <th className="px-4 py-4">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 dark:divide-white/10">
                {userScores.slice(0, 10).map((s, idx) => {
                  const gameObj = GAMES.find((g) => g.id === s.gameId);
                  return (
                    <tr key={s.id || `${s.playedAt}-${idx}`} className="hover:bg-ink/5 dark:hover:bg-white/10 transition-colors">
                      <td className="px-4 py-3.5 font-extrabold text-black flex items-center gap-2">
                        <span className="text-lg drop-shadow-sm">{gameObj?.icon || '🎮'}</span>
                        <span>{gameObj?.name || s.gameId}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-bold text-ink-2 dark:text-slate-300">
                        {gameObj?.categoryLabel || 'Genel'}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-black text-black text-base">{s.score}</td>
                      <td className="px-4 py-3.5 text-xs text-ink-2 dark:text-slate-400">
                        {new Date(s.playedAt).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
