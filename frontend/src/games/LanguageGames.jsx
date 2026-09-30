import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from './GameContext';
import { sound } from '../utils/sound';

// ─── 1. KELİME ZİNCİRİ (word-chain) ───────────────────────────────────────────
export function WordChainGame() {
  const { addScore } = useGameContext();
  const [lastWord, setLastWord] = useState('KALEM');
  const [inputWord, setInputWord] = useState('');

  const handleSend = () => {
    const lastChar = lastWord.slice(-1).toUpperCase();
    const userChar = inputWord.trim().charAt(0).toUpperCase();

    if (inputWord.trim().length >= 3 && userChar === lastChar) {
      sound.playClick();
      addScore(20);
      setLastWord(inputWord.trim().toUpperCase());
      setInputWord('');
    } else {
      addScore(-10);
    }
  };

  const lastChar = lastWord.slice(-1).toUpperCase();

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Son Harf ile Başlayan Kelime Yaz: <span className="text-brand font-black text-lg">'{lastChar}'</span>
      </div>

      <div className="w-full max-w-xs bg-ink text-white p-6 rounded-3xl shadow-card my-4">
        <span className="text-3xl font-black">{lastWord}</span>
      </div>

      <div className="flex gap-2 max-w-xs w-full">
        <input
          type="text"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          placeholder={`'${lastChar}' ile başla...`}
          className="w-full bg-white border border-ink/15 rounded-2xl px-4 py-3 text-center font-black uppercase text-ink focus:outline-none focus:ring-2 focus:ring-brand shadow-sm"
        />
        <button onClick={handleSend} className="btn-primary">
          Gönder
        </button>
      </div>
    </div>
  );
}

