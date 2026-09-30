const express = require('express');
const router = express.Router();
const feedbackAnalyzer = require('../services/feedbackAnalyzer');
const feedbackParser = require('../services/feedbackParser');

router.get('/stats', (req, res) => {
  res.json(feedbackAnalyzer.getGeneralStats());
});

router.get('/compare', (req, res) => {
  const score = parseFloat(req.query.score) || 0;
  const gameId = req.query.gameId || 'genel';
  res.json(feedbackAnalyzer.compareUserScore(score, gameId));
});

router.get('/sentiment', (req, res) => {
  res.json(feedbackAnalyzer.getSentimentBreakdown());
});

router.get('/recent', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  const stats = feedbackParser.getStats();
  if (!stats) return res.json([]);
  res.json(stats.recentReviews.slice(0, limit));
});

module.exports = router;
