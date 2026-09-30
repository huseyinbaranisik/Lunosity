/**
 * feedbackAnalyzer.js
 * 
 * Lumosity feedback verisini analiz eder ve kullanıcı skorlarını
 * topluluk verileriyle kıyaslar.
 */

const feedbackParser = require('./feedbackParser');

/**
 * Genel topluluk istatistiklerini döndürür.
 */
function getGeneralStats() {
  const stats = feedbackParser.getStats();
  if (!stats) {
    return { error: 'Veri henüz yüklenmedi', loaded: false };
  }
  return { ...stats, loaded: feedbackParser.isLoaded() };
}

/**
 * Kullanıcı skorunu topluluk verisiyle kıyaslar.
 * 
 * @param {number} userScore - 0-100 arasında kullanıcı skoru
 * @param {string} gameId - Oyun kimliği
 * @returns {object} Karşılaştırma sonucu
 */
function compareUserScore(userScore, gameId = 'genel') {
  const stats = feedbackParser.getStats();
  
  // Fallback if no data
  if (!stats || stats.totalReviews === 0) {
    return {
      userScore,
      gameId,
      percentile: 50,
      message: 'Karşılaştırma verisi henüz yüklenmedi.',
      averageSystemScore: 50,
      badge: 'average',
    };
  }

  const { ratingDistribution, totalReviews, averageRating } = stats;

  // Yıldız dağılımını 0-100 skor bandına eşle:
  // 1★ → 0-20, 2★ → 20-40, 3★ → 40-60, 4★ → 60-80, 5★ → 80-100
  // Kullanıcının skoru kaç ★ bandında olduğunu bul

  // Sistemin ortalama skoru (100 üzerinden)
  const avgScore = ((averageRating - 1) / 4) * 100; // 1★=0, 5★=100

  // Kullanıcının kaç kullanıcıyı geçtiğini hesapla
  // (userScore 0-100 → skor bandı belirle → o banddaki kümülatif %)
  const userStarBand = Math.ceil((userScore / 100) * 4) + 1; // 0→1★, 25→2★, 50→3★, 75→4★, 100→5★
  const clampedBand = Math.max(1, Math.min(5, userStarBand));

  // Kullanıcı skoru bu bandın altındaki kaçı geçiyor?
  let belowCount = 0;
  for (let i = 1; i < clampedBand; i++) {
    belowCount += ratingDistribution[i] || 0;
  }
  // Aynı banddakilerle paylaş (yarısını geçiyor varsay)
  belowCount += (ratingDistribution[clampedBand] || 0) * (userScore % 25) / 25;

  const percentile = Math.min(99, Math.round((belowCount / totalReviews) * 100));

  // Badge belirle
  let badge;
  let message;
  if (percentile >= 90) {
    badge = 'excellent';
    message = `🏆 Muhteşem! Performansın tüm kullanıcıların %${percentile}'inden yüksek!`;
  } else if (percentile >= 75) {
    badge = 'great';
    message = `⭐ Harika! Bu oyundaki performansın kullanıcıların %${percentile}'inden üstte!`;
  } else if (percentile >= 50) {
    badge = 'good';
    message = `👍 İyi iş! Kullanıcıların %${percentile}'ini geride bıraktın.`;
  } else if (percentile >= 25) {
    badge = 'average';
    message = `💪 Ortalamada! Daha fazla pratikle yükseleceksin. %${percentile} persentil.`;
  } else {
    badge = 'below_average';
    message = `🎯 Devam et! Her pratik beynini güçlendirir. %${percentile} persentil.`;
  }

  return {
    userScore: Math.round(userScore),
    gameId,
    percentile,
    message,
    averageSystemScore: Math.round(avgScore),
    badge,
    totalCommunityReviews: totalReviews,
    communityAverageRating: stats.averageRating,
  };
}

/**
 * Duygu analizi özeti döndürür.
 */
function getSentimentBreakdown() {
  const stats = feedbackParser.getStats();
  if (!stats) return { positive: 0, neutral: 0, negative: 0 };

  const { ratingDistribution, totalReviews } = stats;
  if (!totalReviews) return { positive: 0, neutral: 0, negative: 0 };

  const positive = (ratingDistribution[4] + ratingDistribution[5]) || 0;
  const neutral = ratingDistribution[3] || 0;
  const negative = (ratingDistribution[1] + ratingDistribution[2]) || 0;

  return {
    positive,
    neutral,
    negative,
    positivePercent: parseFloat(((positive / totalReviews) * 100).toFixed(1)),
    neutralPercent: parseFloat(((neutral / totalReviews) * 100).toFixed(1)),
    negativePercent: parseFloat(((negative / totalReviews) * 100).toFixed(1)),
    total: totalReviews,
  };
}

module.exports = {
  getGeneralStats,
  compareUserScore,
  getSentimentBreakdown,
};
