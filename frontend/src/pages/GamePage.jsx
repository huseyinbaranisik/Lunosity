import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GAMES } from '../constants/games';
import GameWrapper from '../components/GameWrapper';
import { useGameContext } from '../games/GameContext';

// Modular category games imports
import { NumberSequenceGame, WordMemoryGame, ImageMemoryGame, SpatialMemoryGame, SoundMemoryGame } from '../games/MemoryGames';
import { ColorNameTestGame, SpeedTypeGame, QuickClickGame, ChaseSpeedGame } from '../games/SpeedGames';
import { DualTaskGame, ShapeCountGame, VisualSearchGame, FocusSwitchGame } from '../games/AttentionGames';
import { SudokuClassicGame, LogicPuzzleGame, NumberPyramidGame, PatternCompleteGame, PathFindGame, BlockFitGame, RiverCrossingGame } from '../games/ProblemSolvingGames';
import { WordChainGame, WordProduceGame, IdiomCompleteGame, VocabBuilderGame, SpellingBeeGame, RhymeFinderGame, MissingLetterGame, WordSearchGame, SentenceOrderGame } from '../games/LanguageGames';
import { ColorFlexGame, CategorySwitchGame, DualRuleGame, DirectionSwitchGame, TaskSwitchGame, EmotionFlexGame, NumberLetterSwitchGame } from '../games/FlexibilityGames';



