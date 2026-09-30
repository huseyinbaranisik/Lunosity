import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from './GameContext';
import { sound } from '../utils/sound';

// ─── 1. SUDOKU KLASİK (sudoku-classic) (GERÇEK 9x9 SUDOKU) ───────────────────────
export function SudokuClassicGame() {
  const { addScore } = useGameContext();
  const [selectedCell, setSelectedCell] = useState(null);

  // 9x9 Şablon Bulmacalar (0 = Boş Hücre)
  const PUZZLE_TEMPLATES = [
    {
      initial: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
      ],
      solution: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ]
    }
  ];

  const [grid, setGrid] = useState([]);
  const [initialMask, setInitialMask] = useState([]);

  const initSudoku = useCallback(() => {
    const p = PUZZLE_TEMPLATES[0];
    const initialGrid = p.initial.map((row) => [...row]);
    const mask = p.initial.map((row) => row.map((val) => val !== 0));

    setGrid(initialGrid);
    setInitialMask(mask);
    setSelectedCell(null);
  }, []);

  useEffect(() => {
    initSudoku();
  }, [initSudoku]);

  const handleCellClick = (r, c) => {
    if (initialMask[r]?.[c]) return; // Sabit ipucu hücresine müdahale edilmez
    setSelectedCell({ r, c });
  };

  const handleNumInput = (num) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (initialMask[r][c]) return;

    sound.playClick();
    const nextGrid = grid.map((row) => [...row]);
    nextGrid[r][c] = num;
    setGrid(nextGrid);

    // Çözüm kontrolü
    const sol = PUZZLE_TEMPLATES[0].solution;
    let isCorrectSoFar = true;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (nextGrid[i][j] !== 0 && nextGrid[i][j] !== sol[i][j]) {
          isCorrectSoFar = false;
        }
      }
    }

    if (num !== sol[r][c]) {
      addScore(-5);
    } else {
      addScore(15);
    }

    // Tamamlandı mı?
    const isFullySolved = nextGrid.every((row, i) => row.every((val, j) => val === sol[i][j]));
    if (isFullySolved) {
      addScore(100);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🧩 Gerçek 9x9 Klasik Sudoku — 3x3 Bloklarda 1-9 Sayılarını Tamamla!</span>
      </div>

      {/* 9x9 SUDOKU IZGARASI */}
      <div className="grid grid-cols-9 gap-[1px] bg-black p-2 rounded-2xl border-[4px] border-black shadow-brutal w-[330px] h-[330px] md:w-[380px] md:h-[380px] my-2">
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isInitial = initialMask[r]?.[c];
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            const isSameRowOrCol = selectedCell && (selectedCell.r === r || selectedCell.c === c);
            const isSameSubGrid =
              selectedCell &&
              Math.floor(selectedCell.r / 3) === Math.floor(r / 3) &&
              Math.floor(selectedCell.c / 3) === Math.floor(c / 3);

            // 3x3 Alt Blok Sınır Çizgileri
            const borderRight = (c + 1) % 3 === 0 && c < 8 ? 'border-r-2 border-r-slate-900' : '';
            const borderBottom = (r + 1) % 3 === 0 && r < 8 ? 'border-b-2 border-b-slate-900' : '';

            let bg = 'bg-slate-900 text-white font-black';
            if (isInitial) bg = 'bg-slate-800 text-neo-yellow font-black';
            if (isSameRowOrCol || isSameSubGrid) bg = 'bg-slate-800/80 text-white';
            if (isSelected) bg = 'bg-neo-yellow text-black font-black scale-105 z-10 border-2 border-black';

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`flex items-center justify-center text-xs md:text-base transition-all select-none cursor-pointer ${bg} ${borderRight} ${borderBottom}`}
              >
                {val !== 0 ? val : ''}
              </button>
            );
          })
        )}
      </div>

      {/* 1-9 KLAVYE BUTONLARI */}
      <div className="grid grid-cols-9 gap-1 max-w-sm w-full mt-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumInput(num)}
            className="btn-brutal bg-white text-black font-black text-sm md:text-base py-2.5 px-0 active:scale-95"
          >
            {num}
          </button>
        ))}
      </div>
      <button
        onClick={() => handleNumInput(0)}
        className="mt-2 text-xs font-bold text-neo-red hover:underline"
      >
        🗑️ Seçili Hücreyi Temizle
      </button>
    </div>
  );
}

