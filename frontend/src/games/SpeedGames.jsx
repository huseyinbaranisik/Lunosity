import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameContext } from './GameContext';
import { sound } from '../utils/sound';

// ─── 1. RENK ADI TESTİ (color-name-test) ───────────────────────────────────────
export function ColorNameTestGame() {
  const { addScore } = useGameContext();
  const [current, setCurrent] = useState({ word: 'KIRMIZI', colorHex: '#EF4444', isMatch: true });

  const COLORS = [
    { name: 'KIRMIZI', hex: '#EF4444' },
    { name: 'MAVİ',    hex: '#3B82F6' },
    { name: 'YEŞİL',   hex: '#10B981' },
    { name: 'SARI',    hex: '#F59E0B' },
  ];

  const nextTrial = useCallback(() => {
    const wObj = COLORS[Math.floor(Math.random() * COLORS.length)];
    const cObj = COLORS[Math.floor(Math.random() * COLORS.length)];
    const isMatch = wObj.name === cObj.name;
    setCurrent({ word: wObj.name, colorHex: cObj.hex, colorName: cObj.name, isMatch });
  }, []);

  useEffect(() => {
    nextTrial();
  }, [nextTrial]);

  const handleAns = (userChoice) => {
    const isCorrect = userChoice === current.isMatch;
    if (isCorrect) {
      sound.playClick();
      addScore(15);
    } else {
      addScore(-10);
    }
    nextTrial();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Kelime Adı İle Yazıldığı Renk Aynı Mı?
      </div>

      <div className="w-full max-w-xs h-36 bg-white border border-ink/15 rounded-3xl flex items-center justify-center shadow-card my-4">
        <span className="text-4xl font-black" style={{ color: current.colorHex }}>
          {current.word}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        <button
          onClick={() => handleAns(true)}
          className="py-4 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-sm hover:bg-emerald-600 transition-all cursor-pointer"
        >
          AYNI ✓
        </button>
        <button
          onClick={() => handleAns(false)}
          className="py-4 rounded-2xl bg-rose-500 text-white font-black text-lg shadow-sm hover:bg-rose-600 transition-all cursor-pointer"
        >
          FARKLI ✗
        </button>
      </div>
    </div>
  );
}