// ─── 1. GERÇEK LUMOSITY NESNE TAKİBİ (object-track) ───────────────────────────
function ObjectTrackGame() {
  const { addScore } = useGameContext();
  const [targetCup, setTargetCup] = useState(1);
  const [phase, setPhase] = useState('reveal'); // 'reveal' | 'shuffle' | 'pick' | 'result'
  const [cups, setCups] = useState([0, 1, 2]);
  const [shuffleStep, setShuffleStep] = useState(0);
  const [selectedCup, setSelectedCup] = useState(null);

  const startRound = useCallback(() => {
    const hiddenIn = Math.floor(Math.random() * 3);
    setTargetCup(hiddenIn);
    setCups([0, 1, 2]);
    setSelectedCup(null);
    setShuffleStep(0);
    setPhase('reveal');

    // 1.8 Saniye boyunca parayı göster, ardından bardakları kapatıp karıştır
    setTimeout(() => {
      setPhase('shuffle');

      // Adım adım 4 görsel bardak değişimi animasyonu
      let step = 0;
      const shuffleInterval = setInterval(() => {
        step++;
        setShuffleStep(step);
        setCups((prev) => {
          const nextArr = [...prev];
          const i1 = Math.floor(Math.random() * 3);
          let i2 = Math.floor(Math.random() * 3);
          while (i2 === i1) i2 = Math.floor(Math.random() * 3);

          const temp = nextArr[i1];
          nextArr[i1] = nextArr[i2];
          nextArr[i2] = temp;
          return nextArr;
        });

        if (step >= 5) {
          clearInterval(shuffleInterval);
          setTimeout(() => setPhase('pick'), 400);
        }
      }, 500);
    }, 1800);
  }, []);

  useEffect(() => {
    startRound();
  }, [startRound]);

  const handleCupPick = (cupIdx) => {
    if (phase !== 'pick') return;
    setSelectedCup(cupIdx);
    setPhase('result');

    if (cupIdx === targetCup) {
      addScore(30);
    } else {
      addScore(-10);
    }

    setTimeout(() => {
      startRound();
    }, 2200);
  };

  return (
    <div className="w-full text-center flex flex-col items-center select-none">
      <div className="bg-white border-2 border-black px-4 py-2 rounded-2xl shadow-brutal-sm mb-4 font-black text-xs md:text-sm text-black">
        {phase === 'reveal' && <span className="text-neo-yellow">🪙 Altın Paranın Hangi Bardağın Altında Olduğunu Unutma!</span>}
        {phase === 'shuffle' && <span className="text-neo-purple animate-pulse">🌀 Bardaklar Karıştırılıyor... #{shuffleStep}/5 Takip Et!</span>}
        {phase === 'pick' && <span className="text-neo-blue">👉 Altın Para Hangi Bardağın Altında? Seç!</span>}
        {phase === 'result' && (
          selectedCup === targetCup ? (
            <span className="text-neo-green font-black animate-bounce block">🎉 DOĞRU! Altın Parayı Buldun! (+30 Puan)</span>
          ) : (
            <span className="text-neo-red font-black animate-pulse block">❌ YANLIŞ! Paranın Yeri İşaretlendi. (-10 Puan)</span>
          )
        )}
      </div>

      {/* BARDAKLAR ARENASI */}
      <div className="flex justify-center items-end gap-6 my-6 min-h-[200px] p-6 bg-slate-950 border-[3px] border-black rounded-3xl shadow-brutal w-full max-w-md relative overflow-hidden">
        {cups.map((cupIdx) => {
          const isTarget = targetCup === cupIdx;
          const isSelected = selectedCup === cupIdx;
          const isLifted = phase === 'reveal' || (phase === 'result' && (isTarget || isSelected));

          return (
            <div key={cupIdx} className="flex flex-col items-center relative transition-all duration-300">
              {/* MADENİ PARA (BARDAĞIN ALTINDA) */}
              <div className="absolute bottom-2 flex items-center justify-center w-16 h-16 z-0">
                {isTarget && (
                  <span className="text-4xl animate-bounce drop-shadow-[0_0_10px_#f59e0b]">🪙</span>
                )}
              </div>

              {/* TERS CAM BARDAK (CUP) */}
              <button
                onClick={() => handleCupPick(cupIdx)}
                disabled={phase !== 'pick'}
                className={`w-20 h-28 bg-gradient-to-b from-cyan-400/40 via-blue-500/50 to-indigo-700/80 border-2 border-cyan-300 rounded-t-3xl rounded-b-lg shadow-lg shadow-cyan-500/20 backdrop-blur-md flex flex-col items-center justify-between p-2 cursor-pointer transition-all duration-300 z-10 relative ${
                  isLifted ? '-translate-y-20 shadow-2xl shadow-cyan-400/50 scale-105' : 'hover:-translate-y-2'
                } ${phase === 'pick' ? 'hover:border-neo-yellow active:scale-95' : ''}`}
              >
                <div className="w-12 h-1.5 bg-cyan-200/60 rounded-full mb-1" />
                <span className="text-[10px] font-black tracking-widest text-cyan-100 uppercase">BARDAK #{cupIdx + 1}</span>
                <span className="text-3xl opacity-80 rotate-180 mb-1">🥛</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 2. SNAKE BRAIN (snake-brain) ──────────────────────────────────────────────
function SnakeBrainGame() {
  const { addScore } = useGameContext();
  const GRID_SIZE = 12;

  const getRandomFruitPos = useCallback((currentSnake) => {
    let newPos;
    let safe = false;
    while (!safe) {
      const rx = Math.floor(Math.random() * GRID_SIZE);
      const ry = Math.floor(Math.random() * GRID_SIZE);
      const isOccupied = currentSnake.some((s) => s.x === rx && s.y === ry);
      if (!isOccupied) {
        newPos = { x: rx, y: ry };
        safe = true;
      }
    }
    return newPos;
  }, []);

  const [snake, setSnake] = useState([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [dir, setDir] = useState('RIGHT');
  const dirRef = useRef('RIGHT');
  const [food, setFood] = useState({ x: 9, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  const resetGame = useCallback(() => {
    const initialSnake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    setSnake(initialSnake);
    setDir('RIGHT');
    dirRef.current = 'RIGHT';
    setGameOver(false);
    setGameScore(0);
    setFood(getRandomFruitPos(initialSnake));
  }, [getRandomFruitPos]);

  const changeDir = useCallback((newDir) => {
    const current = dirRef.current;
    if (newDir === 'UP' && current !== 'DOWN') { setDir('UP'); dirRef.current = 'UP'; }
    if (newDir === 'DOWN' && current !== 'UP') { setDir('DOWN'); dirRef.current = 'DOWN'; }
    if (newDir === 'LEFT' && current !== 'RIGHT') { setDir('LEFT'); dirRef.current = 'LEFT'; }
    if (newDir === 'RIGHT' && current !== 'LEFT') { setDir('RIGHT'); dirRef.current = 'RIGHT'; }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') changeDir('UP');
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') changeDir('DOWN');
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') changeDir('LEFT');
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') changeDir('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDir]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = dirRef.current;

        if (currentDir === 'RIGHT') head.x += 1;
        if (currentDir === 'LEFT') head.x -= 1;
        if (currentDir === 'DOWN') head.y += 1;
        if (currentDir === 'UP') head.y -= 1;

        // Duvar çarpmaları (Wall Collision)
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Kendine çarpma (Self Collision)
        const hitSelf = prevSnake.some((segment) => segment.x === head.x && segment.y === head.y);
        if (hitSelf) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Meyve yeme kontrolü
        if (head.x === food.x && head.y === food.y) {
          addScore(20);
          setGameScore((s) => s + 20);
          setFood(getRandomFruitPos(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 130);

    return () => clearInterval(interval);
  }, [gameOver, food, addScore, getRandomFruitPos]);

  return (
    <div className="w-full text-center flex flex-col items-center select-none">
      <div className="text-sm font-black mb-2 flex items-center gap-2">
        <span>🐍 Nöro Yılan (Refleks)</span>
        <span className="bg-neo-yellow px-2 py-0.5 rounded-full border border-black text-xs">Puan: {gameScore}</span>
      </div>

      <div className="relative">
        <div
          className="grid gap-0.5 bg-slate-900 p-2 rounded-2xl border-[3px] border-black shadow-brutal my-2"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: '280px',
            height: '280px',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`rounded-sm transition-all duration-75 flex items-center justify-center ${
                  isHead
                    ? 'bg-emerald-400 border border-black shadow-sm z-10 scale-105'
                    : isBody
                    ? 'bg-emerald-600 border border-slate-800'
                    : isFood
                    ? 'bg-red-500 animate-pulse rounded-full'
                    : 'bg-slate-800/40'
                }`}
              >
                {isFood && <span className="text-[10px]">🍎</span>}
              </div>
            );
          })}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 z-20 animate-fade-in">
            <div className="text-3xl font-black text-neo-red mb-1">OYUN BİTTİ! 💥</div>
            <div className="text-sm text-white mb-4">Toplam Skor: <span className="font-bold text-neo-yellow">{gameScore}</span></div>
            <button
              onClick={resetGame}
              className="btn-brutal bg-neo-green text-black font-black text-sm px-4 py-2 rounded-xl"
            >
              🔄 Yeniden Başla
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 w-48 mt-2">
        <div></div>
        <button onClick={() => changeDir('UP')} className="btn-brutal bg-slate-800 text-white p-2 text-lg active:scale-95">⬆️</button>
        <div></div>
        <button onClick={() => changeDir('LEFT')} className="btn-brutal bg-slate-800 text-white p-2 text-lg active:scale-95">⬅️</button>
        <button onClick={() => changeDir('DOWN')} className="btn-brutal bg-slate-800 text-white p-2 text-lg active:scale-95">⬇️</button>
        <button onClick={() => changeDir('RIGHT')} className="btn-brutal bg-slate-800 text-white p-2 text-lg active:scale-95">➡️</button>
      </div>
    </div>
  );
}

// ─── 3. GERÇEK LUMOSITY HAFIZA IZGARASI (memory-matrix) ───────────────────────
function MemoryMatrixGame() {
  const { addScore } = useGameContext();
  const [stage, setStage] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [targets, setTargets] = useState(new Set());
  const [found, setFound] = useState(new Set());
  const [wrongTile, setWrongTile] = useState(null);
  const [phase, setPhase] = useState('show'); // 'show' | 'test' | 'success' | 'fail'

  const startRound = useCallback((currentStage) => {
    // Stage 1-2: 3x3 | Stage 3-4: 4x4 | Stage 5-6: 5x5 | Stage 7+: 6x6
    // Target count grows gradually, max 10
    let size, count;

    if (currentStage >= 7) {
      size = 6;
      count = Math.min(10, 6 + Math.floor((currentStage - 7) / 2));
    } else if (currentStage >= 5) {
      size = 5;
      count = 4 + (currentStage - 5);           // 5→4, 6→5
    } else if (currentStage >= 3) {
      size = 4;
      count = 3 + (currentStage - 3);           // 3→3, 4→4
    } else {
      size = 3;
      count = 2 + (currentStage - 1);           // 1→2, 2→3
    }

    setGridSize(size);

    // Rastgele benzersiz hedef indeksleri oluştur
    const totalTiles = size * size;
    const newTargets = new Set();
    while (newTargets.size < count) {
      newTargets.add(Math.floor(Math.random() * totalTiles));
    }

    setTargets(newTargets);
    setFound(new Set());
    setWrongTile(null);
    setPhase('show');

    // 1.8 saniye desen gösterimi, ardından test evresi
    setTimeout(() => {
      setPhase('test');
    }, 1800);
  }, []);

  useEffect(() => {
    startRound(stage);
  }, [stage, startRound]);

  const handleTileClick = (index) => {
    if (phase !== 'test' || found.has(index)) return;

    // DOĞRU KARE SEÇİLDİ
    if (targets.has(index)) {
      addScore(15);
      const nextFound = new Set([...found, index]);
      setFound(nextFound);

      // TÜM HEDEF KARELER BULUNDU MU?
      if (nextFound.size === targets.size) {
        addScore(25); // Aşama tamamlama bonusu
        setPhase('success');
        setTimeout(() => {
          setStage((s) => s + 1);
        }, 900);
      }
    } 
    // YANLIŞ KARE SEÇİLDİ
    else {
      addScore(-10);
      setWrongTile(index);
      setPhase('fail');

      // 1.2 saniye bekletip deseni tekrar göstererek turu yeniden başlat
      setTimeout(() => {
        startRound(stage);
      }, 1200);
    }
  };

  const totalTiles = gridSize * gridSize;

  return (
    <div className="w-full text-center flex flex-col items-center">
      {/* ÜST DİNAMİK TALİMAT VE İLERLEME METNİ */}
      <div className="bg-white border-2 border-black px-4 py-2 rounded-2xl shadow-brutal-sm mb-4 font-black text-xs md:text-sm text-black">
        {phase === 'show' && (
          <span className="text-black">
            🧠 Desenli Kareleri Aklında Tut!
          </span>
        )}
        {phase === 'test' && (
          <span className="text-black">
            👉 Desenli Kareleri Sırayla Seç!
          </span>
        )}
        {phase === 'success' && (
          <span className="text-emerald-700 animate-bounce block">
            🎉 Harika! {gridSize}x{gridSize} Aşama Tamamlandı, Zorluk Artıyor! 🚀
          </span>
        )}
        {phase === 'fail' && (
          <span className="text-red-600 animate-pulse block">
            ❌ Hatalı Kare! Desen Tekrar Gösteriliyor...
          </span>
        )}
      </div>

      {/* DİNAMİK RESPONSIVE IZGARA CANVAS */}
      <div
        className={`grid gap-2 bg-black p-3 rounded-3xl border-[3px] border-black shadow-brutal my-2 transition-all duration-300 ${
          gridSize === 3 ? 'grid-cols-3 w-64 h-64'
          : gridSize === 4 ? 'grid-cols-4 w-72 h-72'
          : gridSize === 5 ? 'grid-cols-5 w-80 h-80'
          : 'grid-cols-6 w-96 h-96'
        }`}
      >
        {Array.from({ length: totalTiles }).map((_, i) => {
          const isTarget = targets.has(i);
          const isFound = found.has(i);
          const isWrong = wrongTile === i;

          let tileClass = 'bg-white border-2 border-black hover:bg-slate-100';

          if (phase === 'show' && isTarget) {
            tileClass = 'bg-neo-yellow border-[3px] border-black shadow-brutal scale-105';
          } else if (isFound) {
            // DOĞRU DOKUNULAN KARELER DİĞERLERİNE BASANA KADAR YEŞİL KALIR
            tileClass = 'bg-neo-green text-black font-black border-[3px] border-black shadow-brutal scale-105 animate-pulse';
          } else if (isWrong) {
            tileClass = 'bg-neo-red text-white border-[3px] border-black animate-shake';
          } else if (phase === 'fail' && isTarget) {
            tileClass = 'bg-neo-yellow border-2 border-black opacity-80';
          }

          return (
            <button
              key={i}
              onClick={() => handleTileClick(i)}
              disabled={phase !== 'test' || isFound}
              className={`rounded-2xl transition-all cursor-pointer select-none ${tileClass}`}
            />
          );
        })}
      </div>

      {/* AŞAMA BİLGİ ETİKETİ */}
      <div className="flex items-center gap-2 mt-2">
        <span className="sticker-tag bg-neo-yellow">AŞAMA: {stage}</span>
        <span className="sticker-tag bg-neo-purple">IZGARA: {gridSize}x{gridSize}</span>
      </div>
    </div>
  );
}

// ─── 4. STROOP TESTİ (stroop-test) ─────────────────────────────────────────────
// ─── 4. STROOP TESTİ (stroop-test) ─────────────────────────────────────────────
function StroopTestGame() {
  const { addScore } = useGameContext();
  const colors = [
    { name: 'KIRMIZI', hex: '#ef4444' },
    { name: 'MAVİ', hex: '#3b82f6' },
    { name: 'YEŞİL', hex: '#10b981' },
    { name: 'SARI', hex: '#f59e0b' },
  ];

  const [current, setCurrent] = useState({ word: 'KIRMIZI', colorHex: '#3b82f6', targetHex: '#3b82f6' });
  const [mode, setMode] = useState('color'); // 'color' | 'word'
  const [shuffledOpts, setShuffledOpts] = useState([]);

  const nextRound = useCallback(() => {
    const wObj = colors[Math.floor(Math.random() * colors.length)];
    const cObj = colors[Math.floor(Math.random() * colors.length)];
    const isColorMode = Math.random() > 0.5;

    setMode(isColorMode ? 'color' : 'word');
    setCurrent({
      word: wObj.name,
      wordHex: wObj.hex,
      colorHex: cObj.hex,
      targetHex: isColorMode ? cObj.hex : wObj.hex,
    });
    setShuffledOpts([...colors].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  const handleChoice = (hex) => {
    if (hex === current.targetHex) addScore(20);
    else addScore(-10);
    nextRound();
  };

  return (
    <div className="w-full text-center flex flex-col items-center select-none">
      <div className="bg-white border-2 border-black px-4 py-2 rounded-2xl shadow-brutal-sm mb-4 font-black text-xs md:text-sm text-black">
        {mode === 'color' ? (
          <span className="text-neo-purple">🎨 Kelimenin YAZILDIĞI RENK (Mürekkep Rengi) Hangisi?</span>
        ) : (
          <span className="text-neo-blue">🔤 EKRANDA NE YAZIYOR (Yazı Okunuşu)?</span>
        )}
      </div>

      <div
        className="text-5xl md:text-6xl font-black bg-slate-900 border-[4px] border-black p-6 rounded-3xl shadow-brutal mb-6 transition-all"
        style={{ color: current.colorHex }}
      >
        {current.word}
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-xs w-full">
        {shuffledOpts.map((c) => (
          <button
            key={c.name}
            onClick={() => handleChoice(c.hex)}
            className="btn-brutal text-sm md:text-base border-2 border-black text-white font-black py-3 shadow-brutal active:scale-95"
            style={{ backgroundColor: c.hex }}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 5. TEPKİ TESTİ (reaction-test) ───────────────────────────────────────────
function ReactionTestGame() {
  const { addScore } = useGameContext();
  const [state, setState] = useState('wait'); // 'wait' | 'ready' | 'result' | 'early'
  const [startTime, setStartTime] = useState(0);
  const [ms, setMs] = useState(0);
  const [gainedPoints, setGainedPoints] = useState(0);

  useEffect(() => {
    let t;
    if (state === 'wait') {
      const delay = Math.floor(Math.random() * 2500) + 1800;
      t = setTimeout(() => {
        setState('ready');
        setStartTime(Date.now());
      }, delay);
    }
    return () => clearTimeout(t);
  }, [state]);

  const handleClick = () => {
    // ERKEN TIKLAMA (SARI SÜREÇTE)
    if (state === 'wait') {
      addScore(-20);
      setState('early');
      setTimeout(() => {
        setState('wait');
      }, 1200);
      return;
    }

    // YEŞİL OLDUĞUNDA TIKLAMA
    if (state === 'ready') {
      const elapsed = Date.now() - startTime;
      setMs(elapsed);
      // Orantılı skor formülü: 150ms -> ~90-100 puan, 300ms -> ~60 puan, 500ms -> ~20 puan
      const points = Math.max(0, Math.min(100, Math.round(120 - elapsed / 5)));
      addScore(points);
      setGainedPoints(points);
      setState('result');
    }
  };

  const handleRestart = (e) => {
    e.stopPropagation();
    setState('wait');
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full max-w-sm h-64 rounded-3xl border-[4px] border-black shadow-brutal flex flex-col items-center justify-center cursor-pointer select-none transition-all p-4 ${
        state === 'wait'
          ? 'bg-neo-yellow'
          : state === 'ready'
          ? 'bg-neo-green animate-pulse scale-105'
          : state === 'early'
          ? 'bg-neo-red text-white animate-shake'
          : 'bg-neo-blue text-black'
      }`}
    >
      {state === 'wait' && (
        <div className="text-center">
          <span className="text-3xl font-black block mb-2">🟡 BEKLE...</span>
          <span className="text-sm font-black">Ekran YEŞİL Olunca Anında Tıkla!</span>
          <span className="text-xs font-bold block mt-2 text-slate-800">⚠️ Erken Tıklarsan -20 Ceza Alırsın!</span>
        </div>
      )}

      {state === 'ready' && (
        <span className="text-5xl font-black tracking-widest animate-bounce">🟢 ŞİMDİ TIKLA!</span>
      )}

      {state === 'early' && (
        <div className="text-center">
          <span className="text-3xl font-black block mb-1">❌ ERKEN TIKLADIN!</span>
          <span className="text-lg font-black bg-black text-white px-3 py-1 rounded-xl block my-2">-20 Ceza Puanı</span>
          <span className="text-xs font-bold block">Yeniden başlatılıyor...</span>
        </div>
      )}

      {state === 'result' && (
        <div className="text-center flex flex-col items-center">
          <span className="text-xs font-black uppercase tracking-widest mb-1">Refleks Süren:</span>
          <span className="text-5xl font-black mb-1">{ms} ms</span>
          <span className="bg-neo-yellow text-black font-black text-sm px-3 py-1 rounded-xl border border-black shadow-sm mb-4">
            Kazanılan Skor: +{gainedPoints} Puan
          </span>
          <button
            onClick={handleRestart}
            className="btn-brutal bg-white text-black font-black text-xs px-4 py-2"
          >
            🔄 Tekrar Dene
          </button>
        </div>
      )}
    </div>
  );
}

// ─── 6. HIZLI MATEMATİK (fast-math) ────────────────────────────────────────────
function FastMathGame() {
  const { addScore } = useGameContext();
  const [math, setMath] = useState({ q: '6 + 7', a: 13, opts: [11, 13, 14, 15] });

  const nextMath = useCallback(() => {
    const n1 = Math.floor(Math.random() * 20) + 5;
    const n2 = Math.floor(Math.random() * 20) + 5;
    const ans = n1 + n2;
    const opts = [ans, ans + 2, Math.max(1, ans - 3), ans + 4].sort(() => Math.random() - 0.5);
    setMath({ q: `${n1} + ${n2}`, a: ans, opts });
  }, []);

  const handleAns = (val) => {
    if (val === math.a) addScore(15);
    else addScore(-10);
    nextMath();
  };

  return (
    <div className="w-full text-center flex flex-col items-center">
      <div className="text-5xl font-black bg-neo-yellow border-[3px] border-black p-6 rounded-3xl shadow-brutal mb-6">
        {math.q} = ?
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {math.opts.map((o, i) => (
          <button key={i} onClick={() => handleAns(o)} className="btn-brutal text-2xl bg-white hover:bg-neo-purple">
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 7. HARF SAYISI (letter-count) ────────────────────────────────────────────
function LetterCountGame() {
  const { addScore } = useGameContext();

  // 50+ kelimelik geniş havuz — her çağrıda karıştırılır
  const ALL_WORDS = [
    { word: 'KAHRAMANMARAŞ', letter: 'A' },
    { word: 'CUMHURİYET', letter: 'U' },
    { word: 'BİLGİSAYAR', letter: 'A' },
    { word: 'KÜTÜPHANE', letter: 'Ü' },
    { word: 'ANTALYA', letter: 'A' },
    { word: 'MARMARA', letter: 'A' },
    { word: 'ANKARA', letter: 'A' },
    { word: 'İSTANBUL', letter: 'İ' },
    { word: 'TÜRKÇE', letter: 'T' },
    { word: 'MATEM ATİK', letter: 'A' },
    { word: 'MATEMATIK', letter: 'A' },
    { word: 'COĞRAFYA', letter: 'A' },
    { word: 'TARIH', letter: 'A' },
    { word: 'ELEKTRİK', letter: 'E' },
    { word: 'TELEFON', letter: 'E' },
    { word: 'BAŞARI', letter: 'A' },
    { word: 'KARAKTER', letter: 'A' },
    { word: 'KAZANAN', letter: 'A' },
    { word: 'MANZARA', letter: 'A' },
    { word: 'REKLAM', letter: 'A' },
    { word: 'SAVAŞAN', letter: 'A' },
    { word: 'KARADENIZ', letter: 'A' },
    { word: 'BAKLAVA', letter: 'A' },
    { word: 'YARATICI', letter: 'A' },
    { word: 'GÜNEŞ', letter: 'Ü' },
    { word: 'BÜYÜKADA', letter: 'Ü' },
    { word: 'GÜLÜCÜK', letter: 'Ü' },
    { word: 'KÖPRÜLÜ', letter: 'Ü' },
    { word: 'ÜSTÜNLÜK', letter: 'Ü' },
    { word: 'DÜNYALIL', letter: 'Ü' },
    { word: 'YÜZÜNCÜ', letter: 'Ü' },
    { word: 'ÇEKIRDEK', letter: 'E' },
    { word: 'ELELE', letter: 'E' },
    { word: 'SERBESTLIK', letter: 'E' },
    { word: 'MEMLEKET', letter: 'E' },
    { word: 'BEKLEMEK', letter: 'E' },
    { word: 'TEPELER', letter: 'E' },
    { word: 'ÇELENK', letter: 'E' },
    { word: 'GELENEKSEL', letter: 'E' },
    { word: 'İLKÖĞRETİM', letter: 'İ' },
    { word: 'İSTİKLAL', letter: 'İ' },
    { word: 'İZMİR', letter: 'İ' },
    { word: 'İLERİ', letter: 'İ' },
    { word: 'BİRİNCİ', letter: 'İ' },
    { word: 'ÖĞRENCI', letter: 'Ö' },
    { word: 'KÖMÜRHAN', letter: 'Ö' },
    { word: 'ÖZGÜRLÜK', letter: 'Ö' },
    { word: 'ÖRDEK', letter: 'Ö' },
    { word: 'ÖNDERLIK', letter: 'Ö' },
    { word: 'GÖZLEMEVI', letter: 'Ö' },
    { word: 'SÖZLÜK', letter: 'Ö' },
  ];

  // Doğru sayıyı hesapla ve seçenekler üret
  const buildQuestion = (item) => {
    const count = item.word.split('').filter(ch => ch === item.letter).length;
    const opts = new Set([count]);
    while (opts.size < 4) {
      const d = Math.floor(Math.random() * 3) - 1; // -1, 0, +1, +2
      const candidate = count + d + (opts.size > 2 ? 2 : 0);
      if (candidate >= 0) opts.add(candidate);
    }
    return { ...item, count, opts: [...opts].sort(() => Math.random() - 0.5) };
  };

  // Karıştırılmış soru kuyruğu
  const buildQueue = () =>
    [...ALL_WORDS].sort(() => Math.random() - 0.5).map(buildQuestion);

  const [queue, setQueue] = useState(() => buildQueue());
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong' | idx

  const curr = queue[idx];

  const handleChoice = (val, optIdx) => {
    if (feedback !== null) return;
    const correct = val === curr.count;
    setFeedback(optIdx); // hangi butona basıldığını tut
    if (correct) addScore(20);
    else addScore(-10);

    setTimeout(() => {
      setFeedback(null);
      const nextIdx = idx + 1;
      if (nextIdx >= queue.length) {
        setQueue(buildQueue());
        setIdx(0);
      } else {
        setIdx(nextIdx);
      }
    }, 450);
  };

  return (
    <div className="w-full text-center flex flex-col items-center">
      <div className="text-sm font-black mb-2">Bu kelimede kaç tane <span className="bg-neo-yellow border border-black px-2 rounded-lg">{curr.letter}</span> harfi var?</div>
      <div className="text-3xl md:text-4xl font-black bg-neo-purple text-black border-[3px] border-black p-6 rounded-3xl shadow-brutal mb-6 tracking-widest">
        {curr.word}
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {curr.opts.map((o, i) => {
          let btnClass = 'btn-brutal text-xl bg-white';
          if (feedback !== null) {
            if (o === curr.count) btnClass = 'btn-brutal text-xl bg-neo-green border-neo-green';
            else if (i === feedback) btnClass = 'btn-brutal text-xl bg-neo-red text-white';
          }
          return (
            <button key={i} onClick={() => handleChoice(o, i)} className={btnClass}>
              {o} Tane
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 8. KART ÇEVİRME (card-flip) ───────────────────────────────────────────────
function CardFlipGame() {
  const { addScore } = useGameContext();

  // 60+ farklı emoji — hayvanlar, yiyecekler, nesneler, spor, doğa, yüzler, araçlar
  const EMOJI_POOL = [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦆','🦅',
    '🦉','🦇','🐺','🐗','🐴','🦄','🐝','🦋','🐛','🐌',
    '🍎','🍊','🍋','🍇','🍓','🍒','🥝','🍍','🥭','🍑',
    '⚽','🏀','🎾','🏈','⚾','🎱','🏐','🎯','🎳','🎮',
    '🚀','🛸','✈️','🚂','🚢','🏎️','🚁','🛺','🚲','🛵',
    '🌈','🌞','🌙','⭐','☄️','🌊','🌋','🏔️','🌸','🍀',
  ];

  // Aşama 1 → 10 çift (20 kart) | Aşama 2 → 15 çift (30 kart) | Aşama 3+ → 20 çift (40 kart)
  const [stage, setStage] = useState(1);
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);
  const [wrongPair, setWrongPair] = useState([]);

  const buildDeck = useCallback((s) => {
    const pairs = s === 1 ? 10 : s === 2 ? 15 : 20;
    const pool = [...EMOJI_POOL].sort(() => Math.random() - 0.5).slice(0, pairs);
    const deck = [...pool, ...pool]
      .sort(() => Math.random() - 0.5)
      .map((val, i) => ({ id: i, val, flipped: false, matched: false }));
    return deck;
  }, []);

  useEffect(() => {
    setCards(buildDeck(stage));
    setSelected([]);
    setLocked(false);
    setWrongPair([]);
  }, [stage, buildDeck]);

  const totalPairs = stage === 1 ? 10 : stage === 2 ? 15 : 20;
  const matchedCount = cards.filter(c => c.matched).length / 2;

  // Tüm eşler bulununca sonraki aşamaya geç
  useEffect(() => {
    if (cards.length > 0 && matchedCount === totalPairs) {
      addScore(50); // aşama tamamlama bonusu
      setTimeout(() => setStage(s => Math.min(s + 1, 3)), 900);
    }
  }, [matchedCount, totalPairs, cards.length]);

  const handleCardClick = (idx) => {
    if (locked || cards[idx].flipped || cards[idx].matched) return;

    const newCards = cards.map((c, i) =>
      i === idx ? { ...c, flipped: true } : c
    );
    setCards(newCards);

    const newSel = [...selected, idx];
    setSelected(newSel);

    if (newSel.length === 2) {
      setLocked(true);
      const [a, b] = newSel;
      if (newCards[a].val === newCards[b].val) {
        // EŞLEŞTİ
        addScore(15);
        const matched = newCards.map((c, i) =>
          i === a || i === b ? { ...c, matched: true } : c
        );
        setTimeout(() => {
          setCards(matched);
          setSelected([]);
          setLocked(false);
        }, 400);
      } else {
        // EŞLEŞMEDİ
        addScore(-5);
        setWrongPair([a, b]);
        setTimeout(() => {
          setCards(prev =>
            prev.map((c, i) =>
              i === a || i === b ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
          setLocked(false);
          setWrongPair([]);
        }, 900);
      }
    }
  };

  // Grid sütun sayısı: 20 kart → 5 col | 30 kart → 6 col | 40 kart → 8 col
  const colClass = stage === 1 ? 'grid-cols-5' : stage === 2 ? 'grid-cols-6' : 'grid-cols-8';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-3 mb-3">
        <span className="sticker-tag bg-neo-yellow">AŞAMA: {stage}/3</span>
        <span className="sticker-tag bg-neo-purple">
          {cards.filter(c => c.matched).length / 2} / {totalPairs} Eşleşti
        </span>
        <span className="sticker-tag bg-neo-green">{totalPairs * 2} KART</span>
      </div>

      <div className={`grid ${colClass} gap-1.5`}>
        {cards.map((c, i) => {
          const isWrong = wrongPair.includes(i);
          let cardBg = c.matched
            ? 'bg-neo-green border-neo-green'
            : c.flipped
              ? isWrong
                ? 'bg-neo-red border-neo-red text-white'
                : 'bg-neo-yellow border-black'
              : 'bg-white border-black hover:bg-slate-100';

          // Kart boyutu: aşamaya göre küçülür
          const sizeClass = stage === 1
            ? 'w-14 h-16 text-2xl'
            : stage === 2
              ? 'w-12 h-14 text-xl'
              : 'w-10 h-12 text-lg';

          return (
            <button
              key={c.id}
              onClick={() => handleCardClick(i)}
              disabled={c.matched || locked}
              className={`${sizeClass} rounded-xl border-2 flex items-center justify-center font-black shadow-brutal-sm transition-all duration-200 select-none cursor-pointer ${cardBg}`}
            >
              {c.flipped || c.matched ? c.val : '?'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 9. KELİME BULMACA (wordle-game) ───────────────────────────────────────────
function WordleGame() {
  const { addScore } = useGameContext();
  const [guess, setGuess] = useState('');
  const targetWord = 'KALEM';

  const handleGuess = () => {
    if (guess.length !== 5) return;
    if (guess.toUpperCase() === targetWord) {
      addScore(50);
      setGuess('');
    } else {
      addScore(-10);
      setGuess('');
    }
  };

  return (
    <div className="w-full text-center flex flex-col items-center">
      <div className="text-sm font-black mb-2">🔤 5 Harfli Gizli Kelimeyi Bul!</div>
      <div className="flex gap-2 my-4">
        {['K', 'A', 'L', 'E', 'M'].map((letter, i) => (
          <div key={i} className="w-12 h-12 rounded-xl bg-neo-green border-2 border-black flex items-center justify-center text-xl font-black shadow-brutal">
            {guess[i] ? guess[i].toUpperCase() : '?'}
          </div>
        ))}
      </div>
      <div className="flex gap-2 max-w-xs w-full">
        <input
          type="text"
          maxLength={5}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="BEŞ HARF..."
          className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-center font-black uppercase shadow-brutal-sm"
        />
        <button onClick={handleGuess} className="btn-brutal bg-neo-yellow">
          Tahmin Et
        </button>
      </div>
    </div>
  );
}

// ─── 10. ANAGRAM (anagram) ────────────────────────────────────────────────────
function AnagramGame() {
  const { addScore } = useGameContext();
  const WORD_POOL = [
    'KALEM', 'KATİP', 'DENİZ', 'GÜNEŞ', 'KİTAP', 'MASAL', 'ORMAN',
    'BEYİN', 'ODAK', 'YILDIZ', 'DÜNYA', 'ÇİÇEK', 'GÖRSEL', 'REFLEKS',
    'HAFIZA', 'BİLİŞSEL', 'MANTIK', 'TIRMAN', 'KAPLAN', 'KARTAL',
    'ZAMAN', 'GÜCÜM', 'BAŞARI', 'SAVAŞ', 'KARAR', 'DÜŞÜN', 'ZİHİN'
  ];

  const shuffleWord = useCallback((word) => {
    let chars = word.split('');
    let shuffled = [...chars];
    let attempts = 0;
    while (
      (shuffled.join('') === word || shuffled.join('') === word.split('').reverse().join('')) &&
      attempts < 20
    ) {
      shuffled.sort(() => Math.random() - 0.5);
      attempts++;
    }
    return shuffled.join(' - ');
  }, []);

  const [currentWord, setCurrentWord] = useState('KALEM');
  const [scrambledText, setScrambledText] = useState('E - L - K - A - M');
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const nextRound = useCallback(() => {
    const target = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    const sc = shuffleWord(target);
    setCurrentWord(target);
    setScrambledText(sc);
    setInput('');
    setFeedback(null);
  }, [shuffleWord]);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  const handleCheck = () => {
    if (input.trim().toUpperCase() === currentWord) {
      addScore(30);
      setFeedback('correct');
      setTimeout(() => {
        nextRound();
      }, 700);
    } else {
      addScore(-10);
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
      }, 800);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCheck();
  };

  return (
    <div className="w-full text-center flex flex-col items-center select-none">
      <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-2xl shadow-brutal-sm mb-3 font-black text-xs md:text-sm text-black">
        <span>🔀 Karışık Harfleri Düzenleyerek Doğru Kelimeyi Bul!</span>
      </div>

      <div className="text-3xl md:text-4xl font-mono font-black bg-neo-orange border-[3px] border-black p-5 rounded-3xl shadow-brutal mb-4 tracking-widest text-black">
        {scrambledText}
      </div>

      <div className="flex gap-2 max-w-xs w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Kelimeyi Yaz..."
          className={`w-full bg-white border-[3px] border-black rounded-2xl px-3 py-2 text-center font-black uppercase text-xl shadow-brutal focus:outline-none transition-all ${
            feedback === 'correct' ? 'border-neo-green bg-green-50' : feedback === 'wrong' ? 'border-neo-red bg-red-50 animate-shake' : ''
          }`}
          autoFocus
        />
        <button onClick={handleCheck} className="btn-brutal bg-neo-yellow text-black font-black px-4 py-2 text-sm">
          Onayla
        </button>
      </div>

      {feedback === 'correct' && (
        <div className="mt-3 text-neo-green font-black text-sm animate-bounce">✓ Doğru Kelime! (+30 Puan)</div>
      )}
      {feedback === 'wrong' && (
        <div className="mt-3 text-neo-red font-black text-sm animate-pulse">❌ Yanlış Tahmin! (-10 Puan)</div>
      )}
    </div>
  );
}

// ─── 11. HIZLI SIRALAMA (fast-sort) ────────────────────────────────────────────
function FastSortGame() {
  const { addScore } = useGameContext();
  const [stage, setStage] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const [targetCount, setTargetCount] = useState(3);
  const [isError, setIsError] = useState(false);

  const generateNums = useCallback((currentStage) => {
    // Stage 1 -> 3 sayı | Stage 2 -> 4 sayı | Stage 3 -> 5 sayı | Stage 4+ -> 6 sayı (maks 6)
    const count = Math.min(6, 2 + currentStage);
    setTargetCount(count);

    const setOfNums = new Set();
    while (setOfNums.size < count) {
      setOfNums.add(Math.floor(Math.random() * 90) + 10);
    }
    setNumbers([...setOfNums]);
    setIsError(false);
  }, []);

  useEffect(() => {
    generateNums(stage);
  }, [stage, generateNums]);

  const handleNumClick = (val) => {
    const minVal = Math.min(...numbers);
    if (val === minVal) {
      addScore(15);
      const remaining = numbers.filter((n) => n !== val);

      if (remaining.length === 0) {
        addScore(30); // Aşama tamamlama bonusu
        setStage((s) => s + 1);
      } else {
        setNumbers(remaining);
      }
    } else {
      addScore(-10);
      setIsError(true);
      setTimeout(() => {
        generateNums(stage); // Yanlış tıklamada aşamayı resetle
      }, 500);
    }
  };

  return (
    <div className="w-full text-center flex flex-col items-center select-none">
      <div className="flex items-center gap-2 mb-3">
        <span className="sticker-tag bg-neo-yellow">AŞAMA: {stage}</span>
        <span className="sticker-tag bg-neo-purple">{targetCount} ADET SAYI</span>
      </div>

      <div className="bg-white border-2 border-black px-4 py-2 rounded-2xl shadow-brutal-sm mb-4 font-black text-xs md:text-sm text-black">
        📊 En KÜÇÜK Sayıdan Başlayarak Küçükten Büyüğe Sırayla Tıkla!
      </div>

      <div className={`flex flex-wrap justify-center gap-3 max-w-sm p-4 rounded-3xl transition-all ${
        isError ? 'bg-neo-red/20 border-2 border-neo-red animate-shake' : ''
      }`}>
        {numbers.map((n) => (
          <button
            key={n}
            onClick={() => handleNumClick(n)}
            className="btn-brutal text-2xl md:text-3xl bg-white hover:bg-neo-yellow px-5 py-3 shadow-brutal active:scale-95"
          >
            {n}
          </button>
        ))}
      </div>

      {isError && (
        <div className="mt-3 text-neo-red font-black text-sm animate-pulse">❌ Yanlış Sıra! Sayılar Yenileniyor...</div>
      )}
    </div>
  );
}


// ─── 13. KATEGORİ ÖZEL DİNAMİK BİLİŞSEL OYUN MOTORLARI ────────────────────────
function GenericCategoryGame({ game }) {
  const { addScore } = useGameContext();
  const [round, setRound] = useState(0);

  // HAFIZA MOTORU (Memory Engine)
  const [memoryTrial, setMemoryTrial] = useState({ target: '🍎', opts: ['🍎', '🍌', '🍇', '🍒'], phase: 'show' });
  // HIZ MOTORU (Speed Engine)
  const [speedTrial, setSpeedTrial] = useState({ target: '⚡', opts: ['⚡', '🔥', '🌟', '💥'] });
  // DİKKAT MOTORU (Attention Engine)
  const [attentionTrial, setAttentionTrial] = useState({ grid: ['🟢', '🟢', '🔴', '🟢'], oddIdx: 2 });
  // PROBLEM ÇÖZME MOTORU (Problem Solving Engine)
  const [logicTrial, setLogicTrial] = useState({ q: '2 ➔ 4 ➔ 8 ➔ 16 ➔ ?', ans: 32, opts: [24, 30, 32, 64] });
  // DİL MOTORU (Language Engine)
  const [langTrial, setLangTrial] = useState({ q: 'K E L _ M E', ans: 'İ', opts: ['A', 'İ', 'E', 'O'] });
  // ESNEKLİK MOTORU (Flexibility Engine)
  const [flexTrial, setFlexTrial] = useState({ rule: 'TEK SAYI SEÇ', num: 7, isOdd: true });

  const nextTrial = useCallback(() => {
    setRound((r) => r + 1);
    const cat = game.category;

    if (cat === 'memory') {
      const pool = ['🍎', '🍌', '🍇', '🍒', '🍓', '🥑', '🍍', '🥝'];
      const target = pool[Math.floor(Math.random() * pool.length)];
      const opts = [target, ...pool.filter((p) => p !== target).slice(0, 3)].sort(() => Math.random() - 0.5);
      setMemoryTrial({ target, opts, phase: 'show' });
      setTimeout(() => {
        setMemoryTrial((prev) => ({ ...prev, phase: 'test' }));
      }, 1200);
    } else if (cat === 'speed') {
      const pool = ['⚡', '🔥', '🌟', '💥', '🚀', '🎯', '💎', '🏆'];
      const target = pool[Math.floor(Math.random() * pool.length)];
      const opts = [target, ...pool.filter((p) => p !== target).slice(0, 3)].sort(() => Math.random() - 0.5);
      setSpeedTrial({ target, opts });
    } else if (cat === 'attention') {
      const norm = '🟢';
      const odd = '🔴';
      const grid = [norm, norm, norm, norm];
      const oddIdx = Math.floor(Math.random() * 4);
      grid[oddIdx] = odd;
      setAttentionTrial({ grid, oddIdx });
    } else if (cat === 'problem-solving') {
      const base = Math.floor(Math.random() * 10) + 2;
      const step = Math.floor(Math.random() * 5) + 2;
      const ans = base + step * 3;
      const q = `${base} ➔ ${base + step} ➔ ${base + step * 2} ➔ ?`;
      const opts = [ans, ans + 2, Math.max(1, ans - 3), ans + 5].sort(() => Math.random() - 0.5);
      setLogicTrial({ q, ans, opts });
    } else if (cat === 'language') {
      const langList = [
        { q: 'K E L _ M E', ans: 'İ', opts: ['A', 'İ', 'E', 'O'] },
        { q: 'T Ü R K _ İ Y E', ans: 'Ç', opts: ['C', 'Ç', 'S', 'Z'] },
        { q: 'B E Y _ N', ans: 'İ', opts: ['A', 'E', 'İ', 'U'] },
        { q: 'Ö Z G _ N', ans: 'Ü', opts: ['U', 'Ü', 'O', 'Ö'] }
      ];
      const selected = langList[Math.floor(Math.random() * langList.length)];
      setLangTrial(selected);
    } else if (cat === 'flexibility') {
      const isOddRule = Math.random() > 0.5;
      const num = Math.floor(Math.random() * 90) + 10;
      const isOdd = num % 2 !== 0;
      setFlexTrial({
        rule: isOddRule ? 'TEK SAYI İSE EVET' : 'ÇİFT SAYI İSE EVET',
        num,
        isOddRule,
        isOdd
      });
    }
  }, [game.category]);

  useEffect(() => { nextTrial(); }, [nextTrial]);

  const handleAns = (correct) => {
    if (correct) addScore(20);
    else addScore(-10);
    nextTrial();
  };

  return (
    <div className="w-full text-center flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 text-2xl font-black mb-2">
        <span className="text-3xl">{game.icon}</span>
        <span>{game.name}</span>
      </div>
      <p className="text-xs font-bold text-slate-700 max-w-md mb-6">{game.description}</p>

      {/* HAFIZA KATEGORİSİ CANLI MOTORU */}
      {game.category === 'memory' && (
        <div className="bg-white border-[3px] border-black p-6 rounded-3xl shadow-brutal max-w-sm w-full mb-6">
          <div className="text-sm font-black mb-3">
            {memoryTrial.phase === 'show' ? '👀 İkonu Aklında Tut!' : '👉 Gösterilen İkon Hangisiydi?'}
          </div>
          <div className="w-20 h-20 mx-auto rounded-2xl bg-neo-purple border-2 border-black flex items-center justify-center text-4xl mb-4 shadow-brutal-sm">
            {memoryTrial.phase === 'show' ? memoryTrial.target : '❓'}
          </div>
          {memoryTrial.phase === 'test' && (
            <div className="grid grid-cols-2 gap-3">
              {memoryTrial.opts.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleAns(item === memoryTrial.target)}
                  className="btn-brutal bg-white hover:bg-neo-yellow text-3xl"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HIZ KATEGORİSİ CANLI MOTORU */}
      {game.category === 'speed' && (
        <div className="bg-white border-[3px] border-black p-6 rounded-3xl shadow-brutal max-w-sm w-full mb-6">
          <div className="text-sm font-black mb-2">⚡ HEDEF İKONA OLABİLDİĞİNCE HIZLI TIKLA:</div>
          <div className="text-5xl font-black mb-6 animate-pulse">{speedTrial.target}</div>
          <div className="grid grid-cols-2 gap-3">
            {speedTrial.opts.map((item, i) => (
              <button
                key={i}
                onClick={() => handleAns(item === speedTrial.target)}
                className="btn-brutal bg-white hover:bg-neo-yellow text-3xl h-16"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DİKKAT KATEGORİSİ CANLI MOTORU */}
      {game.category === 'attention' && (
        <div className="bg-white border-[3px] border-black p-6 rounded-3xl shadow-brutal max-w-sm w-full mb-6">
          <div className="text-sm font-black mb-4">🔍 FARKLIO LAN ŞEKLİ/RENK DİKKATLE BUL!</div>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {attentionTrial.grid.map((item, i) => (
              <button
                key={i}
                onClick={() => handleAns(i === attentionTrial.oddIdx)}
                className="w-20 h-20 rounded-2xl bg-white border-[3px] border-black shadow-brutal flex items-center justify-center text-4xl hover:scale-105 transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PROBLEM ÇÖZME KATEGORİSİ CANLI MOTORU */}
      {game.category === 'problem-solving' && (
        <div className="bg-white border-[3px] border-black p-6 rounded-3xl shadow-brutal max-w-sm w-full mb-6">
          <div className="text-sm font-black mb-3">🧩 ÖRÜNTÜDEKİ EKSİK SAYIYI MANTIK YÜRÜTEREK BUL:</div>
          <div className="text-2xl font-black bg-neo-yellow border-2 border-black p-4 rounded-2xl shadow-brutal-sm mb-4">
            {logicTrial.q}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {logicTrial.opts.map((val, i) => (
              <button
                key={i}
                onClick={() => handleAns(val === logicTrial.ans)}
                className="btn-brutal bg-white hover:bg-neo-green text-xl"
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DİL KATEGORİSİ CANLI MOTORU */}
      {game.category === 'language' && (
        <div className="bg-white border-[3px] border-black p-6 rounded-3xl shadow-brutal max-w-sm w-full mb-6">
          <div className="text-sm font-black mb-3">💬 EKSİK HARFİ TAMAMLA:</div>
          <div className="text-3xl font-black bg-neo-pink border-2 border-black p-4 rounded-2xl shadow-brutal-sm mb-4">
            {langTrial.q}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {langTrial.opts.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleAns(letter === langTrial.ans)}
                className="btn-brutal bg-white hover:bg-neo-yellow text-2xl font-black"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ESNEKLİK KATEGORİSİ CANLI MOTORU */}
      {game.category === 'flexibility' && (
        <div className="bg-white border-[3px] border-black p-6 rounded-3xl shadow-brutal max-w-sm w-full mb-6">
          <div className="text-sm font-black mb-2">🔄 DEĞİŞEN KURALA ANINDA ADAPTE OL:</div>
          <div className="text-sm font-black bg-neo-orange border-2 border-black px-4 py-2 rounded-xl shadow-brutal-sm mb-4">
            {flexTrial.rule}
          </div>
          <div className="text-5xl font-black mb-6">{flexTrial.num}</div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const isCorrect = flexTrial.isOddRule ? flexTrial.isOdd : !flexTrial.isOdd;
                handleAns(isCorrect);
              }}
              className="btn-brutal bg-neo-green"
            >
              EVET 🟢
            </button>
            <button
              onClick={() => {
                const isCorrect = flexTrial.isOddRule ? !flexTrial.isOdd : flexTrial.isOdd;
                handleAns(isCorrect);
              }}
              className="btn-brutal bg-neo-red text-white"
            >
              HAYIR 🔴
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RENK EŞLEŞTİRME — TEK FARKLI TON BUL (color-match) ──────────────────────
function ColorMatchGame() {
  const { addScore } = useGameContext();
  const [stage, setStage] = useState(1);
  const [grid, setGrid] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [clickedIdx, setClickedIdx] = useState(null);

  // Temel renk paleti — aşamalar arasında döner
  const BASE_COLORS = [
    [220, 100, 60],   // mavi
    [0,   100, 60],   // kırmızı
    [120, 80,  55],   // yeşil
    [45,  90,  60],   // sarı-turuncu
    [280, 70,  60],   // mor
    [180, 80,  55],   // camgöbeği
    [320, 75,  60],   // pembe
    [30,  85,  55],   // turuncu
  ];

  const buildGrid = useCallback((s) => {
    // Grid boyutu: 1-3 → 3x3 | 4-6 → 4x4 | 7+ → 5x5
    const size = s <= 3 ? 3 : s <= 6 ? 4 : 5;
    const total = size * size;

    // Fark miktarı: aşama 1→ %30, aşama 6→ %12, aşama 10+→ %5 (Lightness delta)
    const maxDelta = 30;
    const minDelta = 4;
    // delta = maxDelta azaltılarak minDelta'ya yaklaşır
    const delta = Math.max(minDelta, maxDelta - (s - 1) * 2.6);

    const [h, s2, l] = BASE_COLORS[(s - 1) % BASE_COLORS.length];
    const baseColor = `hsl(${h}, ${s2}%, ${l}%)`;

    // Tek farklı kare — bazen daha açık, bazen daha koyu
    const lighter = Math.random() > 0.5;
    const oddL = lighter ? Math.min(95, l + delta) : Math.max(5, l - delta);
    const oddColor = `hsl(${h}, ${s2}%, ${oddL}%)`;

    const oddIdx = Math.floor(Math.random() * total);
    const tiles = Array.from({ length: total }, (_, i) =>
      i === oddIdx ? oddColor : baseColor
    );

    return { size, tiles, oddIdx, delta: Math.round(delta) };
  }, []);

  useEffect(() => {
    setGrid(buildGrid(stage));
    setFeedback(null);
    setClickedIdx(null);
  }, [stage, buildGrid]);

  const handleClick = (idx) => {
    if (feedback !== null || !grid) return;
    setClickedIdx(idx);

    if (idx === grid.oddIdx) {
      addScore(20 + Math.round(grid.delta < 10 ? 20 : grid.delta < 18 ? 10 : 0)); // bonus for hard levels
      setFeedback('correct');
      setTimeout(() => {
        setStage((s) => s + 1);
      }, 700);
    } else {
      addScore(-10);
      setFeedback('wrong');
      setTimeout(() => {
        setGrid(buildGrid(stage)); // Yeni tur, aynı aşama
        setFeedback(null);
        setClickedIdx(null);
      }, 800);
    }
  };

  if (!grid) return null;

  const colClass = grid.size === 3 ? 'grid-cols-3' : grid.size === 4 ? 'grid-cols-4' : 'grid-cols-5';
  const sizeClass = grid.size === 3 ? 'w-72 h-72' : grid.size === 4 ? 'w-80 h-80' : 'w-96 h-96';
  // tile size fills the grid evenly
  const tileStyle = { width: `${Math.floor(320 / grid.size)}px`, height: `${Math.floor(320 / grid.size)}px` };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="bg-white border-2 border-black px-4 py-2 rounded-2xl shadow-brutal-sm mb-4 font-black text-sm text-black">
        🎨 Diğerlerinden farklı renk tonundaki kareyi bul!
      </div>

      <div className={`grid ${colClass} gap-1.5 bg-black p-2 rounded-2xl border-[3px] border-black shadow-brutal`}>
        {grid.tiles.map((color, i) => {
          let border = 'border-2 border-transparent';
          if (feedback === 'correct' && i === grid.oddIdx) border = 'border-[3px] border-neo-green scale-105';
          if (feedback === 'wrong' && i === clickedIdx) border = 'border-[3px] border-neo-red scale-95';
          if (feedback === 'wrong' && i === grid.oddIdx) border = 'border-[3px] border-neo-green'; // reveal correct

          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={feedback !== null}
              className={`rounded-xl transition-all duration-150 cursor-pointer ${border}`}
              style={{ backgroundColor: color, ...tileStyle }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="sticker-tag bg-neo-yellow">AŞAMA: {stage}</span>
        <span className="sticker-tag bg-neo-purple">IZGARA: {grid.size}x{grid.size}</span>
        <span className="sticker-tag bg-neo-orange">FARK: %{Math.round(grid.delta / 60 * 100)}</span>
      </div>

      {feedback === 'correct' && (
        <div className="mt-3 text-neo-green font-black text-lg animate-bounce">✓ Doğru! Bir sonraki aşama...</div>
      )}
      {feedback === 'wrong' && (
        <div className="mt-3 text-neo-red font-black text-sm animate-pulse">✗ Yanlış! Doğru kare yeşil olarak işaretlendi.</div>
      )}
    </div>
  );
}

// ─── MAIN GAMEPAGE ROUTER ────────────────────────────────────────────────────────
export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const game = GAMES.find((g) => g.id === gameId);

  if (!game) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-black text-black mb-2">Oyun Bulunamadı</h2>
        <p className="text-slate-700 font-bold text-sm mb-6">İstediğin egzersiz sistemde mevcut değil.</p>
        <button onClick={() => navigate('/games')} className="btn-brutal bg-neo-yellow">
          Oyun Kataloğuna Dön
        </button>
      </div>
    );
  }

  const renderGameContent = () => {
    switch (game.id) {
      // ── HAFIZA (MEMORY) ──
      case 'memory-matrix': return <MemoryMatrixGame />;
      case 'letter-count': return <LetterCountGame />;
      case 'color-match': return <ColorMatchGame />;
      case 'number-sequence': return <NumberSequenceGame />;
      case 'card-flip': return <CardFlipGame />;
      case 'word-memory': return <WordMemoryGame />;
      case 'image-memory': return <ImageMemoryGame />;
      case 'spatial-memory': return <SpatialMemoryGame />;
      case 'sound-memory': return <SoundMemoryGame />;

      // ── HIZ (SPEED) ──
      case 'snake-brain': return <SnakeBrainGame />;
      case 'reaction-test': return <ReactionTestGame />;
      case 'fast-math': return <FastMathGame />;
      case 'color-name-test': return <ColorNameTestGame />;
      case 'fast-sort': return <FastSortGame />;
      case 'speed-type': return <SpeedTypeGame />;
      case 'quick-click': return <QuickClickGame />;
      case 'chase-speed': return <ChaseSpeedGame />;

      // ── DİKKAT (ATTENTION) ──
      case 'stroop-test': return <StroopTestGame />;
      case 'object-track': return <ObjectTrackGame />;
      case 'dual-task': return <DualTaskGame />;
      case 'shape-count': return <ShapeCountGame />;
      case 'visual-search': return <VisualSearchGame />;
      case 'focus-switch': return <FocusSwitchGame />;

      // ── PROBLEM ÇÖZME (PROBLEM SOLVING) ──
      case 'sudoku-classic': return <SudokuClassicGame />;
      case 'logic-puzzle': return <LogicPuzzleGame />;
      case 'number-pyramid': return <NumberPyramidGame />;
      case 'anagram': return <AnagramGame />;
      case 'pattern-complete': return <PatternCompleteGame />;
      case 'path-find': return <PathFindGame />;
      case 'block-fit': return <BlockFitGame />;
      case 'river-crossing': return <RiverCrossingGame />;

      // ── DİL (LANGUAGE) ──
      case 'wordle-game': return <WordleGame />;
      case 'word-chain': return <WordChainGame />;
      case 'word-produce': return <WordProduceGame />;
      case 'idiom-complete': return <IdiomCompleteGame />;
      case 'vocab-builder': return <VocabBuilderGame />;
      case 'spelling-bee': return <SpellingBeeGame />;
      case 'rhyme-finder': return <RhymeFinderGame />;
      case 'missing-letter': return <MissingLetterGame />;
      case 'word-search': return <WordSearchGame />;
      case 'sentence-order': return <SentenceOrderGame />;

      // ── ESNEKLİK (FLEXIBILITY) ──
      case 'color-flex': return <ColorFlexGame />;
      case 'category-switch': return <CategorySwitchGame />;
      case 'dual-rule': return <DualRuleGame />;
      case 'rule-switch': return <CategorySwitchGame />;
      case 'shape-flex': return <ColorFlexGame />;
      case 'direction-switch': return <DirectionSwitchGame />;
      case 'multi-trait': return <DualRuleGame />;
      case 'task-switch': return <TaskSwitchGame />;
      case 'emotion-flex': return <EmotionFlexGame />;
      case 'number-letter-switch': return <NumberLetterSwitchGame />;

      default: return <GenericCategoryGame game={game} />;
    }
  };

  return <GameWrapper game={game}>{renderGameContent()}</GameWrapper>;
}