// ─── 2. MANTIK BULMACASI (logic-puzzle) ───────────────────────────────────────
export function LogicPuzzleGame() {
  const { addScore } = useGameContext();
  const [puzzle, setPuzzle] = useState({ statement: '', ans: '', opts: [] });

  const PUZZLES = [
    { statement: 'Ali, Ece’den daha yaşlıdır. Ece, Can’dan daha yaşlıdır. En genç kimdir?', ans: 'Can', opts: ['Ali', 'Ece', 'Can'] },
    { statement: 'Ahmet, Burak’tan daha ağırdır. Burak, Ceyda’dan daha ağırdır. En hafif kimdir?', ans: 'Ceyda', opts: ['Ahmet', 'Burak', 'Ceyda'] },
    { statement: 'Elif, Deniz ile aynı yaştadır. Deniz, Berk’ten daha büyüktür. En küçük kimdir?', ans: 'Berk', opts: ['Elif', 'Deniz', 'Berk'] },
    { statement: 'Kırmızı Kutu, Mavi Kutu’dan daha ağırdır. Mavi Kutu, Sarı Kutu’dan daha hafiftir. En ağır hangisidir?', ans: 'Kırmızı Kutu', opts: ['Kırmızı Kutu', 'Mavi Kutu', 'Sarı Kutu'] },
    { statement: 'Zeynep, Selin’den daha hızlıdır. Selin, Merve’den daha hızlıdır. En yavaş kimdir?', ans: 'Merve', opts: ['Zeynep', 'Selin', 'Merve'] },
    { statement: 'Murat, Hakan’dan daha yaşlıdır. Hakan, Serkan ile aynı yaştadır. En genç kimlerdir?', ans: 'Hakan ve Serkan', opts: ['Murat', 'Hakan ve Serkan', 'Serkan'] },
    { statement: 'Ağaç A, Ağaç B’den daha uzundur. Ağaç B, Ağaç C’den daha uzundur. En kısa ağaç hangisidir?', ans: 'Ağaç C', opts: ['Ağaç A', 'Ağaç B', 'Ağaç C'] },
    { statement: 'Okul X, Okul Y’den daha büyüktür. Okul Y, Okul Z’den daha büyüktür. En küçük okul hangisidir?', ans: 'Okul Z', opts: ['Okul X', 'Okul Y', 'Okul Z'] }
  ];

  const nextPuzzle = useCallback(() => {
    const p = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    setPuzzle(p);
  }, []);

  useEffect(() => {
    nextPuzzle();
  }, [nextPuzzle]);

  const handleAns = (opt) => {
    if (opt === puzzle.ans) {
      sound.playClick();
      addScore(25);
    } else {
      addScore(-10);
    }
    nextPuzzle();
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>💡 Sözel İlişkilerden Mantık Yürüterek Doğru Cevabı Bul!</span>
      </div>

      <div className="w-full max-w-sm bg-slate-900 border-[3px] border-black p-6 rounded-3xl shadow-brutal my-3 text-white">
        <span className="text-base md:text-lg font-black leading-relaxed text-neo-yellow">{puzzle.statement}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-sm mt-2">
        {puzzle.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAns(opt)}
            className="btn-brutal bg-white hover:bg-neo-yellow text-black font-black text-sm py-3 active:scale-95"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 3. SAYI PİRAMİDİ (number-pyramid) ─────────────────────────────────────────
export function NumberPyramidGame() {
  const { addScore } = useGameContext();
  const [baseNums, setBaseNums] = useState([3, 5, 2, 7]);
  const [targetApex, setTargetApex] = useState(0);
  const [level3, setLevel3] = useState([0, 0, 0]);
  const [level2, setLevel2] = useState([0, 0]);

  const generatePyramid = useCallback(() => {
    // 4 Adet Taban Sayısı
    const b1 = Math.floor(Math.random() * 6) + 2;
    const b2 = Math.floor(Math.random() * 6) + 2;
    const b3 = Math.floor(Math.random() * 6) + 2;
    const b4 = Math.floor(Math.random() * 6) + 2;

    const base = [b1, b2, b3, b4];
    const l3 = [b1 + b2, b2 + b3, b3 + b4];
    const l2 = [l3[0] + l3[1], l3[1] + l3[2]];
    const apex = l2[0] + l2[1];

    setBaseNums(base);
    setLevel3(l3);
    setLevel2(l2);
    setTargetApex(apex);
  }, []);

  useEffect(() => {
    generatePyramid();
  }, [generatePyramid]);

  const handleAns = (userApex) => {
    if (userApex === targetApex) {
      sound.playClick();
      addScore(35);
    } else {
      addScore(-10);
    }
    generatePyramid();
  };

  const options = [targetApex - 4, targetApex, targetApex + 6].sort(() => Math.random() - 0.5);

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🔺 Taban Sayılarından Zirvedeki (?) Sayıya Adım Adım Toplayarak Ulaş!</span>
      </div>

      {/* 4 BASAMAKLI PİRAMİT GÖRSELİ */}
      <div className="flex flex-col items-center gap-2 my-3 p-4 bg-slate-900 border-[3px] border-black rounded-3xl shadow-brutal max-w-sm w-full">
        {/* ZİRVE (LEVEL 1) */}
        <div className="w-24 h-12 bg-neo-yellow text-black border-2 border-black rounded-2xl flex items-center justify-center text-2xl font-black shadow-brutal-sm animate-pulse">
          ?
        </div>

        {/* LEVEL 2 */}
        <div className="flex gap-2">
          {level2.map((val, i) => (
            <div key={i} className="w-20 h-10 bg-neo-purple text-black border-2 border-black rounded-xl flex items-center justify-center font-black text-sm">
              {val}
            </div>
          ))}
        </div>

        {/* LEVEL 3 */}
        <div className="flex gap-2">
          {level3.map((val, i) => (
            <div key={i} className="w-16 h-9 bg-neo-blue text-black border-2 border-black rounded-xl flex items-center justify-center font-black text-xs">
              {val}
            </div>
          ))}
        </div>

        {/* TABAN (LEVEL 4 - DOLU) */}
        <div className="flex gap-2">
          {baseNums.map((val, i) => (
            <div key={i} className="w-14 h-9 bg-white text-black border-2 border-black rounded-xl flex items-center justify-center font-black text-base shadow-sm">
              {val}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-2">
        {options.map((val, i) => (
          <button
            key={i}
            onClick={() => handleAns(val)}
            className="btn-brutal bg-white hover:bg-neo-yellow text-black font-black text-xl py-3 active:scale-95"
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 4. ÖRÜNTÜ TAMAMLA (pattern-complete) ──────────────────────────────────────
export function PatternCompleteGame() {
  const { addScore } = useGameContext();
  const [pattern, setPattern] = useState({ seq: [2, 4, 6, '?'], ans: 8, opts: [7, 8, 9] });

  const nextPattern = useCallback(() => {
    const start = Math.floor(Math.random() * 5) + 1;
    const step = Math.floor(Math.random() * 4) + 2;
    const seq = [start, start + step, start + step * 2, '?'];
    const ans = start + step * 3;
    const opts = [ans - 1, ans, ans + 2].sort(() => Math.random() - 0.5);

    setPattern({ seq, ans, opts });
  }, []);

  useEffect(() => {
    nextPattern();
  }, [nextPattern]);

  const handleAns = (opt) => {
    if (opt === pattern.ans) {
      sound.playClick();
      addScore(20);
    } else {
      addScore(-10);
    }
    nextPattern();
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>⬛ Sayı Örüntüsündeki Soru İşaretini Bul!</span>
      </div>

      <div className="flex gap-2 justify-center my-4">
        {pattern.seq.map((item, i) => (
          <div
            key={i}
            className={`w-16 h-16 rounded-2xl border-2 border-black flex items-center justify-center text-2xl font-black shadow-brutal ${
              item === '?' ? 'bg-neo-yellow text-black animate-pulse' : 'bg-white text-black'
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {pattern.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAns(opt)}
            className="btn-brutal bg-white hover:bg-neo-green text-black font-black text-xl py-3 active:scale-95"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 5. AKIŞ BUL (path-find) (COLOR FLOW FREE) ─────────────────────────────────
export function PathFindGame() {
  const { addScore } = useGameContext();
  const [selectedColor, setSelectedColor] = useState(null);
  const [paths, setPaths] = useState({});

  // 5x5 Grid Renkli Nokta Çiftleri
  const DOT_PAIRS = [
    { id: 'red', color: 'bg-red-500', start: 0, end: 24 },
    { id: 'blue', color: 'bg-blue-500', start: 4, end: 20 },
    { id: 'green', color: 'bg-emerald-500', start: 6, end: 18 },
  ];

  const handleTileClick = (idx) => {
    const matchedDot = DOT_PAIRS.find((d) => d.start === idx || d.end === idx);

    if (matchedDot) {
      if (selectedColor === matchedDot.id) {
        // İki nokta birleşti
        sound.playClick();
        addScore(25);
        setPaths((prev) => ({ ...prev, [matchedDot.id]: true }));
        setSelectedColor(null);
      } else {
        setSelectedColor(matchedDot.id);
      }
    }
  };

  const isComplete = Object.keys(paths).length === DOT_PAIRS.length;

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🗺️ Aynı Renkteki Noktaları Birbiriyle Eşleştir!</span>
      </div>

      <div className="grid grid-cols-5 gap-2 p-3 bg-slate-900 border-[3px] border-black rounded-3xl shadow-brutal w-72 h-72 my-3">
        {Array.from({ length: 25 }).map((_, idx) => {
          const dot = DOT_PAIRS.find((d) => d.start === idx || d.end === idx);
          const isConnected = dot && paths[dot.id];
          const isSelected = dot && selectedColor === dot.id;

          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`rounded-2xl border border-slate-800 flex items-center justify-center transition-all cursor-pointer ${
                dot ? dot.color : 'bg-slate-800/40'
              } ${isSelected ? 'scale-110 border-2 border-white animate-bounce' : ''} ${
                isConnected ? 'opacity-90 ring-4 ring-white' : ''
              }`}
            >
              {dot && <div className="w-4 h-4 rounded-full bg-white/80 shadow-sm" />}
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div className="mt-2 text-neo-green font-black text-lg animate-bounce">
          🎉 Harika! Tüm Renk Akışları Birleşti! (+25 Puan)
        </div>
      )}
    </div>
  );
}

// ─── 6. BLOK YERLEŞTİRME (block-fit) ───────────────────────────────────────────
export function BlockFitGame() {
  const { addScore } = useGameContext();
  const [targetSlot, setTargetSlot] = useState(2);

  const handleAns = (slot) => {
    if (slot === targetSlot) {
      sound.playClick();
      addScore(20);
      setTargetSlot(Math.floor(Math.random() * 3));
    } else {
      addScore(-10);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🧱 Blok Uyumlu Yuva Numarasını Seç!</span>
      </div>

      <div className="w-full max-w-xs h-32 bg-slate-900 text-white border-[3px] border-black rounded-3xl flex items-center justify-center text-3xl font-black shadow-brutal my-3">
        🧱 Slot #{targetSlot + 1}
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-2">
        {[0, 1, 2].map((num) => (
          <button
            key={num}
            onClick={() => handleAns(num)}
            className="btn-brutal bg-white hover:bg-neo-yellow text-black font-black text-sm py-3 active:scale-95"
          >
            Yuva #{num + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 7. NEHİR GEÇİŞİ (river-crossing) ──────────────────────────────────────────
export function RiverCrossingGame() {
  const { addScore } = useGameContext();
  const [step, setStep] = useState(1);

  const handleStep = () => {
    sound.playClick();
    if (step >= 3) {
      addScore(30);
      setStep(1);
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🚣 Nehir Bulmacası — Adım {step}/3</span>
      </div>

      <div className="w-full max-w-xs bg-slate-900 border-[3px] border-black p-6 rounded-3xl shadow-brutal my-3 text-white">
        <span className="text-4xl mb-2 block">🚣‍♂️ 🐑 🐺</span>
        <span className="text-xs font-bold text-slate-300">Kurt ve Koyunu Nehirde Karşıya Geçir!</span>
      </div>

      <button onClick={handleStep} className="btn-brutal bg-neo-yellow text-black font-black w-full max-w-xs py-3 active:scale-95">
        {step === 3 ? 'Karşıya Ulaştın! ✓' : 'Tekneye Bindir ➔'}
      </button>
    </div>
  );
}
