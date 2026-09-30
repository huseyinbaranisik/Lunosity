import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from './GameContext';
import { sound } from '../utils/sound';

// ─── REUSABLE COMBO & FIREWORKS ANIMATION COMPONENT ─────────────────────────────
function ComboBanner({ combo }) {
  if (combo < 2) return null;

  const isMega = combo >= 5;
  const isSuper = combo >= 3;

  return (
    <div className="relative z-20 mb-3 animate-bounce">
      {isMega ? (
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-black text-sm px-5 py-2 rounded-2xl shadow-lg border-2 border-white animate-pulse">
          <span>🎆 ⚡ MEGA KOMBO {combo}X ⚡ 🎆</span>
        </div>
      ) : isSuper ? (
        <div className="inline-flex items-center gap-1.5 bg-brand text-white font-black text-xs px-4 py-1.5 rounded-xl shadow-md border border-white">
          <span>🔥 {combo}X KOMBO SERİSİ!</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1 bg-amber-400 text-black font-black text-[11px] px-3 py-1 rounded-lg shadow-sm">
          <span>⚡ {combo}X KOMBO</span>
        </div>
      )}
    </div>
  );
}

// Helper to generate dynamic button trap state (Visual Color Trap + Inversion Trap)
function getButtonTraps() {
  const isColorTrapped = Math.random() > 0.5; // 50% chance color trap
  const isInverted = Math.random() > 0.5;     // 50% chance text swapped

  // Normal: Btn 1 = EVET (Green), Btn 2 = HAYIR (Red)
  // Color Trapped: Btn 1 = EVET (Red), Btn 2 = HAYIR (Green)
  const btn1Bg = isColorTrapped ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600';
  const btn2Bg = isColorTrapped ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600';

  // Label Swap
  const label1 = isInverted ? 'HAYIR' : 'EVET';
  const label2 = isInverted ? 'EVET' : 'HAYIR';
  const val1 = isInverted ? false : true;
  const val2 = isInverted ? true : false;

  return { btn1Bg, btn2Bg, label1, label2, val1, val2 };
}

