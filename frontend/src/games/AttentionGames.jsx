import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from './GameContext';
import { sound } from '../utils/sound';

// ─── 1. ÇİFT GÖREV (dual-task) ────────────────────────────────────────────────
export function DualTaskGame() {
  const { addScore } = useGameContext();
  const [task, setTask] = useState({ mathQ: '4 + 3', mathAns: 7, isOdd: true });
  const [isSwapped, setIsSwapped] = useState(false);

  const nextTask = useCallback(() => {
    // Toplama, Çıkarma, Çarpma, Bölme işlemleri
    const ops = ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1, n2, ans;

    if (op === '+') {
      n1 = Math.floor(Math.random() * 20) + 1;
      n2 = Math.floor(Math.random() * 20) + 1;
      ans = n1 + n2;
    } else if (op === '-') {
      n1 = Math.floor(Math.random() * 20) + 10;
      n2 = Math.floor(Math.random() * 9) + 1;
      ans = n1 - n2;
    } else if (op === '×') {
      n1 = Math.floor(Math.random() * 9) + 2;
      n2 = Math.floor(Math.random() * 9) + 2;
      ans = n1 * n2;
    } else {
      // Tam bölünen sayılar
      n2 = Math.floor(Math.random() * 8) + 2;
      const mult = Math.floor(Math.random() * 8) + 2;
      n1 = n2 * mult;
      ans = mult;
    }

    // Butonların sırasını ara sıra (%50 ihtimalle) yer değiştir!
    const swap = Math.random() > 0.5;
    setIsSwapped(swap);

    setTask({ mathQ: `${n1} ${op} ${n2}`, mathAns: ans, isOdd: ans % 2 !== 0 });
  }, []);

  useEffect(() => {
    nextTask();
  }, [nextTask]);

  const handleAns = (userOdd) => {
    if (userOdd === task.isOdd) {
      sound.playClick();
      addScore(20);
    } else {
      addScore(-10);
    }
    nextTask();
  };

  const oddButton = (
    <button
      key="odd"
      onClick={() => handleAns(true)}
      className="btn-brutal bg-neo-yellow text-black font-black text-xl py-4 active:scale-95"
    >
      TEK ⚡
    </button>
  );

  const evenButton = (
    <button
      key="even"
      onClick={() => handleAns(false)}
      className="btn-brutal bg-neo-purple text-black font-black text-xl py-4 active:scale-95"
    >
      ÇİFT ⚖️
    </button>
  );

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🔄 Matematik İşleminin Sonucu TEK mi ÇİFT mi? (Buton Yerlerine Dikkat Et!)</span>
      </div>

      <div className="w-full max-w-xs bg-slate-900 border-[3px] border-black p-6 rounded-3xl shadow-brutal my-3 text-white">
        <span className="text-4xl md:text-5xl font-black text-neo-yellow tracking-wider">{task.mathQ} = ?</span>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs mt-2">
        {isSwapped ? [evenButton, oddButton] : [oddButton, evenButton]}
      </div>
      {isSwapped && (
        <span className="text-xs font-bold text-neo-red mt-2 animate-pulse">⚠️ Buton Yerleri Değişti!</span>
      )}
    </div>
  );
}

