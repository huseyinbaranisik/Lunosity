const express = require('express');
const router = express.Router();
const scoreService = require('../services/scoreService');

router.post('/', (req, res) => {
  const { userId, gameId, score, duration } = req.body;
  if (!userId || !gameId || score === undefined) {
    return res.status(400).json({ error: 'Eksik parametreler (userId, gameId, score gerekli)' });
  }
  const saved = scoreService.saveScore(userId, gameId, score, duration || 0);
  res.status(201).json(saved);
});

router.get('/user/:userId', (req, res) => {
  res.json(scoreService.getUserScores(req.params.userId));
});

router.get('/leaderboard/:gameId', (req, res) => {
  res.json(scoreService.getGameLeaderboard(req.params.gameId));
});

router.get('/stats/:userId', (req, res) => {
  res.json(scoreService.getUserStats(req.params.userId));
});

module.exports = router;