// ─── 2. KELİME ÜRETME (word-produce) ───────────────────────────────────────────
export function WordProduceGame() {
  const { addScore } = useGameContext();
  const [letters] = useState(['A', 'K', 'L', 'E', 'M', 'S']);
  const [built, setBuilt] = useState('');

  const handleAddChar = (ch) => {
    sound.playClick();
    setBuilt((b) => b + ch);
  };

  const handleSubmit = () => {
    if (built.length >= 3) {
      addScore(built.length * 10);
      setBuilt('');
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Harflerden Anlamlı Kelime Üret
      </div>

      <div className="w-full max-w-xs h-20 bg-white border border-ink/15 rounded-3xl flex items-center justify-center shadow-card my-4">
        <span className="text-3xl font-black text-brand tracking-widest">{built || '...'}</span>
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-xs mb-4">
        {letters.map((ch, i) => (
          <button
            key={i}
            onClick={() => handleAddChar(ch)}
            className="w-12 h-12 rounded-xl bg-paper hover:bg-brand hover:text-white border border-ink/15 font-black text-xl text-ink transition-all shadow-sm"
          >
            {ch}
          </button>
        ))}
      </div>

      <div className="flex gap-2 max-w-xs w-full">
        <button onClick={() => setBuilt('')} className="btn-secondary flex-1">Temizle</button>
        <button onClick={handleSubmit} className="btn-primary flex-1">Onayla</button>
      </div>
    </div>
  );
}

// ─── 3. DEYİM TAMAMLA (idiom-complete) ─────────────────────────────────────────
export function IdiomCompleteGame() {
  const { addScore } = useGameContext();
  const [idiom, setIdiom] = useState({ text: 'İki ayağını bir ____ sokmak', ans: 'pabuca', opts: ['çoraba', 'pabuca', 'çantaya'] });

  const IDIOMS = [
    { text: 'İki ayağını bir ____ sokmak', ans: 'pabuca', opts: ['çoraba', 'pabuca', 'çantaya'] },
    { text: 'Etekleri ____ çalmak',         ans: 'zil',    opts: ['saz', 'zil', 'çan'] },
    { text: 'Gözden ____ düşmek',          ans: 'sütten', opts: ['dağdan', 'sütten', 'gözden'] },
    { text: 'Sinekten ____ çıkarmak',      ans: 'yağ',    opts: ['yağ', 'bal', 'süt'] },
  ];

  const nextIdiom = useCallback(() => {
    const item = IDIOMS[Math.floor(Math.random() * IDIOMS.length)];
    setIdiom(item);
  }, []);

  useEffect(() => {
    nextIdiom();
  }, [nextIdiom]);

  const handleAns = (opt) => {
    if (opt === idiom.ans) {
      sound.playClick();
      addScore(20);
    } else {
      addScore(-10);
    }
    nextIdiom();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Eksik Deyim Sözcüğünü Tamamla
      </div>

      <div className="w-full max-w-xs bg-white border border-ink/15 p-6 rounded-3xl shadow-card my-4">
        <span className="text-lg font-black text-ink leading-relaxed">{idiom.text}</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
        {idiom.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAns(opt)}
            className="py-3 rounded-2xl bg-paper hover:bg-brand hover:text-white border border-ink/10 font-black text-sm text-ink transition-all cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 4. KELİME HAZİNESİ (vocab-builder) ───────────────────────────────────────
export function VocabBuilderGame() {
  const { addScore } = useGameContext();
  const [targetWord, setTargetWord] = useState({ word: 'BEYAZ', type: 'Eş Anlamlısı', ans: 'AK', opts: ['AK', 'KARA', 'KIRMIZI'] });

  const WORDS = [
    { word: 'BEYAZ', type: 'Eş Anlamlısı', ans: 'AK',    opts: ['AK', 'KARA', 'KIRMIZI'] },
    { word: 'BÜYÜK', type: 'Zıt Anlamlısı', ans: 'KÜÇÜK', opts: ['KÜÇÜK', 'DEV', 'UZUN'] },
    { word: 'RÜZGAR',type: 'Eş Anlamlısı', ans: 'YEL',   opts: ['YEL', 'YAĞMUR', 'GÜNEŞ'] },
  ];

  const nextQ = useCallback(() => {
    const item = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(item);
  }, []);

  useEffect(() => {
    nextQ();
  }, [nextQ]);

  const handleAns = (ans) => {
    if (ans === targetWord.ans) {
      sound.playClick();
      addScore(20);
    } else {
      addScore(-10);
    }
    nextQ();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        '{targetWord.word}' Kelimesinin {targetWord.type} Hangisidir?
      </div>

      <div className="w-full max-w-xs bg-ink text-white p-6 rounded-3xl shadow-card my-4">
        <span className="text-3xl font-black">{targetWord.word}</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
        {targetWord.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAns(opt)}
            className="py-3 rounded-2xl bg-white border border-ink/15 font-black text-sm text-ink hover:bg-brand hover:text-white transition-all shadow-sm cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 5. HARF DİZİLİMİ (spelling-bee) ───────────────────────────────────────────
export function SpellingBeeGame() {
  const { addScore } = useGameContext();
  const [letters, setLetters] = useState(['K', 'A', 'L', 'E', 'M']);
  const [target, setTarget] = useState('KALEM');

  const nextWord = useCallback(() => {
    const wordList = ['KALEM', 'DENİZ', 'KİTAP', 'GÜNEŞ', 'ORMAN'];
    const w = wordList[Math.floor(Math.random() * wordList.length)];
    setTarget(w);
    setLetters(w.split('').sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    nextWord();
  }, [nextWord]);

  const handleAns = (w) => {
    if (w === target) {
      sound.playClick();
      addScore(20);
      nextWord();
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Harfleri Doğru Dizilime Getir
      </div>

      <div className="flex gap-2 justify-center my-4">
        {letters.map((ch, i) => (
          <div key={i} className="w-12 h-12 rounded-xl bg-brand text-white font-black text-2xl flex items-center justify-center shadow-sm">
            {ch}
          </div>
        ))}
      </div>

      <button onClick={() => handleAns(target)} className="btn-primary w-full max-w-xs">
        Doğrula ✓
      </button>
    </div>
  );
}

// ─── 6. KAFİYE BULUCU (rhyme-finder) ───────────────────────────────────────────
export function RhymeFinderGame() {
  const { addScore } = useGameContext();
  const [target, setTarget] = useState({ word: 'DENİZ', ans: 'TEMİZ', opts: ['TEMİZ', 'GÜNEŞ', 'KİTAP'] });

  const RHYMES = [
    { word: 'DENİZ', ans: 'TEMİZ', opts: ['TEMİZ', 'GÜNEŞ', 'KİTAP'] },
    { word: 'ÇİÇEK', ans: 'BÖCEK', opts: ['BÖCEK', 'ORMAN', 'YILDIZ'] },
    { word: 'RÜZGAR',ans: 'YAĞMUR',opts: ['YAĞMUR', 'GÖKYÜZÜ', 'YAPRAK'] },
  ];

  const nextQ = useCallback(() => {
    const r = RHYMES[Math.floor(Math.random() * RHYMES.length)];
    setTarget(r);
  }, []);

  useEffect(() => {
    nextQ();
  }, [nextQ]);

  const handleAns = (opt) => {
    if (opt === target.ans) {
      sound.playClick();
      addScore(20);
    } else {
      addScore(-10);
    }
    nextQ();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        '{target.word}' Kelimesine Kafiyeli Uyan Sözcüğü Bul
      </div>

      <div className="w-full max-w-xs bg-ink text-white p-6 rounded-3xl shadow-card my-4">
        <span className="text-3xl font-black">{target.word}</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
        {target.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAns(opt)}
            className="py-3 rounded-2xl bg-white border border-ink/15 font-black text-sm text-ink hover:bg-brand hover:text-white transition-all shadow-sm cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 7. EKSİK HARF (missing-letter) ─────────────────────────────────────────────
export function MissingLetterGame() {
  const { addScore } = useGameContext();
  const [word, setWord] = useState({ q: 'T Ü R K _ İ Y E', ans: 'Ç', opts: ['C', 'Ç', 'S'] });

  const nextQ = useCallback(() => {
    const list = [
      { q: 'T Ü R K _ İ Y E', ans: 'Ç', opts: ['C', 'Ç', 'S'] },
      { q: 'K E L _ M E',     ans: 'İ', opts: ['A', 'İ', 'E'] },
      { q: 'B E Y _ N',       ans: 'İ', opts: ['A', 'E', 'İ'] },
    ];
    const item = list[Math.floor(Math.random() * list.length)];
    setWord(item);
  }, []);

  useEffect(() => {
    nextQ();
  }, [nextQ]);

  const handleAns = (ch) => {
    if (ch === word.ans) {
      sound.playClick();
      addScore(20);
    } else {
      addScore(-10);
    }
    nextQ();
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Eksik Harfi Tamamla
      </div>

      <div className="w-full max-w-xs bg-white border border-ink/15 p-6 rounded-3xl shadow-card my-4">
        <span className="text-3xl font-black text-brand tracking-widest">{word.q}</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
        {word.opts.map((ch, i) => (
          <button
            key={i}
            onClick={() => handleAns(ch)}
            className="py-3 rounded-2xl bg-paper border border-ink/15 font-black text-xl hover:bg-brand hover:text-white transition-all shadow-sm cursor-pointer"
          >
            {ch}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 8. KELİME AVI (word-search) ───────────────────────────────────────────────
export function WordSearchGame() {
  const { addScore } = useGameContext();
  const [target, setTarget] = useState('AKIL');

  const handleAns = () => {
    sound.playClick();
    addScore(25);
    setTarget('ZİHİN');
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Tablodaki Saklı Kelimeyi Bul: <span className="font-black text-brand text-lg">{target}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 bg-ink rounded-3xl shadow-card my-4 w-60 h-60">
        {['A', 'K', 'I', 'L', 'Z', 'İ', 'H', 'İ', 'N'].map((ch, i) => (
          <button
            key={i}
            onClick={handleAns}
            className="rounded-2xl bg-white/10 hover:bg-brand text-white font-black text-2xl flex items-center justify-center transition-all cursor-pointer"
          >
            {ch}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 9. CÜMLE KURMA (sentence-order) ───────────────────────────────────────────
export function SentenceOrderGame() {
  const { addScore } = useGameContext();

  const handleAns = () => {
    sound.playClick();
    addScore(25);
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="section-label mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Kelimeleri Anlamlı Cümle Olacak Şekilde Sırala
      </div>

      <div className="flex flex-wrap gap-2 justify-center my-4 max-w-xs">
        {['Zihnini', 'Her', 'Gün', 'Geliştir'].map((w, i) => (
          <button
            key={i}
            onClick={handleAns}
            className="px-4 py-2.5 rounded-2xl bg-white border border-ink/15 font-bold text-sm text-ink shadow-sm hover:bg-brand hover:text-white transition-all cursor-pointer"
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}
