/**
 * feedbackParser.js
 * 
 * Lumosity kullanıcı yorumlarını içeren büyük Markdown dosyasını
 * satır satır parse eder ve in-memory cache'e alır.
 * 
 * Dosya formatı:
 * [N★] Kullanıcı Adı - 2026-09-23 21:43:13 (v10.20.88, 👍0)
 * Yorum metni buraya
 *   ↳ Lumosity (2026-09-22 11:24:00): Geliştirici yanıtı
 * ------------------------------------------------------------
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

// ─── State ───────────────────────────────────────────────────────────────────
let feedbacks = [];
let stats = null;
let loaded = false;

const DATA_FILE = path.join(__dirname, '../../data/lumosity-feedbacks.md');

// ─── Parser ──────────────────────────────────────────────────────────────────

// [5★] User Name - 2026-09-23 21:43:13 (v10.20.88, 👍0)
const HEADER_REGEX = /^\[(\d+)★\]\s+(.+?)\s+-\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+\(v([^,]+),\s+👍(\d+)\)/;
const SEPARATOR = '------------------------------------------------------------';
const DEV_RESPONSE_PREFIX = '  ↳ Lumosity';

/**
 * Büyük MD dosyasını satır satır okur ve parse eder.
 * readline ile streaming — RAM dostu.
 */
async function initialize() {
  if (!fs.existsSync(DATA_FILE)) {
    console.warn(`⚠️  Veri dosyası bulunamadı: ${DATA_FILE}`);
    console.warn('   İndirmek için: npm run download-data');
    loaded = true;
    feedbacks = [];
    stats = computeStats();
    return;
  }

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(DATA_FILE, { encoding: 'utf8' }),
      crlfDelay: Infinity,
    });

    let current = null;
    let textLines = [];
    let devResponseLines = [];
    let inDevResponse = false;

    function flushCurrent() {
      if (!current) return;
      current.text = textLines.join(' ').trim();
      current.devResponse = devResponseLines.join(' ').trim() || null;
      feedbacks.push(current);
      current = null;
      textLines = [];
      devResponseLines = [];
      inDevResponse = false;
    }

    rl.on('line', (line) => {
      // Separator: save current entry, start new
      if (line.startsWith(SEPARATOR)) {
        flushCurrent();
        return;
      }

      // Try to parse header line
      const match = line.match(HEADER_REGEX);
      if (match) {
        flushCurrent();
        current = {
          stars: parseInt(match[1], 10),
          userName: match[2].trim(),
          date: match[3].trim(),
          version: match[4].trim(),
          likes: parseInt(match[5], 10),
          text: '',
          devResponse: null,
        };
        inDevResponse = false;
        return;
      }

      if (!current) return;

      // Developer response line
      if (line.startsWith(DEV_RESPONSE_PREFIX)) {
        inDevResponse = true;
        const responseText = line.replace(/^\s+↳\s+Lumosity\s+\([^)]+\):\s*/, '').trim();
        if (responseText) devResponseLines.push(responseText);
        return;
      }

      // Continuation of dev response
      if (inDevResponse && line.startsWith('  ')) {
        devResponseLines.push(line.trim());
        return;
      }

      // Regular review text
      if (line.trim()) {
        inDevResponse = false;
        textLines.push(line.trim());
      }
    });

    rl.on('close', () => {
      flushCurrent(); // Don't forget last entry
      loaded = true;
      stats = computeStats();
      resolve();
    });

    rl.on('error', reject);
  });
}

/**
 * Tüm istatistikleri hesaplar (bir kez çalışır, cache'lenir).
 */
function computeStats() {
  if (!feedbacks.length) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      ratingPercentages: { 1: '0%', 2: '0%', 3: '0%', 4: '0%', 5: '0%' },
      mostLikedReviews: [],
      recentReviews: [],
      versionStats: {},
      positiveRate: 0,
      dataLoadedAt: new Date().toISOString(),
    };
  }

  // Rating distribution
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalStars = 0;
  const versionMap = {};

  for (const fb of feedbacks) {
    const s = Math.max(1, Math.min(5, fb.stars));
    dist[s]++;
    totalStars += s;

    const v = fb.version || 'unknown';
    if (!versionMap[v]) versionMap[v] = { count: 0, totalStars: 0 };
    versionMap[v].count++;
    versionMap[v].totalStars += s;
  }

  const total = feedbacks.length;
  const avg = totalStars / total;

  // Percentages
  const pct = {};
  for (let i = 1; i <= 5; i++) {
    pct[i] = ((dist[i] / total) * 100).toFixed(1) + '%';
  }

  // Most liked
  const mostLiked = [...feedbacks]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10)
    .map(({ stars, userName, date, text, likes }) => ({ stars, userName, date, text, likes }));

  // Recent (last N in file = first N in array since file is date-desc)
  const recent = feedbacks.slice(0, 20).map(({ stars, userName, date, text }) => ({ stars, userName, date, text }));

  // Version stats
  const versionStats = {};
  for (const [v, data] of Object.entries(versionMap)) {
    versionStats[v] = {
      count: data.count,
      avgRating: parseFloat((data.totalStars / data.count).toFixed(2)),
    };
  }

  // Positive rate (4+ stars)
  const positiveCount = (dist[4] || 0) + (dist[5] || 0);
  const positiveRate = parseFloat(((positiveCount / total) * 100).toFixed(1));

  return {
    totalReviews: total,
    averageRating: parseFloat(avg.toFixed(2)),
    ratingDistribution: dist,
    ratingPercentages: pct,
    mostLikedReviews: mostLiked,
    recentReviews: recent,
    versionStats,
    positiveRate,
    dataLoadedAt: new Date().toISOString(),
  };
}

// ─── Exports ─────────────────────────────────────────────────────────────────
module.exports = {
  initialize,
  getAll: () => feedbacks,
  getStats: () => stats,
  isLoaded: () => loaded,
};
