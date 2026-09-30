const express = require('express');
const cors = require('cors');
const path = require('path');

// Services
const feedbackParser = require('./services/feedbackParser');

// Routes
const feedbackRoutes = require('./routes/feedback');
const scoresRoutes = require('./routes/scores');
const gamesRoutes = require('./routes/games');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/feedback', feedbackRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/games', gamesRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    feedbackLoaded: feedbackParser.isLoaded(),
    totalFeedbacks: feedbackParser.getAll().length,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı', path: req.path });
});

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ error: 'Sunucu hatası', message: err.message });
});

// ─── Startup ─────────────────────────────────────────────────────────────────
async function start() {
  console.log('');
  console.log('🧠 ════════════════════════════════════════════════ 🧠');
  console.log('        LUNOSITY 2.0 — Backend API Sunucusu');
  console.log('🧠 ════════════════════════════════════════════════ 🧠');
  console.log('');

  // Warm-up: Parse the large feedback file
  console.log('📊 Büyük veri dosyası yükleniyor...');
  const startTime = Date.now();

  try {
    await feedbackParser.initialize();
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const count = feedbackParser.getAll().length;
    console.log(`✅ ${count.toLocaleString()} yorum yüklendi (${elapsed}s)`);
  } catch (err) {
    console.warn('⚠️  Feedback verisi yüklenemedi:', err.message);
    console.warn('   Devam ediliyor... Veriyi indirmek için: npm run download-data');
  }

  // Start server
  app.listen(PORT, () => {
    console.log('');
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
    console.log(`📡 API sağlık kontrolü: http://localhost:${PORT}/api/health`);
    console.log(`🎮 Oyun listesi: http://localhost:${PORT}/api/games`);
    console.log(`📈 Feedback istatistikleri: http://localhost:${PORT}/api/feedback/stats`);
    console.log('');
    console.log('🎯 Frontend için: cd ../frontend && npm run dev');
    console.log('');
  });
}

start();
