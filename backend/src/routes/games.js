const express = require('express');
const router = express.Router();

const GAMES = [
  // ─── 1. HAFIZA (MEMORY) (10 OYUN) ─────────────────────────────────────────
  { id: 'memory-matrix', name: 'Hafıza Izgarası', category: 'memory', difficulty: 2, icon: '⬛', description: 'Kare desenini hafızanda tut ve kutuları doğru hatırla.', timeLimit: 90 },
  { id: 'letter-count', name: 'Harf Sayısı', category: 'memory', difficulty: 1, icon: '🔤', description: 'Gösterilen kelimelerdeki belirli harfleri say', timeLimit: 60 },
  { id: 'color-match', name: 'Renk Eşleştirme', category: 'memory', difficulty: 1, icon: '🎨', description: 'Renkleri hafızanda tut ve eşleştir', timeLimit: 60 },
  { id: 'number-sequence', name: 'Sayı Dizisi', category: 'memory', difficulty: 2, icon: '🔢', description: 'Sayı dizisini ezberle ve tekrarla', timeLimit: 90 },
  { id: 'card-flip', name: 'Kart Çevirme', category: 'memory', difficulty: 2, icon: '🃏', description: 'Kartların yerlerini ezberle', timeLimit: 120 },
  { id: 'word-memory', name: 'Kelime Ezber', category: 'memory', difficulty: 2, icon: '📝', description: 'Kelime listesini kısa sürede ezberle', timeLimit: 90 },
  { id: 'image-memory', name: 'Görüntü Hafıza', category: 'memory', difficulty: 3, icon: '🖼️', description: 'Görsellerin konumlarını hatırla', timeLimit: 120 },
  { id: 'spatial-memory', name: 'Uzamsal Hafıza', category: 'memory', difficulty: 2, icon: '🧭', description: '3D blokların konumunu ve hareket sırasını hatırla.', timeLimit: 90 },
  { id: 'sound-memory', name: 'Melodi Hafızası', category: 'memory', difficulty: 2, icon: '🎵', description: 'Çalınan nota ve ses dizilimini doğru sırala.', timeLimit: 60 },
  { id: 'face-memory', name: 'Yüz Hafızası', category: 'memory', difficulty: 3, icon: '👤', description: 'Yüzleri ve isimleri eşleştirerek hafızanda tut.', timeLimit: 90 },

  // ─── 2. HIZ (SPEED) (10 OYUN) ──────────────────────────────────────────────
  { id: 'snake-brain', name: 'Snake Brain', category: 'speed', difficulty: 2, icon: '🐍', description: 'Yılanı yön tuşlarıyla yönet, doğru elmayı yiyerek zihnini çalıştır!', timeLimit: 60 },
  { id: 'reaction-test', name: 'Tepki Testi', category: 'speed', difficulty: 1, icon: '⚡', description: 'Uyarıya olabildiğince hızlı tepki ver', timeLimit: 30 },
  { id: 'fast-math', name: 'Hızlı Matematik', category: 'speed', difficulty: 2, icon: '➗', description: 'Matematik işlemlerini hızla çöz', timeLimit: 60 },
  { id: 'color-name-test', name: 'Renk Adı Testi', category: 'speed', difficulty: 2, icon: '🌈', description: 'Renk adı ile renk rengini karşılaştır', timeLimit: 60 },
  { id: 'fast-sort', name: 'Hızlı Sıralama', category: 'speed', difficulty: 3, icon: '📊', description: 'Sayıları hızla sırala', timeLimit: 45 },
  { id: 'speed-type', name: 'Hız Yazım', category: 'speed', difficulty: 3, icon: '⌨️', description: 'Gösterilen metni hızla yaz', timeLimit: 60 },
  { id: 'quick-click', name: 'Refleks Tıklama', category: 'speed', difficulty: 1, icon: '💥', description: 'Rastgele beliren hedeflere milisaniyeler içinde tıkla.', timeLimit: 30 },
  { id: 'chase-speed', name: 'Ok Takibi', category: 'speed', difficulty: 3, icon: '🏹', description: 'Göz kırpan okların yönüne göre tuşlara anında bas.', timeLimit: 45 },

  // ─── 3. DİKKAT (ATTENTION) (10 OYUN) ──────────────────────────────────────
  { id: 'stroop-test', name: 'Stroop Testi', category: 'attention', difficulty: 2, icon: '🧠', description: 'Renk adını değil, rengin rengini söyle', timeLimit: 60 },
  { id: 'object-track', name: 'Nesne Takibi', category: 'attention', difficulty: 3, icon: '👁️', description: 'Birden fazla nesneyi aynı anda takip et', timeLimit: 90 },
  { id: 'dual-task', name: 'Çift Görev', category: 'attention', difficulty: 3, icon: '🔄', description: 'Aynı anda iki farklı görevi yönet', timeLimit: 90 },
  { id: 'shape-count', name: 'Şekil Sayma', category: 'attention', difficulty: 2, icon: '🔺', description: 'Karmaşık şekil havuzunda hedef geometrik şekli say.', timeLimit: 60 },
  { id: 'visual-search', name: 'Görsel Arama', category: 'attention', difficulty: 2, icon: '🕵️', description: 'Kalabalık matris içerisindeki gizli sembolü tespit et.', timeLimit: 60 },
  { id: 'focus-switch', name: 'Odak Değişimi', category: 'attention', difficulty: 3, icon: '💡', description: 'İki farklı odak merkezi arasında kesintisiz geçiş yap.', timeLimit: 90 },

  // ─── 4. PROBLEM ÇÖZME (PROBLEM SOLVING) (10 OYUN) ─────────────────────────
  { id: 'sudoku-classic', name: 'Sudoku Klasik', category: 'problem-solving', difficulty: 3, icon: '🧩', description: 'Klasik 9x9 Sudoku bulmacasında eksik sayıları tamamlama egzersizi.', timeLimit: 300 },
  { id: 'logic-puzzle', name: 'Mantık Bulmacası', category: 'problem-solving', difficulty: 2, icon: '💡', description: 'Sözel ilişki ifadeleriyle mantık kurarak soruları çöz.', timeLimit: 120 },
  { id: 'number-pyramid', name: 'Sayı Piramidi', category: 'problem-solving', difficulty: 2, icon: '🔺', description: 'Tabandan tavana sayılara toplayarak piramidin zirvesine ulaş.', timeLimit: 120 },
  { id: 'anagram', name: 'Anagram', category: 'problem-solving', difficulty: 2, icon: '🔀', description: 'Karışık harfleri düzenleyerek kelime bul', timeLimit: 60 },
  { id: 'pattern-complete', name: 'Örüntü Tamamla', category: 'problem-solving', difficulty: 3, icon: '⬛', description: 'Örüntüdeki eksik parçayı bul', timeLimit: 90 },
  { id: 'path-find', name: 'Akış Bul (Color Flow)', category: 'problem-solving', difficulty: 3, icon: '🗺️', description: 'Eşleşen renkli noktaları yolları kesiştirmeden birleştir.', timeLimit: 150 },
  { id: 'math-pyramid', name: 'Matematik Bulmacası', category: 'problem-solving', difficulty: 2, icon: '➕', description: 'Eksik matematik denklemlerini mantık yürüterek tamamla.', timeLimit: 90 },
  { id: 'block-fit', name: 'Blok Yerleştirme', category: 'problem-solving', difficulty: 3, icon: '🧱', description: 'Geometrik blokları boşluksuz şekilde alana sığdır.', timeLimit: 120 },
  { id: 'river-crossing', name: 'Nehir Geçişi', category: 'problem-solving', difficulty: 3, icon: '🚣', description: 'Klasik nehir mantık bulmacasında karakterleri güvenle karşıya geçir.', timeLimit: 120 },

  // ─── 5. DİL (LANGUAGE) (10 OYUN) ──────────────────────────────────────────
  { id: 'wordle-game', name: 'Kelime Bulmaca', category: 'language', difficulty: 2, icon: '🔤', description: '5 harfli gizli Türkçe kelimeyi 6 tahminde bulma oyunu.', timeLimit: 120 },
  { id: 'word-chain', name: 'Kelime Zinciri', category: 'language', difficulty: 2, icon: '⛓️', description: 'Bir önceki kelimenin son harfiyle yeni kelime üret', timeLimit: 60 },
  { id: 'word-produce', name: 'Kelime Üretme', category: 'language', difficulty: 2, icon: '💬', description: 'Verilen harflerden en fazla kelime üret', timeLimit: 90 },
  { id: 'idiom-complete', name: 'Deyim Tamamla', category: 'language', difficulty: 3, icon: '📚', description: 'Eksik kısmı olan deyimi tamamla', timeLimit: 60 },
  { id: 'vocab-builder', name: 'Kelime Hazinesi', category: 'language', difficulty: 2, icon: '📖', description: 'Eş anlamlı ve zıt anlamlı kelimeleri zamanla yarışarak eşleştir.', timeLimit: 60 },
  { id: 'spelling-bee', name: 'Harf Dizilimi', category: 'language', difficulty: 2, icon: '🐝', description: 'Karışık verilen harflerden en uzun Türkçe sözcüğü kur.', timeLimit: 60 },
  { id: 'rhyme-finder', name: 'Kafiye Bulucu', category: 'language', difficulty: 2, icon: '🎙️', description: 'Verilen kelimeye kafiyeli uyan seçenekleri hızla bul.', timeLimit: 60 },
  { id: 'missing-letter', name: 'Eksik Harf', category: 'language', difficulty: 1, icon: '✏️', description: 'Kelimenin içindeki eksik sesli ve sessiz harfleri tamamla.', timeLimit: 45 },
  { id: 'word-search', name: 'Kelime Avı', category: 'language', difficulty: 2, icon: '🔎', description: 'Harf tablosu içerisinde saklanmış kelimeleri bul.', timeLimit: 90 },
  { id: 'sentence-order', name: 'Cümle Kurma', category: 'language', difficulty: 3, icon: '📑', description: 'Karışık verilen kelimeleri anlamlı bir cümle halinde diz.', timeLimit: 90 },

  // ─── 6. ESNEKLİK (FLEXIBILITY) (10 OYUN) ──────────────────────────────────
  { id: 'color-flex', name: 'Renk Esnekliği', category: 'flexibility', difficulty: 2, icon: '🎭', description: 'Renk kuralını anında değiştir', timeLimit: 60 },
  { id: 'category-switch', name: 'Kategori Geçiş', category: 'flexibility', difficulty: 3, icon: '↔️', description: 'Kategoriler arasında hızla geçiş yap', timeLimit: 60 },
  { id: 'dual-rule', name: 'Çift Kural', category: 'flexibility', difficulty: 3, icon: '⚖️', description: 'İki kuralı aynı anda uygula', timeLimit: 90 },
  { id: 'rule-switch', name: 'Kural Değişimi', category: 'flexibility', difficulty: 2, icon: '🔀', description: 'Değişen renk ve şekil kurallarına beynini anında adapte et.', timeLimit: 60 },
  { id: 'shape-flex', name: 'Şekil Esnekliği', category: 'flexibility', difficulty: 2, icon: '🔷', description: 'Geometrik boyut ve şekil kriterleri arasındaki geçişi yönet.', timeLimit: 60 },
  { id: 'direction-switch', name: 'Yön Geçişi', category: 'flexibility', difficulty: 2, icon: '↖️', description: 'Zıt yön komutlarına zihnini anında adapte ederek tepki ver.', timeLimit: 45 },
  { id: 'multi-trait', name: 'Çoklu Özellik', category: 'flexibility', difficulty: 3, icon: '🎨', description: 'Aynı anda renk, boyut ve sayı kriterlerine göre seçim yap.', timeLimit: 60 },
  { id: 'task-switch', name: 'Görev Anahtarlama', category: 'flexibility', difficulty: 3, icon: '🔄', description: 'Tek ve çift sayılar ile harf analizleri arasında seri geçiş yap.', timeLimit: 90 },
  { id: 'emotion-flex', name: 'Duygu Esnekliği', category: 'flexibility', difficulty: 2, icon: '😀', description: 'Duygu ifadeleri ile renk kuralları arasındaki algını esnet.', timeLimit: 60 },
  { id: 'number-letter-switch', name: 'Sayı-Harf Esnekliği', category: 'flexibility', difficulty: 3, icon: '🔢', description: 'Rakam ve harf işleme modları arasında beynini vites değiştirt.', timeLimit: 90 }
];

router.get('/', (req, res) => {
  res.json(GAMES);
});

router.get('/:id', (req, res) => {
  const game = GAMES.find((g) => g.id === req.params.id);
  if (!game) return res.status(404).json({ error: 'Oyun bulunamadı' });
  res.json(game);
});

module.exports = router;