// ─── 2. ŞEKİL SAYMA (shape-count) ─────────────────────────────────────────────
export function ShapeCountGame() {
  const { addScore } = useGameContext();
  const [targetShape, setTargetShape] = useState('🔺');
  const [shapes, setShapes] = useState([]);
  const [targetCount, setTargetCount] = useState(0);

  const SHAPES = ['🔺', '🟦', '🟡', '⭐', '⬛'];

  const nextRound = useCallback(() => {
    const target = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setTargetShape(target);

    const list = Array.from({ length: 9 }, () => SHAPES[Math.floor(Math.random() * SHAPES.length)]);
    const count = list.filter((s) => s === target).length;

    setShapes(list);
    setTargetCount(count);
  }, []);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  const handleAns = (c) => {
    if (c === targetCount) {
      sound.playClick();
      addScore(20);
    } else {
      addScore(-10);
    }
    nextRound();
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>Tabloda Kaç Tane</span>
        <span className="text-2xl inline-block scale-125 mx-1 drop-shadow-sm">{targetShape}</span>
        <span>Var?</span>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900 border-[3px] border-black rounded-3xl shadow-brutal my-3">
        {shapes.map((s, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-sm"
          >
            {/* Kırmızı üçgen için ölçek büyütme düzeltmesi */}
            <span className={s === '🔺' ? 'scale-125 inline-block transform' : ''}>{s}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-xs mt-2">
        {[0, 1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => handleAns(num)}
            className="btn-brutal bg-white text-black font-black text-xl w-11 h-11 p-0 flex items-center justify-center active:scale-95"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 3. GÖRSEL ARAMA (visual-search) ───────────────────────────────────────────
export function VisualSearchGame() {
  const { addScore } = useGameContext();
  const [targetChar, setTargetChar] = useState('O');
  const [baseChar, setBaseChar] = useState('Q');
  const [matrix, setMatrix] = useState([]);
  const [targetPos, setTargetPos] = useState(0);

  // Zorlu ve birbirine benzeyen hedef / zemin çiftleri
  const PAIRS = [
    { target: 'O', base: 'Q' },
    { target: 'Q', base: 'O' },
    { target: '8', base: 'B' },
    { target: 'B', base: '8' },
    { target: 'E', base: 'F' },
    { target: 'P', base: 'R' },
    { target: '6', base: '9' },
    { target: 'S', base: '5' },
    { target: '0', base: 'O' },
    { target: 'C', base: 'G' },
    { target: '😺', base: '🐱' },
    { target: '😀', base: '😃' },
  ];

  const nextRound = useCallback(() => {
    const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    const pos = Math.floor(Math.random() * 100); // 10x10 matris = 100 eleman

    const grid = Array.from({ length: 100 }, (_, i) => (i === pos ? pair.target : pair.base));

    setTargetChar(pair.target);
    setBaseChar(pair.base);
    setTargetPos(pos);
    setMatrix(grid);
  }, []);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  const handleClick = (idx) => {
    if (idx === targetPos) {
      sound.playClick();
      addScore(30);
    } else {
      addScore(-10);
    }
    nextRound();
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🔍 10x10 Matriste Gizlenen Hedefi Yakala:</span>
        <span className="bg-neo-yellow border border-black px-2 py-0.5 rounded-lg text-lg font-black">{targetChar}</span>
      </div>

      {/* 10x10 YOĞUN MATRİS */}
      <div className="grid grid-cols-10 gap-1 p-2 bg-slate-950 border-[3px] border-black rounded-3xl shadow-brutal w-[330px] h-[330px] my-2">
        {matrix.map((char, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="rounded-md bg-slate-900 border border-slate-800 hover:bg-neo-yellow hover:text-black hover:scale-110 text-slate-300 font-mono font-black text-sm flex items-center justify-center transition-all cursor-pointer select-none active:scale-90"
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 4. ODAK DEĞİŞİMİ (focus-switch) ────────────────────────────────────────────
export function FocusSwitchGame() {
  const { addScore } = useGameContext();
  const [rule, setRule] = useState('RENK: KIRMIZI MI?');
  const [item, setItem] = useState({ text: 'KIRMIZI', colorHex: '#EF4444', isMatch: true });

  const nextRound = useCallback(() => {
    const isColorRule = Math.random() > 0.5;
    const rText = isColorRule ? 'RENK: KIRMIZI MI?' : 'METİN: KIRMIZI MI?';
    setRule(rText);

    const isRedColor = Math.random() > 0.5;
    const isRedText = Math.random() > 0.5;

    const colorHex = isRedColor ? '#EF4444' : '#3B82F6';
    const text = isRedText ? 'KIRMIZI' : 'MAVİ';

    const isMatch = isColorRule ? isRedColor : isRedText;
    setItem({ text, colorHex, isMatch });
  }, []);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  const handleAns = (ans) => {
    if (ans === item.isMatch) {
      sound.playClick();
      addScore(20);
    } else {
      addScore(-10);
    }
    nextRound();
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>💡 Değişen Kuralı Takip Et:</span>
        <span className="bg-neo-orange border border-black px-2 py-0.5 rounded-lg text-xs font-black">{rule}</span>
      </div>

      <div className="w-full max-w-xs h-32 bg-white border-[3px] border-black rounded-3xl flex items-center justify-center shadow-brutal my-2">
        <span className="text-4xl font-black" style={{ color: item.colorHex }}>
          {item.text}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">
        <button
          onClick={() => handleAns(true)}
          className="btn-brutal bg-neo-green text-black font-black text-base py-3"
        >
          EVET 🟢
        </button>
        <button
          onClick={() => handleAns(false)}
          className="btn-brutal bg-neo-red text-white font-black text-base py-3"
        >
          HAYIR 🔴
        </button>
      </div>
    </div>
  );
}