// ─── 2. HIZ YAZIM (speed-type) ─────────────────────────────────────────────────
export function SpeedTypeGame() {
  const { addScore } = useGameContext();
  const inputRef = useRef(null);

  // 100+ Geniş Türkçe Kelime & İfade Havuzu
  const ALL_PHRASES = [
    'Hızlı Düşün', 'Zihnin Keskin', 'Odaklan Ve Başar', 'Kodu Çöz',
    'Beyin Gücü', 'Işık Hızında', 'Süper Zeka', 'Refleks Analizi',
    'Algı Kapasitesi', 'Kapsamlı Odak', 'Kritik Hamle', 'Yüksek Konsantrasyon',
    'Dinamik Zeka', 'Zaman Yarışı', 'Mantık Örgüsü', 'Kelimelerle Oyun',
    'Hızlı Klavye', 'Bilişsel Esneklik', 'Yaratıcı Düşünme', 'Derin Odaklanma',
    'Zihinsel Çeviklik', 'Hafıza Takibi', 'Sınırsız Enerji', 'Zirve Performans',
    'Çözüm Odaklı', 'Bilişsel Hız', 'Görsel Algı', 'Tepki Süresi',
    'Pratik Zeka', 'Kararlı Adım', 'Zaman Yönetimi', 'Zihin Haritası',
    'Stratejik Hamle', 'Kritik Karar', 'Öğrenme Hızı', 'Aktif Zihin',
    'Derin Konsantrasyon', 'Güçlü Hafıza', 'Hızlı Refleks', 'Zeki Adımlar',
    'Bilişsel Kontrol', 'Anlık Karar', 'Zihin Gücü', 'Işık Hızı',
    'Keskin Görüş', 'Analitik Zeka', 'Odağını Koru', 'Performans Artışı',
    'Başarı Odaklı', 'Sürekli Gelişim', 'Disiplinli Çalışma', 'Akıl Oyunları',
    'Motivasyon', 'Potansiyel', 'Hızlı Öğrenme', 'Üstün Başarı',
    'Düşünme Hızı', 'Kararlılık', 'Odak Noktası', 'Derin Düşünce',
    'Yüksek Performans', 'Bilişsel Motor', 'Refleks Egzersizi', 'Zihin Testi',
    'Hızlı Çözüm', 'Zeka Oyunu', 'Bilişsel Egzersiz', 'Süper Hafıza',
    'Hızlı Okuma', 'Doğru Hamle', 'Strateji Üret', 'Zihinsel Esneklik',
    'Akıl Gücü', 'Tepki Hızı', 'Kavrama Yeteneği', 'Öğrenme Gücü',
    'Karar Mekanizması', 'Optimum Performans', 'Zeka Kapasitesi', 'Akılcı Yaklaşım',
    'Bilişsel Gelişim', 'Hızlı Adaptasyon', 'Dinamik Zihin', 'Üstün Zeka',
    'Hafıza Egzersizi', 'Odaklanma Gücü', 'Mental Güç', 'Zihinsel Dayanıklılık',
    'Bilişsel Kapasite', 'Anlık Refleks', 'Zeka Parlaması', 'Analiz Yeteneği',
    'Stratejik Zeka', 'Çözüm Üretme', 'Keskin Zihin', 'Yüksek Motivasyon',
    'Pratik Düşünme', 'Zihin Açıklığı', 'Süper Odak', 'Gelişmiş Zeka'
  ];

  const [targetText, setTargetText] = useState('Hızlı Düşün');
  const [inputVal, setInputVal] = useState('');
  const [isError, setIsError] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const nextPhrase = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * ALL_PHRASES.length);
    setTargetText(ALL_PHRASES[randomIdx]);
    setInputVal('');
    setIsError(false);
  }, []);

  useEffect(() => {
    nextPhrase();
  }, [nextPhrase]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputVal(val);

    // 10FastFingers Anlık Hata Kontrolü:
    // Yazılan son karakter hedef kelimenin o sıradaki karakteriyle eşleşmiyorsa hata efekti!
    let hasMistype = false;
    for (let i = 0; i < val.length; i++) {
      if (i >= targetText.length || val[i] !== targetText[i]) {
        hasMistype = true;
        break;
      }
    }

    if (hasMistype) {
      setIsError(true);
      setTimeout(() => setIsError(false), 350);
    } else {
      setIsError(false);
    }

    // Tamamı doğru yazıldıysa
    if (val === targetText) {
      sound.playClick();
      addScore(30);
      setCompletedCount((c) => c + 1);
      nextPhrase();
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-4 font-black text-xs md:text-sm text-black">
        <span>⌨️ Metni Olabildiğince Hızlı ve Doğru Yaz!</span>
        <span className="bg-neo-yellow px-2 py-0.5 rounded-full border border-black text-xs">{completedCount} Kelime</span>
      </div>

      {/* 10FASTFINGERS KARAKTER RENKLENDİRME ALANI */}
      <div
        className={`w-full max-w-md bg-slate-900 border-[3px] p-6 rounded-3xl shadow-brutal my-3 transition-all duration-150 ${
          isError ? 'border-neo-red bg-red-950/40 animate-shake shadow-[0_0_20px_#ef4444]' : 'border-black'
        }`}
      >
        <div className="text-2xl md:text-3xl font-black tracking-wide flex flex-wrap justify-center gap-0.5 leading-relaxed font-mono">
          {targetText.split('').map((char, i) => {
            const typedChar = inputVal[i];
            let charStyle = 'text-slate-500';

            if (typedChar !== undefined) {
              if (typedChar === char) {
                // DOĞRU YAZILAN HARF -> YEŞİL
                charStyle = 'text-emerald-400 bg-emerald-950/80 font-black rounded px-0.5 border border-emerald-500/50 shadow-sm';
              } else {
                // YANLIŞ YAZILAN HARF -> KIRMIZI
                charStyle = 'text-red-400 bg-red-950/90 font-black rounded px-0.5 underline decoration-red-500 border border-red-500/80 animate-pulse';
              }
            }

            return (
              <span key={i} className={`transition-all duration-75 ${charStyle}`}>
                {char === ' ' ? '␣' : char}
              </span>
            );
          })}
        </div>
      </div>

      {/* YAZMA GİRDİSİ */}
      <input
        ref={inputRef}
        type="text"
        value={inputVal}
        onChange={handleChange}
        placeholder="Buraya yazın..."
        className={`w-full max-w-md bg-white border-[3px] rounded-2xl px-4 py-3 text-center font-black text-xl text-black shadow-brutal focus:outline-none transition-all ${
          isError ? 'border-neo-red bg-red-50' : 'border-black focus:border-neo-blue'
        }`}
        autoFocus
      />
    </div>
  );
}

