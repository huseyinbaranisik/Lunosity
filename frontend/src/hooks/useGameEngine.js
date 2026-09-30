import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { sound } from '../utils/sound';

export function useGameEngine({ gameId, timeLimit = 60, userId }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'countdown' | 'playing' | 'finished'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [countdown, setCountdown] = useState(3);
  const [comparisonData, setComparisonData] = useState(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  // Visual Effect States (Score/Time Flash & Float)
  const [scoreFlash, setScoreFlash] = useState(null); // 'plus' | 'minus' | null
  const [timeFlash, setTimeFlash] = useState(false); // boolean

  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const activeUserId = useRef(
    userId || localStorage.getItem('lunosity_user_id') || 'user_' + Math.random().toString(36).substring(2, 9)
  ).current;

  useEffect(() => {
    localStorage.setItem('lunosity_user_id', activeUserId);
  }, [activeUserId]);

  // Puan & Süre Cezası Ekleme (Visual Flash dahil)
  const addScore = useCallback((points) => {
    setScore((prev) => {
      const next = Math.max(0, prev + points);
      if (points > 0) {
        sound.playCorrect();
        setScoreFlash('plus');
        setTimeout(() => setScoreFlash(null), 600);
      } else if (points < 0) {
        sound.playWrong();
        setScoreFlash('minus');
        setTimeout(() => setScoreFlash(null), 600);

        // YANLIŞ HAMLEDE SÜREDEN -3 SANİYE DÜŞ (Visual Flash dahil)
        setTimeLeft((t) => {
          const nextTime = Math.max(0, t - 3);
          setTimeFlash(true);
          setTimeout(() => setTimeFlash(false), 600);
          return nextTime;
        });
      }
      return next;
    });
  }, []);

  const endGame = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    setStatus('finished');
    sound.playWin();
    setLoadingComparison(true);

    try {
      const localScores = JSON.parse(localStorage.getItem('lunosity_scores') || '[]');
      const newEntry = {
        id: 'score_' + Date.now(),
        userId: activeUserId,
        gameId,
        score,
        duration: timeLimit - timeLeft,
        playedAt: new Date().toISOString(),
      };
      localStorage.setItem('lunosity_scores', JSON.stringify([newEntry, ...localScores]));

      await axios.post('/api/scores', {
        userId: activeUserId,
        gameId,
        score,
        duration: timeLimit - timeLeft,
      });

      const compareRes = await axios.get(`/api/feedback/compare?score=${score}&gameId=${gameId}`);
      setComparisonData(compareRes.data);
    } catch (err) {
      setComparisonData({
        userScore: score,
        gameId,
        percentile: Math.min(99, Math.round((score / 100) * 85)),
        message: `Tebrikler! Oyunda ${score} puan kazandın!`,
        averageSystemScore: 50,
        badge: score > 70 ? 'great' : 'good',
      });
    } finally {
      setLoadingComparison(false);
    }
  }, [activeUserId, gameId, score, timeLimit, timeLeft]);

  const startGame = useCallback(() => {
    sound.playClick();
    setScore(0);
    setTimeLeft(timeLimit);
    setCountdown(3);
    setStatus('countdown');
    setComparisonData(null);

    sound.playCount();
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setStatus('playing');
          sound.playCorrect();
          return 0;
        }
        sound.playCount();
        return prev - 1;
      });
    }, 1000);
  }, [timeLimit]);

  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, endGame]);

  const resetGame = useCallback(() => {
    sound.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setStatus('idle');
    setScore(0);
    setTimeLeft(timeLimit);
    setComparisonData(null);
  }, [timeLimit]);

  return {
    status,
    score,
    timeLeft,
    countdown,
    startGame,
    endGame,
    addScore,
    resetGame,
    comparisonData,
    loadingComparison,
    scoreFlash,
    timeFlash,
    userId: activeUserId,
  };
}
