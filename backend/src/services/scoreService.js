const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../db/scores.json');

function ensureDbExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), 'utf8');
  }
}

function getScores() {
  ensureDbExists();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveScore(userId, gameId, score, duration) {
  const scores = getScores();
  const newScore = {
    id: 'score_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    userId,
    gameId,
    score: Number(score),
    duration: Number(duration),
    playedAt: new Date().toISOString(),
  };
  scores.push(newScore);
  fs.writeFileSync(DB_PATH, JSON.stringify(scores, null, 2), 'utf8');
  return newScore;
}

function getUserScores(userId) {
  const scores = getScores();
  return scores
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
}

function getGameLeaderboard(gameId) {
  const scores = getScores();
  return scores
    .filter((s) => s.gameId === gameId)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function getUserStats(userId) {
  const userScores = getUserScores(userId);
  if (userScores.length === 0) {
    return {
      totalGames: 0,
      averageScore: 0,
      bestScore: 0,
      recentGames: [],
    };
  }

  const totalGames = userScores.length;
  const totalScore = userScores.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = Math.round(totalScore / totalGames);
  const bestScore = Math.max(...userScores.map((s) => s.score));

  return {
    totalGames,
    averageScore,
    bestScore,
    recentGames: userScores.slice(0, 5),
  };
}

module.exports = {
  saveScore,
  getUserScores,
  getGameLeaderboard,
  getUserStats,
};
