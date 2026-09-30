import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from './GameContext';
import { sound } from '../utils/sound';

// ─── 1. SAYI DİZİSİ (number-sequence) ─────────────────────────────────────────
export function NumberSequenceGame() {
  const { addScore } = useGameContext();
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [phase, setPhase] = useState('memorize'); // memorize | input | success | fail
  const [showingIdx, setShowingIdx] = useState(-1);

  const startRound = useCallback((currentLevel) => {
    const len = currentLevel + 2; // lvl 1: 3 digits, lvl 2: 4 digits, etc.
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
    setSequence(seq);
    setUserSeq([]);
    setPhase('memorize');
    setShowingIdx(0);

    // Flash numbers one by one
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < seq.length) {
        setShowingIdx(idx);
        sound.playPop();
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('input');
          setShowingIdx(-1);
        }, 600);
      }
    }, 900);
  }, []);

  useEffect(() => {
    startRound(level);
  }, [level, startRound]);

  const handleNumClick = (num) => {
    if (phase !== 'input') return;
    sound.playClick();
    const nextUserSeq = [...userSeq, num];
    setUserSeq(nextUserSeq);

    const currentStep = nextUserSeq.length - 1;
    if (nextUserSeq[currentStep] !== sequence[currentStep]) {
      // Wrong digit!
      addScore(-10);
      setPhase('fail');
      setTimeout(() => startRound(level), 1200);
      return;
    }

    if (nextUserSeq.length === sequence.length) {
      // Full sequence correct!
      addScore(25 + level * 5);
      setPhase('success');
      setTimeout(() => setLevel((l) => l + 1), 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Sayı Dizisini Ezberle ve Tekrarla
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="sticker-tag bg-neo-purple">SEVİYE {level}</span>
        <span className="sticker-tag bg-neo-yellow">{level + 2} RAKAM</span>
      </div>

      {/* DISPLAY CANVAS */}
      <div className="w-full max-w-xs h-36 bg-ink text-white rounded-3xl flex items-center justify-center border-2 border-ink shadow-card mb-6">
        {phase === 'memorize' && showingIdx >= 0 && (
          <span className="text-6xl font-black text-brand-light animate-scale-in">
            {sequence[showingIdx]}
          </span>
        )}
        {phase === 'input' && (
          <div className="flex gap-2">
            {sequence.map((_, i) => (
              <span
                key={i}
                aria-label={`Sıra ${i + 1}`}
                className={`w-8 h-10 rounded-xl border flex items-center justify-center text-xl font-bold ${
                  i < userSeq.length
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white/10 text-white/40 border-white/20'
                }`}
              >
                {i < userSeq.length ? userSeq[i] : '?'}
              </span>
            ))}
          </div>
        )}
        {phase === 'success' && (
          <span className="text-2xl font-black text-neo-green animate-bounce">✓ Harika! Sonraki Seviye...</span>
        )}
        {phase === 'fail' && (
          <span className="text-2xl font-black text-neo-red animate-pulse">✗ Hatalı! Tekrar Dene...</span>
        )}
      </div>

      {/* NUMERIC KEYPAD */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumClick(num)}
            disabled={phase !== 'input'}
            className="h-14 rounded-2xl bg-white border border-ink/15 text-2xl font-black text-ink shadow-sm hover:bg-brand hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 2. KELİME EZBER (word-memory) ─────────────────────────────────────────────
export function WordMemoryGame() {
  const { addScore } = useGameContext();
  const [level, setLevel] = useState(1);
  const [targetWords, setTargetWords] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [phase, setPhase] = useState('show'); // show | test | result

  const WORD_POOL = [
    'KİTAP', 'GÜNEŞ', 'RÜZGAR', 'DENİZ', 'ORMAN', 'YILDIZ', 'BULUT', 'YAĞMUR',
    'TOPRAK', 'ÇİÇEK', 'YAPRAK', 'AKARSU', 'PENCERE', 'KAPTAN', 'PUSULA', 'HARİTA',
    'ZAMAN', 'GEZEGEN', 'IŞIK', 'GÖKYÜZÜ', 'MÜZİK', 'RESİM', 'HEYKEL', 'TİYATRO',
    'BİLGİ', 'AKIL', 'DÜŞÜNCE', 'HAYAL', 'ZİHİN', 'DUYGU', 'FİKİR', 'SANAT'
  ];

  const startRound = useCallback((lvl) => {
    const targetCount = 3 + Math.floor(lvl / 2); // 3, 4, 5...
    const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, targetCount);
    const decoys = shuffled.slice(targetCount, targetCount + targetCount + 2);
    const allOpts = [...targets, ...decoys].sort(() => Math.random() - 0.5);

    setTargetWords(targets);
    setOptions(allOpts);
    setSelectedWords(new Set());
    setPhase('show');

    setTimeout(() => {
      setPhase('test');
    }, 2500 + targetCount * 500);
  }, []);

  useEffect(() => {
    startRound(level);
  }, [level, startRound]);

  const handleWordToggle = (word) => {
    if (phase !== 'test') return;
    sound.playClick();
    const next = new Set(selectedWords);
    if (next.has(word)) next.delete(word);
    else next.add(word);
    setSelectedWords(next);
  };

  const handleSubmit = () => {
    if (phase !== 'test') return;
    let correct = 0;
    selectedWords.forEach((w) => {
      if (targetWords.includes(w)) correct++;
    });

    const isFullSuccess = correct === targetWords.length && selectedWords.size === targetWords.length;
    if (isFullSuccess) {
      addScore(30 + level * 10);
      setPhase('result');
      setTimeout(() => setLevel((l) => l + 1), 1200);
    } else {
      addScore(-5);
      setPhase('result');
      setTimeout(() => startRound(level), 1500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Kelimeleri Ezberle ve Seç
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="sticker-tag bg-neo-purple">SEVİYE {level}</span>
        <span className="sticker-tag bg-neo-green">{targetWords.length} KELİME</span>
      </div>

      {phase === 'show' && (
        <div className="w-full max-w-md bg-white border border-ink/15 rounded-3xl p-6 shadow-card my-4">
          <div className="text-xs font-bold text-mist uppercase tracking-widest mb-4">Aklında Tut!</div>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {targetWords.map((w, i) => (
              <span key={i} className="px-4 py-2 bg-brand text-white rounded-2xl font-black text-lg shadow-sm animate-scale-in">
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {(phase === 'test' || phase === 'result') && (
        <div className="w-full max-w-md bg-white border border-ink/15 rounded-3xl p-6 shadow-card my-2">
          <div className="text-xs font-bold text-mist uppercase tracking-widest mb-4">
            {phase === 'test' ? `Ezberlediğin ${targetWords.length} Kelimeyi İşaretle` : 'Sonuç:'}
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center mb-6">
            {options.map((w, i) => {
              const isSelected = selectedWords.has(w);
              const isTarget = targetWords.includes(w);
              let cls = 'bg-paper text-ink border-transparent';

              if (phase === 'test' && isSelected) cls = 'bg-brand text-white border-brand shadow-sm';
              if (phase === 'result') {
                if (isTarget && isSelected) cls = 'bg-neo-green text-black font-black border-neo-green';
                else if (!isTarget && isSelected) cls = 'bg-neo-red text-white font-black';
                else if (isTarget && !isSelected) cls = 'bg-neo-yellow text-black font-black';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleWordToggle(w)}
                  disabled={phase === 'result'}
                  className={`px-3.5 py-2 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${cls}`}
                >
                  {w}
                </button>
              );
            })}
          </div>

          {phase === 'test' && (
            <button
              onClick={handleSubmit}
              disabled={selectedWords.size === 0}
              className="btn-primary w-full"
            >
              Tamamla ({selectedWords.size}/{targetWords.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 3. GÖRÜNTÜ HAFIZA (image-memory) ──────────────────────────────────────────
export function ImageMemoryGame() {
  const { addScore } = useGameContext();
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  const [targetIndices, setTargetIndices] = useState([]);
  const [currentTargetStep, setCurrentTargetStep] = useState(0);
  const [userPicks, setUserPicks] = useState([]);
  const [phase, setPhase] = useState('show'); // show | question | success | fail

  const EMOJIS = ['🚀', '🎨', '🦁', '👑', '💎', '🍕', '⚽', '🎸', '🌈', '🍦', '🍒', '🤖', '⚓', '🎲', '🎈', '🎁'];

  const startRound = useCallback((lvl) => {
    const total = 16; // Sabit 4x4 Izgara (Asla bozulmaz!)
    const targetCount = 1 + Math.floor((lvl - 1) / 3); // Her 3 aşamada 1 sembol artar (1, 2, 3...)

    const shuffled = [...EMOJIS].sort(() => Math.random() - 0.5).slice(0, total);

    // Pick target indices randomly
    const indices = [];
    while (indices.length < targetCount) {
      const idx = Math.floor(Math.random() * total);
      if (!indices.includes(idx)) indices.push(idx);
    }

    const items = indices.map((idx) => shuffled[idx]);

    setGrid(shuffled);
    setTargetIndices(indices);
    setTargetItems(items);
    setCurrentTargetStep(0);
    setUserPicks([]);
    setPhase('show');

    // 3.5 saniye gösterim süresi
    setTimeout(() => {
      setPhase('question');
    }, 3500);
  }, []);

  useEffect(() => {
    startRound(level);
  }, [level, startRound]);

  const handlePosClick = (idx) => {
    if (phase !== 'question') return;
    sound.playClick();

    const currentExpectedIndex = targetIndices[currentTargetStep];

    if (idx === currentExpectedIndex) {
      const nextStep = currentTargetStep + 1;
      setUserPicks((prev) => [...prev, idx]);

      if (nextStep >= targetIndices.length) {
        // Tüm sembollerin konumları doğru bulundu!
        addScore(25 + targetIndices.length * 10);
        setPhase('success');
        setTimeout(() => setLevel((l) => l + 1), 1000);
      } else {
        // Bir sonraki sembolün konumunu sor
        setCurrentTargetStep(nextStep);
      }
    } else {
      addScore(-10);
      setPhase('fail');
      setTimeout(() => startRound(level), 1300);
    }
  };

  const currentAskingEmoji = targetItems[currentTargetStep];

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Görsellerin Konumlarını Ezberle
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="sticker-tag bg-neo-purple">AŞAMA {level}</span>
        <span className="sticker-tag bg-neo-yellow">4x4 IZGARA</span>
        <span className="sticker-tag bg-neo-green">{targetIndices.length} SEMBOL HEDEF</span>
      </div>

      {phase === 'question' && (
        <div className="mb-4 bg-white border border-ink/15 px-5 py-2.5 rounded-2xl shadow-card font-bold text-sm">
          👉 Sembol <span className="text-[11px] font-black uppercase text-mist mx-1">({currentTargetStep + 1}/{targetIndices.length}):</span>
          <span className="text-3xl inline-block mx-2 animate-bounce">{currentAskingEmoji}</span>
          konumu neredeydi?
        </div>
      )}

      {/* FIXED 4x4 GRID */}
      <div className="grid grid-cols-4 gap-2.5 p-3 bg-ink rounded-3xl shadow-card w-76 h-76">
        {grid.map((item, i) => {
          let content = phase === 'show' ? item : userPicks.includes(i) ? grid[i] : '?';
          let style = 'bg-white text-ink border-transparent';

          if (phase === 'success' && targetIndices.includes(i)) style = 'bg-neo-green text-black font-black scale-105';
          if (phase === 'fail' && targetIndices.includes(i)) style = 'bg-neo-yellow text-black font-black';

          return (
            <button
              key={i}
              onClick={() => handlePosClick(i)}
              disabled={phase !== 'question' || userPicks.includes(i)}
              className={`rounded-2xl flex items-center justify-center text-2xl font-bold transition-all cursor-pointer ${style}`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 4. UZAMSAL HAFIZA (spatial-memory) ───────────────────────────────────────
export function SpatialMemoryGame() {
  const { addScore } = useGameContext();
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [activeTile, setActiveTile] = useState(-1);
  const [phase, setPhase] = useState('show'); // show | input | success | fail

  const startRound = useCallback((lvl) => {
    const seqLen = 3 + Math.floor((lvl - 1) / 2); // 3, 4, 5...
    const seq = [];
    for (let i = 0; i < seqLen; i++) {
      seq.push(Math.floor(Math.random() * 9)); // 3x3 grid (0..8)
    }

    setSequence(seq);
    setUserSeq([]);
    setPhase('show');
    setActiveTile(-1);

    // Sırayla kareleri tek tek parlatıp söndür (Clear on/off timing)
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < seq.length) {
        const tileIdx = seq[idx];
        setActiveTile(tileIdx);
        sound.playPop();

        // 450ms sonra sön
        setTimeout(() => {
          setActiveTile(-1);
        }, 450);

        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setActiveTile(-1);
          setPhase('input');
        }, 600);
      }
    }, 750);
  }, []);

  useEffect(() => {
    startRound(level);
  }, [level, startRound]);

  const handleTileClick = (idx) => {
    if (phase !== 'input') return;
    sound.playClick();
    const nextUser = [...userSeq, idx];
    setUserSeq(nextUser);

    const step = nextUser.length - 1;
    if (nextUser[step] !== sequence[step]) {
      addScore(-10);
      setPhase('fail');
      setTimeout(() => startRound(level), 1200);
      return;
    }

    if (nextUser.length === sequence.length) {
      addScore(25 + level * 5);
      setPhase('success');
      setTimeout(() => setLevel((l) => l + 1), 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Uzamsal Kare Sırasını Takip Et
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="sticker-tag bg-neo-purple">AŞAMA {level}</span>
        <span className="sticker-tag bg-neo-green">{sequence.length} KARELİK ADIM</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 p-3 bg-ink rounded-3xl shadow-card w-64 h-64 my-2">
        {Array.from({ length: 9 }).map((_, i) => {
          const isActive = activeTile === i;
          const isUserClicked = userSeq[userSeq.length - 1] === i && phase === 'input';
          let bg = 'bg-white/10 hover:bg-white/20';

          if (isActive) bg = 'bg-neo-yellow border-2 border-black scale-105 shadow-md';
          if (isUserClicked) bg = 'bg-brand text-white';
          if (phase === 'success') bg = 'bg-neo-green';
          if (phase === 'fail') bg = 'bg-neo-red';

          return (
            <button
              key={i}
              onClick={() => handleTileClick(i)}
              disabled={phase !== 'input'}
              className={`rounded-2xl transition-all duration-150 cursor-pointer ${bg}`}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── 5. MELODİ HAFIZASI (sound-memory) ────────────────────────────────────────
export function SoundMemoryGame() {
  const { addScore } = useGameContext();
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [activePad, setActivePad] = useState(-1);
  const [phase, setPhase] = useState('show'); // show | input | success | fail

  const PADS = [
    { id: 0, freq: 261.63, color: 'bg-rose-500',   activeColor: 'bg-rose-300 scale-105 shadow-lg border-2 border-white', label: 'DO'  },
    { id: 1, freq: 329.63, color: 'bg-blue-500',   activeColor: 'bg-blue-300 scale-105 shadow-lg border-2 border-white', label: 'Mİ'  },
    { id: 2, freq: 392.00, color: 'bg-emerald-500',activeColor: 'bg-emerald-300 scale-105 shadow-lg border-2 border-white',label: 'SOL' },
    { id: 3, freq: 523.25, color: 'bg-amber-500',  activeColor: 'bg-amber-300 scale-105 shadow-lg border-2 border-white', label: 'DO²' },
  ];

  const playPadSound = useCallback((padId) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = PADS[padId]?.freq || 300;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio synth play error:', e);
    }
  }, []);

  const startRound = useCallback((lvl) => {
    const len = 3 + Math.floor((lvl - 1) / 2);
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    setUserSeq([]);
    setPhase('show');
    setActivePad(-1);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < seq.length) {
        const padId = seq[idx];
        setActivePad(padId);
        playPadSound(padId);

        setTimeout(() => {
          setActivePad(-1);
        }, 450);

        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setActivePad(-1);
          setPhase('input');
        }, 600);
      }
    }, 800);
  }, [playPadSound]);

  useEffect(() => {
    startRound(level);
  }, [level, startRound]);

  const handlePadClick = (id) => {
    if (phase !== 'input') return;
    playPadSound(id);
    const nextUser = [...userSeq, id];
    setUserSeq(nextUser);

    const step = nextUser.length - 1;
    if (nextUser[step] !== sequence[step]) {
      addScore(-10);
      setPhase('fail');
      setTimeout(() => startRound(level), 1200);
      return;
    }

    if (nextUser.length === sequence.length) {
      addScore(30 + level * 5);
      setPhase('success');
      setTimeout(() => setLevel((l) => l + 1), 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Melodi ve Ses Dizilimini Çal
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="sticker-tag bg-neo-purple">SEVİYE {level}</span>
        <span className="sticker-tag bg-neo-yellow">{sequence.length} NOTA</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 w-64 h-64 p-3 bg-ink rounded-3xl shadow-card my-2">
        {PADS.map((pad) => {
          const isActive = activePad === pad.id;
          let cls = pad.color;
          if (isActive) cls = pad.activeColor;
          if (phase === 'success') cls = 'bg-neo-green';
          if (phase === 'fail') cls = 'bg-neo-red';

          return (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              disabled={phase !== 'input'}
              className={`rounded-2xl flex items-center justify-center font-black text-white text-lg transition-all duration-150 cursor-pointer ${cls}`}
            >
              {pad.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