// ─── 3. REFLEKS TIKLAMA (quick-click) ──────────────────────────────────────────
export function QuickClickGame() {
  const { addScore } = useGameContext();
  const [targetPos, setTargetPos] = useState({ top: '40%', left: '40%' });
  const [hits, setHits] = useState(0);
  const [isError, setIsError] = useState(false);

  const moveTarget = useCallback(() => {
    const top = `${Math.floor(Math.random() * 70) + 15}%`;
    const left = `${Math.floor(Math.random() * 70) + 15}%`;
    setTargetPos({ top, left });
  }, []);

  useEffect(() => {
    moveTarget();
  }, [moveTarget]);

  // HEDEFE İSABETLİ TIKLAMA
  const handleTargetClick = (e) => {
    e.stopPropagation(); // Boş alana tıklama olayını engelle
    sound.playPop();
    addScore(20);
    setHits((h) => h + 1);
    setIsError(false);
    moveTarget();
  };

  // ARENANIN BOŞ YERİNE TIKLAMA (ISALAN/YANLIŞ TIKLAMA)
  const handleArenaClick = () => {
    addScore(-10);
    setIsError(true);
    setTimeout(() => setIsError(false), 350);
    moveTarget(); // Yanlış tıklayınca hedef başka yere kaysın
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🎯 Beliren Renkli Daireye Anında Tıkla! (Boş Yere Basma)</span>
        <span className="bg-neo-yellow px-2 py-0.5 rounded-full border border-black text-xs">{hits} İsabet</span>
      </div>

      {/* OYUN ARENASI */}
      <div
        onClick={handleArenaClick}
        className={`w-full max-w-md h-72 bg-slate-950 rounded-3xl border-4 relative overflow-hidden my-2 cursor-crosshair transition-all duration-150 ${
          isError
            ? 'border-neo-red bg-red-950/60 animate-shake shadow-[0_0_25px_#ef4444]'
            : 'border-slate-800 shadow-brutal'
        }`}
      >
        {/* RASTGELE SPAWN OLAN YUVARLAK HEDEF DAİRE */}
        <button
          onClick={handleTargetClick}
          style={{ top: targetPos.top, left: targetPos.left }}
          className="absolute w-12 h-12 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_20px_#22d3ee] animate-pulse cursor-pointer -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-white/80" />
        </button>

        {isError && (
          <div className="absolute inset-0 bg-red-600/20 pointer-events-none flex items-center justify-center font-black text-neo-red text-xl tracking-widest animate-pulse">
            ❌ ISKALADIN! -10
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 4. OK TAKİBİ (chase-speed) ────────────────────────────────────────────────
export function ChaseSpeedGame() {
  const { addScore } = useGameContext();
  const [arrow, setArrow] = useState({ symbol: '⬆️', dir: 'UP' });

  const ARROWS = [
    { symbol: '⬆️', dir: 'UP' },
    { symbol: '⬇️', dir: 'DOWN' },
    { symbol: '⬅️', dir: 'LEFT' },
    { symbol: '➡️', dir: 'RIGHT' },
  ];

  const nextArrow = useCallback(() => {
    const a = ARROWS[Math.floor(Math.random() * ARROWS.length)];
    setArrow(a);
  }, []);

  useEffect(() => {
    nextArrow();
  }, [nextArrow]);

  const handleChoice = useCallback((dir) => {
    setArrow((currentArrow) => {
      if (dir === currentArrow.dir) {
        sound.playClick();
        addScore(15);
      } else {
        addScore(-10);
      }
      const a = ARROWS[Math.floor(Math.random() * ARROWS.length)];
      return a;
    });
  }, [addScore]);

  // KLAVYE OK TUŞLARI DİNLEYİCİSİ (Keyboard Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); handleChoice('UP'); }
      if (e.key === 'ArrowDown') { e.preventDefault(); handleChoice('DOWN'); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handleChoice('LEFT'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); handleChoice('RIGHT'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleChoice]);

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🏹 Ekranda Beliren Ok Yönünü Butonlarla veya Klavyedeki Ok Tuşlarıyla Seç!</span>
      </div>

      <div className="w-36 h-36 bg-slate-900 border-[3px] border-black rounded-3xl flex items-center justify-center text-6xl shadow-brutal my-4 animate-scale-in">
        {arrow.symbol}
      </div>

      <div className="grid grid-cols-3 gap-2 w-52">
        <div />
        <button onClick={() => handleChoice('UP')} className="btn-brutal bg-white p-3 text-2xl active:scale-95">⬆️</button>
        <div />
        <button onClick={() => handleChoice('LEFT')} className="btn-brutal bg-white p-3 text-2xl active:scale-95">⬅️</button>
        <button onClick={() => handleChoice('DOWN')} className="btn-brutal bg-white p-3 text-2xl active:scale-95">⬇️</button>
        <button onClick={() => handleChoice('RIGHT')} className="btn-brutal bg-white p-3 text-2xl active:scale-95">➡️</button>
      </div>
      <div className="text-xs font-bold text-slate-400 mt-3">💡 İpucu: Klavyedeki ⬆️ ⬇️ ⬅️ ➡️ ok tuşlarını kullanabilirsin.</div>
    </div>
  );
}
