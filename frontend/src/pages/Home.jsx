import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES, CATEGORIES } from '../constants/games';
import { Play, ArrowUpRight, UserCheck, Brain, Zap, Target, Trophy } from 'lucide-react';
import { sound } from '../utils/sound';

const CATEGORY_COLORS = {
  memory:           { bg: '#5B4FE9', text: '#fff', light: '#EAE8FF' },
  speed:            { bg: '#FF5733', text: '#fff', light: '#FFE8E3' },
  attention:        { bg: '#00C896', text: '#fff', light: '#D6F7EF' },
  'problem-solving':{ bg: '#FFB800', text: '#111', light: '#FFF7D6' },
  language:         { bg: '#FF3864', text: '#fff', light: '#FFE0E8' },
  flexibility:      { bg: '#1A1A1A', text: '#fff', light: '#E8E8E8' },
};

export default function Home({ onOpenAuth }) {
  const navigate = useNavigate();

  const cats = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <div className="min-h-screen bg-paper">

      {/* ──── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Kayan noktalı arka plan — sadece hero bölümünde */}
        <div className="hero-dot-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">

          {/* Sol — metin */}
          <div className="animate-[fadeUp_0.6s_ease_forwards]">
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <div className="section-label mb-0">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-mint inline-block" />
                50+ Bilimsel Beyin Egzersizi
              </div>
              <span className="border-2 border-black bg-neo-purple text-black px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#000] rotate-[-2deg]">
                v2.0 BETA
              </span>
            </div>

            <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black text-ink leading-[1.05] mb-6">
              Zihnini<br />
              <span className="text-brand">Keskinleştir.</span>
            </h1>

            <p className="text-ink-2 text-lg leading-relaxed max-w-md mb-10">
              Hafıza, hız, dikkat ve problem çözme alanlarında bilimsel metotlarla tasarlanmış egzersizlerle bilişsel performansını geliştir.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { sound.playClick(); navigate('/games'); }}
                className="btn-primary text-base px-8 py-4"
              >
                <Play size={18} fill="currentColor" />
                Oyunları Keşfet
              </button>
              <button
                onClick={() => { sound.playClick(); onOpenAuth(); }}
                className="btn-brutal bg-white text-black text-base px-8 py-3.5 hover:bg-neo-yellow"
              >
                <UserCheck size={18} />
                Giriş Yap
              </button>
            </div>

            {/* Mini istatistikler */}
            <div className="flex flex-wrap gap-6 mt-12">
              {[
                { icon: <Brain size={16} />, value: '50+',       label: 'Egzersiz'  },
                { icon: <Zap size={16} />,   value: '6',          label: 'Kategori'  },
                { icon: <Target size={16} />, value: '%98',       label: 'Gelişim'   },
                { icon: <Trophy size={16} />, value: 'Ücretsiz',  label: 'Tamamen'   },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-ink/8 flex items-center justify-center text-ink/60">
                    {s.icon}
                  </div>
                  <div>
                    <div className="font-black text-sm text-ink leading-none">{s.value}</div>
                    <div className="text-xs text-mist">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — görsel blok (karakter kartı referansı gibi) */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-[420px] h-[420px]">
              {/* Ana büyük kart */}
              <div className="absolute inset-0 bg-brand rounded-[2.5rem] rotate-3 opacity-20" />
              <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center p-10 text-center">
                <div className="text-[6rem] leading-none mb-4">🧠</div>
                <div className="font-black text-2xl text-ink mb-2">Beyin Antrenmanı</div>
                <div className="text-sm text-mist max-w-[220px]">Günde 5 dakika ile uzun vadeli bilişsel gelişim</div>

                {/* Küçük rozetler */}
                <div className="flex gap-2 mt-6 flex-wrap justify-center">
                  {cats.slice(0, 3).map((cat) => {
                    const col = CATEGORY_COLORS[cat.id] || { bg: '#111', text: '#fff' };
                    return (
                      <span
                        key={cat.id}
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: col.bg, color: col.text }}
                      >
                        {cat.icon} {cat.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Yüzen küçük kartlar */}
              <div className="absolute -top-4 -right-6 bg-accent-amber text-ink text-xs font-black px-3 py-2 rounded-2xl shadow-[0_4px_16px_rgba(255,184,0,0.4)] rotate-6">
                🔥 5 Gün Seri
              </div>
              <div className="absolute -bottom-4 -left-6 bg-brand text-white text-xs font-black px-3 py-2 rounded-2xl shadow-[0_4px_16px_rgba(91,79,233,0.4)] -rotate-3">
                ⚡ 195ms Tepki
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──── İSTATİSTİK BANT ───────────────────────────────────── */}
      <section className="bg-ink py-10">
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '50+',    label: 'Egzersiz',       cls: 'metallic-text-yellow' },
            { value: '49.700+',label: 'Kullanıcı',       cls: 'metallic-text-green'  },
            { value: '%98.4',  label: 'Odaklanma Artışı',cls: 'metallic-text-cyan'   },
            { value: '0 ₺',    label: 'Tamamen Ücretsiz', cls: 'metallic-text-pink'  },
          ].map((s) => (
            <div key={s.label}>
              <div className={`text-4xl md:text-5xl font-black ${s.cls}`}>{s.value}</div>
              <div className="text-xs text-white/50 font-medium mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ──── KATEGORİLER ───────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-5">
        <div className="mb-12">
          <div className="section-label">6 Bilişsel Alan</div>
          <h2 className="text-4xl font-black text-ink">Becerilerini Geliştir</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((cat, i) => {
            const col = CATEGORY_COLORS[cat.id] || { bg: '#5B4FE9', text: '#fff', light: '#EAE8FF' };
            const count = GAMES.filter((g) => g.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => { sound.playClick(); navigate('/games', { state: { category: cat.id } }); }}
                className="group cursor-pointer rounded-3xl overflow-hidden transition-all duration-250 border-2 border-ink/80 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1.5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Renkli üst blok — tam parlak neşeli emoji */}
                <div
                  className="h-36 flex items-end p-5 relative overflow-hidden"
                  style={{ backgroundColor: col.bg }}
                >
                  <span className="absolute top-3 right-3 text-6xl opacity-100 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 select-none drop-shadow-md">
                    {cat.icon}
                  </span>
                  <div className="relative z-10">
                    <span className="sticker-tag bg-neo-yellow text-black text-[10px] mb-1.5">
                      {count} ÖZEL EGZERSİZ
                    </span>
                    <h3 className="text-3xl font-black" style={{ color: col.text }}>
                      {cat.label}
                    </h3>
                  </div>
                </div>

                {/* Alt beyaz blok */}
                <div className="bg-white px-5 py-4 flex items-center justify-between border-t-2 border-ink/80">
                  <p className="text-xs text-ink-2 font-bold max-w-[190px] leading-relaxed">
                    {cat.description || 'Egzersizleri keşfet ve beynini güçlendir.'}
                  </p>
                  <div
                    className="w-10 h-10 rounded-2xl border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-brutal-sm"
                    style={{ backgroundColor: col.light }}
                  >
                    <ArrowUpRight size={18} style={{ color: col.bg }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