// ─── 1. RENK BUKALEMUNU (color-flex) — STROOP KURAL DEĞİŞİMİ ───────────────────
export function ColorFlexGame() {
  const { addScore } = useGameContext();
  const [ruleMode, setRuleMode] = useState('COLOR'); // COLOR | WORD
  const [stimulus, setStimulus] = useState({ word: 'KIRMIZI', colorHex: '#3B82F6', colorName: 'MAVİ' });
  const [combo, setCombo] = useState(0);

  const COLORS = [
    { name: 'KIRMIZI', hex: '#EF4444' },
    { name: 'MAVİ',    hex: '#3B82F6' },
    { name: 'YEŞİL',   hex: '#10B981' },
    { name: 'SARI',    hex: '#F59E0B' },
  ];

  const nextTrial = useCallback(() => {
    const mode = Math.random() > 0.5 ? 'COLOR' : 'WORD';
    setRuleMode(mode);

    const wObj = COLORS[Math.floor(Math.random() * COLORS.length)];
    let cObj = COLORS[Math.floor(Math.random() * COLORS.length)];
    if (Math.random() > 0.3 && cObj.name === wObj.name) {
      cObj = COLORS.find((c) => c.name !== wObj.name) || cObj;
    }

    setStimulus({ word: wObj.name, colorHex: cObj.hex, colorName: cObj.name });
  }, []);

  useEffect(() => {
    nextTrial();
  }, [nextTrial]);

  const handleAns = (colorName) => {
    const targetCorrect = ruleMode === 'COLOR' ? stimulus.colorName : stimulus.word;
    if (colorName === targetCorrect) {
      sound.playClick();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      addScore(20 + Math.min(nextCombo, 5) * 5);
    } else {
      addScore(-10);
      setCombo(0);
    }
    nextTrial();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <ComboBanner combo={combo} />

      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Kural Aniden Değişiyor — Dikkate Et!
      </div>

      <div className={`mb-4 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-sm transition-all ${
        ruleMode === 'COLOR' ? 'bg-brand text-white' : 'bg-ink text-white'
      }`}>
        {ruleMode === 'COLOR' ? '🎨 KELİMENİN YAZILDIĞI RENK?' : '📝 KELİMENİN ANLAMI (YAZI)?'}
      </div>

      <div className="w-full max-w-xs h-36 bg-white border border-ink/15 rounded-3xl flex items-center justify-center shadow-card my-2">
        <span className="text-4xl font-black animate-scale-in" style={{ color: stimulus.colorHex }}>
          {stimulus.word}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-3">
        {COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => handleAns(c.name)}
            className="py-3.5 rounded-2xl bg-paper hover:bg-brand hover:text-white border border-ink/15 font-black text-sm text-ink transition-all cursor-pointer shadow-sm"
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 2. KURAL AVCISI (category-switch) — WISCONSIN CARD SORTING ────────────────
export function CategorySwitchGame() {
  const { addScore } = useGameContext();
  const [activeRule, setActiveRule] = useState('COLOR'); // COLOR | SHAPE | NUMBER
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong' | 'rule_changed'

  const [card, setCard] = useState({ shape: '🔴', color: 'RED', count: 2, display: '🔴🔴' });

  const SHAPES = ['🔴', '🟦', '🔺'];
  const COLORS = ['RED', 'BLUE', 'GREEN'];
  const COUNTS = [1, 2, 3];

  const generateCard = useCallback(() => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const count = COUNTS[Math.floor(Math.random() * COUNTS.length)];
    const display = Array(count).fill(shape).join('');
    setCard({ shape, color, count, display });
  }, []);

  useEffect(() => {
    generateCard();
  }, [generateCard]);

  const handleChoice = (attrType, value) => {
    let isCorrect = false;
    if (activeRule === 'COLOR' && attrType === 'COLOR' && value === card.color) isCorrect = true;
    if (activeRule === 'SHAPE' && attrType === 'SHAPE' && value === card.shape) isCorrect = true;
    if (activeRule === 'NUMBER' && attrType === 'NUMBER' && value === card.count) isCorrect = true;

    if (isCorrect) {
      sound.playClick();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      addScore(20 + Math.min(nextCombo, 5) * 5);

      const newCount = correctCount + 1;
      setCorrectCount(newCount);

      if (newCount % 4 === 0) {
        const rules = ['COLOR', 'SHAPE', 'NUMBER'].filter((r) => r !== activeRule);
        const nextR = rules[Math.floor(Math.random() * rules.length)];
        setActiveRule(nextR);
        setFeedback('rule_changed');
      } else {
        setFeedback('correct');
      }
    } else {
      addScore(-10);
      setCombo(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      generateCard();
    }, 600);
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <ComboBanner combo={combo} />

      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Gizli Kuralı Keşfet! Kural Her 4 Doğruda Bir Değişir
      </div>

      <div className="h-10 mb-2 flex items-center justify-center">
        {feedback === 'rule_changed' && (
          <span className="sticker-tag bg-neo-yellow text-black text-xs font-black animate-bounce">
            ⚡ KURAL DEĞİŞTİ! YENİ KURALI BUL!
          </span>
        )}
        {feedback === 'correct' && (
          <span className="text-emerald-600 font-black text-sm">✓ DOĞRU EŞLEŞME!</span>
        )}
        {feedback === 'wrong' && (
          <span className="text-rose-500 font-black text-sm">✗ YANLIŞ! GİZLİ KURAL BU DEĞİL.</span>
        )}
      </div>

      <div className="w-full max-w-xs h-36 bg-white border border-ink/15 rounded-3xl flex items-center justify-center text-4xl font-black shadow-card mb-4">
        {card.display}
      </div>

      <div className="w-full max-w-xs space-y-2">
        <div className="text-xs font-bold text-mist text-left">Neye göre eşleştiriyorsun?</div>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleChoice('COLOR', 'RED')} className="py-2.5 rounded-xl bg-paper border border-ink/10 text-xs font-extrabold hover:bg-brand hover:text-white">
            RENK
          </button>
          <button onClick={() => handleChoice('SHAPE', '🔴')} className="py-2.5 rounded-xl bg-paper border border-ink/10 text-xs font-extrabold hover:bg-brand hover:text-white">
            ŞEKİL
          </button>
          <button onClick={() => handleChoice('NUMBER', 2)} className="py-2.5 rounded-xl bg-paper border border-ink/10 text-xs font-extrabold hover:bg-brand hover:text-white">
            SAYI
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 3. ÇİFT VİTES MATRİSİ (dual-rule) — 4 KADRANTLI MATRİS ───────────────────
export function DualRuleGame() {
  const { addScore } = useGameContext();
  const [letter, setLetter] = useState({ char: 'A', isVowel: true, isUpper: true });
  const [combo, setCombo] = useState(0);

  const nextTrial = useCallback(() => {
    const vowels = ['A', 'E', 'İ', 'a', 'e', 'i'];
    const consonants = ['B', 'K', 'M', 'b', 'k', 'm'];
    const pool = [...vowels, ...consonants];
    const ch = pool[Math.floor(Math.random() * pool.length)];

    const isVowel = vowels.includes(ch);
    const isUpper = ch === ch.toUpperCase();

    setLetter({ char: ch, isVowel, isUpper });
  }, []);

  useEffect(() => {
    nextTrial();
  }, [nextTrial]);

  const handleQuadrantClick = (targetVowel, targetUpper) => {
    if (targetVowel === letter.isVowel && targetUpper === letter.isUpper) {
      sound.playClick();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      addScore(20 + Math.min(nextCombo, 5) * 5);
    } else {
      addScore(-10);
      setCombo(0);
    }
    nextTrial();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <ComboBanner combo={combo} />

      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Harfi Çift Kurala Göre Doğru Bölgeye Yerleştir
      </div>

      <div className="w-32 h-32 bg-ink text-white rounded-3xl flex items-center justify-center text-6xl font-black shadow-card my-3 animate-scale-in">
        {letter.char}
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
        <button
          onClick={() => handleQuadrantClick(true, true)}
          className="p-3.5 rounded-2xl bg-white border border-ink/15 text-xs font-extrabold text-ink hover:bg-brand hover:text-white transition-all shadow-sm cursor-pointer"
        >
          SESLİ + BÜYÜK
        </button>
        <button
          onClick={() => handleQuadrantClick(true, false)}
          className="p-3.5 rounded-2xl bg-white border border-ink/15 text-xs font-extrabold text-ink hover:bg-brand hover:text-white transition-all shadow-sm cursor-pointer"
        >
          SESLİ + KÜÇÜK
        </button>
        <button
          onClick={() => handleQuadrantClick(false, true)}
          className="p-3.5 rounded-2xl bg-white border border-ink/15 text-xs font-extrabold text-ink hover:bg-brand hover:text-white transition-all shadow-sm cursor-pointer"
        >
          SESSİZ + BÜYÜK
        </button>
        <button
          onClick={() => handleQuadrantClick(false, false)}
          className="p-3.5 rounded-2xl bg-white border border-ink/15 text-xs font-extrabold text-ink hover:bg-brand hover:text-white transition-all shadow-sm cursor-pointer"
        >
          SESSİZ + KÜÇÜK
        </button>
      </div>
    </div>
  );
}

// ─── 4. TERS RÜZGAR OKLARI (direction-switch) — FLANKER FLEXIBILITY ───────────
export function DirectionSwitchGame() {
  const { addScore } = useGameContext();
  const [rule, setRule] = useState('CENTER'); // CENTER | FLANKERS
  const [arrows, setArrows] = useState({ centerDir: 'LEFT', outerDir: 'RIGHT', display: '➡️ ➡️ ⬅️ ➡️ ➡️' });
  const [combo, setCombo] = useState(0);

  const nextTrial = useCallback(() => {
    const isCenterRule = Math.random() > 0.5;
    setRule(isCenterRule ? 'CENTER' : 'FLANKERS');

    const centerDir = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';
    const outerDir = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';

    const cSymbol = centerDir === 'LEFT' ? '⬅️' : '➡️';
    const oSymbol = outerDir === 'LEFT' ? '⬅️' : '➡️';

    const display = `${oSymbol} ${oSymbol} ${cSymbol} ${oSymbol} ${oSymbol}`;
    setArrows({ centerDir, outerDir, display });
  }, []);

  useEffect(() => {
    nextTrial();
  }, [nextTrial]);

  const handleAns = (chosenDir) => {
    const correctDir = rule === 'CENTER' ? arrows.centerDir : arrows.outerDir;
    if (chosenDir === correctDir) {
      sound.playClick();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      addScore(20 + Math.min(nextCombo, 5) * 5);
    } else {
      addScore(-10);
      setCombo(0);
    }
    nextTrial();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <ComboBanner combo={combo} />

      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Kural Yönüne Dikkat Et!
      </div>

      <div className={`mb-3 px-5 py-2.5 rounded-2xl font-black text-sm uppercase shadow-sm ${
        rule === 'CENTER' ? 'bg-brand text-white' : 'bg-ink text-white'
      }`}>
        {rule === 'CENTER' ? '🎯 ORTADAKİ OKUN YÖNÜ?' : '👀 DIŞTAKİ OKLARIN YÖNÜ?'}
      </div>

      <div className="w-full max-w-xs h-32 bg-white border border-ink/15 rounded-3xl flex items-center justify-center text-3xl font-black shadow-card my-3">
        {arrows.display}
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        <button
          onClick={() => handleAns('LEFT')}
          className="py-4 rounded-2xl bg-paper border border-ink/15 font-black text-xl hover:bg-brand hover:text-white transition-all cursor-pointer shadow-sm"
        >
          ⬅️ SOL
        </button>
        <button
          onClick={() => handleAns('RIGHT')}
          className="py-4 rounded-2xl bg-paper border border-ink/15 font-black text-xl hover:bg-brand hover:text-white transition-all cursor-pointer shadow-sm"
        >
          SAĞ ➡️
        </button>
      </div>
    </div>
  );
}

// ─── 5. ZİHİNSEL VİTES ANAHTARI (task-switch) — DYNAMIC TRAP BUTTONS ─────────
export function TaskSwitchGame() {
  const { addScore } = useGameContext();
  const [position, setPosition] = useState('TOP'); // TOP | BOTTOM
  const [pair, setPair] = useState({ num: 7, letter: 'A', isEven: false, isVowel: true });
  const [traps, setTraps] = useState(getButtonTraps());
  const [combo, setCombo] = useState(0);

  const nextTrial = useCallback(() => {
    const pos = Math.random() > 0.5 ? 'TOP' : 'BOTTOM';
    setPosition(pos);

    const num = Math.floor(Math.random() * 9) + 1;
    const isEven = num % 2 === 0;

    const vowels = ['A', 'E', 'İ'];
    const consonants = ['B', 'K', 'M'];
    const isVowel = Math.random() > 0.5;
    const letter = isVowel
      ? vowels[Math.floor(Math.random() * vowels.length)]
      : consonants[Math.floor(Math.random() * consonants.length)];

    setPair({ num, letter, isEven, isVowel });
    setTraps(getButtonTraps());
  }, []);

  useEffect(() => {
    nextTrial();
  }, [nextTrial]);

  const handleAns = (chosenBoolValue) => {
    const targetCorrect = position === 'TOP' ? pair.isEven : pair.isVowel;
    if (chosenBoolValue === targetCorrect) {
      sound.playClick();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      addScore(20 + Math.min(nextCombo, 5) * 5);
    } else {
      addScore(-10);
      setCombo(0);
    }
    nextTrial();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <ComboBanner combo={combo} />

      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Üstte ise SAYI ÇİFT Mİ? — Altta ise HARF SESLİ Mİ? (Buton Yazılarına Dikkat Et!)
      </div>

      <div className="w-full max-w-xs h-44 bg-paper border border-ink/15 rounded-3xl p-4 flex flex-col justify-between items-center shadow-card my-2 relative">
        {/* TOP BOX */}
        <div className={`w-full py-2.5 rounded-2xl flex items-center justify-center font-black text-2xl transition-all ${
          position === 'TOP' ? 'bg-brand text-white shadow-md scale-105' : 'bg-white/50 text-mist'
        }`}>
          {position === 'TOP' ? `${pair.num} - ${pair.letter}` : '---'}
        </div>

        <div className="w-full border-b border-dashed border-ink/20" />

        {/* BOTTOM BOX */}
        <div className={`w-full py-2.5 rounded-2xl flex items-center justify-center font-black text-2xl transition-all ${
          position === 'BOTTOM' ? 'bg-brand text-white shadow-md scale-105' : 'bg-white/50 text-mist'
        }`}>
          {position === 'BOTTOM' ? `${pair.num} - ${pair.letter}` : '---'}
        </div>
      </div>

      {/* DYNAMIC TRAP BUTTONS */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">
        <button
          onClick={() => handleAns(traps.val1)}
          className={`py-3.5 rounded-2xl text-white font-black text-base shadow-sm transition-all cursor-pointer ${traps.btn1Bg}`}
        >
          {traps.label1 === 'EVET' ? (position === 'TOP' ? 'ÇİFT' : 'SESLİ') : (position === 'TOP' ? 'TEK' : 'SESSİZ')}
        </button>
        <button
          onClick={() => handleAns(traps.val2)}
          className={`py-3.5 rounded-2xl text-white font-black text-base shadow-sm transition-all cursor-pointer ${traps.btn2Bg}`}
        >
          {traps.label2 === 'EVET' ? (position === 'TOP' ? 'ÇİFT' : 'SESLİ') : (position === 'TOP' ? 'TEK' : 'SESSİZ')}
        </button>
      </div>
    </div>
  );
}

// ─── 6. JEST & RENK ESNEKLİĞİ (emotion-flex) ──────────────────────────────────
export function EmotionFlexGame() {
  const { addScore } = useGameContext();
  const [rule, setRule] = useState('EMOTION'); // EMOTION | COLOR
  const [trial, setTrial] = useState({ emoji: '😀', emoName: 'MUTLU', colorHex: '#EF4444', colorName: 'KIRMIZI' });
  const [combo, setCombo] = useState(0);

  const EMO_LIST = [
    { emoji: '😀', name: 'MUTLU' },
    { emoji: '😢', name: 'ÜZGÜN' },
  ];

  const COLOR_LIST = [
    { hex: '#EF4444', name: 'KIRMIZI' },
    { hex: '#3B82F6', name: 'MAVİ' },
  ];

  const nextTrial = useCallback(() => {
    const isEmoRule = Math.random() > 0.5;
    setRule(isEmoRule ? 'EMOTION' : 'COLOR');

    const emo = EMO_LIST[Math.floor(Math.random() * EMO_LIST.length)];
    const col = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];

    setTrial({ emoji: emo.emoji, emoName: emo.name, colorHex: col.hex, colorName: col.name });
  }, []);

  useEffect(() => {
    nextTrial();
  }, [nextTrial]);

  const handleAns = (choice) => {
    const target = rule === 'EMOTION' ? trial.emoName : trial.colorName;
    if (choice === target) {
      sound.playClick();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      addScore(20 + Math.min(nextCombo, 5) * 5);
    } else {
      addScore(-10);
      setCombo(0);
    }
    nextTrial();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <ComboBanner combo={combo} />

      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Kurala Göre Duyguyu ya da Rengi Seç
      </div>

      <div className={`mb-3 px-5 py-2.5 rounded-2xl font-black text-sm uppercase shadow-sm ${
        rule === 'EMOTION' ? 'bg-brand text-white' : 'bg-ink text-white'
      }`}>
        {rule === 'EMOTION' ? '😀 DUYGU İFADESİ NEDİR?' : '🎨 ARKAPLAN RENK ADI NEDİR?'}
      </div>

      <div
        className="w-full max-w-xs h-36 border border-ink/15 rounded-3xl flex items-center justify-center text-6xl shadow-card my-2"
        style={{ backgroundColor: trial.colorHex }}
      >
        {trial.emoji}
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs mt-2">
        {rule === 'EMOTION' ? (
          <>
            <button onClick={() => handleAns('MUTLU')} className="py-3.5 rounded-2xl bg-white border border-ink/15 font-black text-sm text-ink hover:bg-brand hover:text-white shadow-sm cursor-pointer">
              MUTLU 😀
            </button>
            <button onClick={() => handleAns('ÜZGÜN')} className="py-3.5 rounded-2xl bg-white border border-ink/15 font-black text-sm text-ink hover:bg-brand hover:text-white shadow-sm cursor-pointer">
              ÜZGÜN 😢
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleAns('KIRMIZI')} className="py-3.5 rounded-2xl bg-white border border-ink/15 font-black text-sm text-ink hover:bg-brand hover:text-white shadow-sm cursor-pointer">
              KIRMIZI 🔴
            </button>
            <button onClick={() => handleAns('MAVİ')} className="py-3.5 rounded-2xl bg-white border border-ink/15 font-black text-sm text-ink hover:bg-brand hover:text-white shadow-sm cursor-pointer">
              MAVİ 🔵
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── 7. MATRİS REFLEKS ANAHTARI (number-letter-switch) — TRAP BUTTONS & COMBO ─
export function NumberLetterSwitchGame() {
  const { addScore } = useGameContext();
  const [ruleMode, setRuleMode] = useState('NUMBER'); // NUMBER | LETTER
  const [item, setItem] = useState({ val: '7', isNum: true });
  const [traps, setTraps] = useState(getButtonTraps());
  const [combo, setCombo] = useState(0);

  const nextTrial = useCallback(() => {
    const isNumMode = Math.random() > 0.5;
    setRuleMode(isNumMode ? 'NUMBER' : 'LETTER');

    const nums = ['2', '4', '7', '9'];
    const letters = ['A', 'B', 'X', 'Z'];

    const isNum = Math.random() > 0.5;
    const val = isNum
      ? nums[Math.floor(Math.random() * nums.length)]
      : letters[Math.floor(Math.random() * letters.length)];

    setItem({ val, isNum });
    setTraps(getButtonTraps());
  }, []);

  useEffect(() => {
    nextTrial();
  }, [nextTrial]);

  const handleAns = (userChoiceBool) => {
    const isCorrectTarget = ruleMode === 'NUMBER' ? item.isNum : !item.isNum;
    if (userChoiceBool === isCorrectTarget) {
      sound.playClick();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      addScore(20 + Math.min(nextCombo, 5) * 5);
    } else {
      addScore(-10);
      setCombo(0);
    }
    nextTrial();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <ComboBanner combo={combo} />

      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Rakam ve Harf Algı Modları Arasında Vites Değiştir (Buton Yazılarına Dikkat Et!)
      </div>

      <div className={`mb-3 px-5 py-2.5 rounded-2xl font-black text-sm uppercase shadow-sm ${
        ruleMode === 'NUMBER' ? 'bg-brand text-white' : 'bg-ink text-white'
      }`}>
        {ruleMode === 'NUMBER' ? '🔢 BU BİR SAYI MI?' : '🔤 BU BİR HARF Mİ?'}
      </div>

      <div className="w-32 h-32 bg-ink text-white rounded-3xl flex items-center justify-center text-6xl font-black shadow-card my-3">
        {item.val}
      </div>

      {/* DYNAMIC TRAP BUTTONS */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        <button
          onClick={() => handleAns(traps.val1)}
          className={`py-3.5 rounded-2xl text-white font-black text-base shadow-sm transition-all cursor-pointer ${traps.btn1Bg}`}
        >
          {traps.label1}
        </button>
        <button
          onClick={() => handleAns(traps.val2)}
          className={`py-3.5 rounded-2xl text-white font-black text-base shadow-sm transition-all cursor-pointer ${traps.btn2Bg}`}
        >
          {traps.label2}
        </button>
      </div>
    </div>
  );
}
