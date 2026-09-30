# <p align="center">🧠 LUNOSITY 2.0</p>
## <p align="center">Beyin Egzersizi & Oyun Platformu</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Lisans-MIT-green?style=for-the-badge" />
</p>

---

### 📝 PROJE HAKKINDA
**Lunosity 2.0**, Lumosity'den ilham alınarak geliştirilmiş, **30 farklı beyin egzersizi oyunu** barındıran modern bir web platformudur. React + Node.js mimarisiyle inşa edilen bu platform; hafıza, hız, dikkat, problem çözme, dil ve esneklik kategorilerinde kullanıcıların bilişsel becerilerini geliştirmelerine yardımcı olur.

Platform, 40.000'den fazla gerçek Lumosity kullanıcı yorumunu analiz ederek kullanıcılara topluluk karşılaştırması, duygu analizi ve kişiselleştirilmiş istatistikler sunar.

---

### 🌟 Temel Özellikler
* 🎮 **50+ Beyin Oyunu:** Hafıza, Hız, Dikkat, Problem Çözme, Dil ve Esneklik kategorilerinde çeşitli oyunlar.
* 📊 **Canlı Dashboard:** Kişisel skor geçmişi, kategori bazlı performans grafikleri ve liderlik tablosu.
* 🤖 **Büyük Veri Analizi:** 40.000+ Lumosity yorumu üzerinden sentiment analizi ve topluluk istatistikleri.
* 🏆 **Percentile Karşılaştırması:** Oyun sonrası topluluk içindeki yerini öğren.
* 🎵 **Ses Efektleri:** Oyun içi geri bildirimler için entegre ses sistemi.
* ⚡ **In-Memory Önbellekleme:** Sunucu taraflı yüksek performanslı veri işleme.

---

### 🎮 6 OYUN KATEGORİSİ

| Kategori | Oyunlar |
| :--- | :--- |
| 🟣 **Hafıza** | Harf Sayısı, Renk Eşleştirme, Sayı Dizisi, Kart Çevirme, Kelime Ezber, Görüntü Hafıza |
| 🟡 **Hız** | Tepki Testi, Hızlı Matematik, Harf Vurma, Renk Adı Testi, Hızlı Sıralama, Hız Yazım |
| 🔵 **Dikkat** | Odak Noktası, Fark Bul, Stroop Testi, Gürültüde Okuma, Nesne Takibi, Çift Görev |
| 🟢 **Problem Çözme** | Mantık Bulmacası, Sayı Piramidi, Anagram, Örüntü Tamamla, Akış Bul, Sudoku Mini |
| 🩷 **Dil** | Kelime Zinciri, Kelime Üretme, Deyim Tamamla |
| 🔴 **Esneklik** | Renk Esnekliği, Kategori Geçiş, Çift Kural |

---

### 📁 PROJE YAPISI

```
lunosity 2.0/
├── frontend/                  # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/        # GameWrapper, GameMenu, Dashboard, Navbar
│       ├── games/             # 30 oyun bileşeni (6 kategori)
│       ├── hooks/             # useGameEngine
│       ├── pages/             # Home, GameMenuPage, GamePage, DashboardPage
│       ├── utils/             # sound.js
│       └── constants/         # games.js (30 oyun metadata)
│
└── backend/                   # Node.js + Express
    ├── src/
    │   ├── routes/            # /api/feedback, /api/scores, /api/games
    │   ├── services/          # feedbackParser, feedbackAnalyzer, scoreService
    │   └── middleware/        # cache
    ├── data/                  # lumosity-feedbacks.md (büyük veri - ayrıca indirilir)
    ├── db/                    # scores.json (skor deposu)
    └── scripts/               # download-data.js
```

---

### 🚀 KURULUM VE KULLANIM

#### 1. Repoyu Klonlayın
```bash
git clone https://github.com/huseyinbaranisik/Lunosity.git
cd Lunosity
```

#### 2. Büyük Veri Dosyasını İndirin
```bash
cd backend
node scripts/download-data.js
```
> Bu script, ~10MB boyutundaki `lumosity-feedbacks.md` dosyasını otomatik olarak indirir.

#### 3. Backend'i Başlatın
```bash
cd backend
npm install
npm run dev
```
Backend `http://localhost:5000` adresinde çalışır.

#### 4. Frontend'i Başlatın
```bash
cd frontend
npm install
npm run dev
```
Frontend `http://localhost:5173` adresinde açılır.

---

### 🔌 API ENDPOINT'LERİ

#### 📣 Feedback (Büyük Veri)
| Method | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `GET` | `/api/feedback/stats` | Genel topluluk istatistikleri |
| `GET` | `/api/feedback/compare?score=85&gameId=fast-math` | Kullanıcı karşılaştırması |
| `GET` | `/api/feedback/sentiment` | Duygu analizi |
| `GET` | `/api/feedback/recent?limit=20` | Son yorumlar |

#### 🏆 Skorlar
| Method | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `POST` | `/api/scores` | Skor kaydet |
| `GET` | `/api/scores/user/:userId` | Kullanıcı geçmişi |
| `GET` | `/api/scores/leaderboard/:gameId` | Liderlik tablosu |
| `GET` | `/api/scores/stats/:userId` | Kullanıcı istatistikleri |

#### 🎮 Oyunlar
| Method | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `GET` | `/api/games` | Tüm 30 oyun |
| `GET` | `/api/games/:id` | Tek oyun bilgisi |

---

### 🧪 TEKNOLOJİ YIĞINI

**Frontend:**
- React 18 + Vite
- Tailwind CSS (özel koyu mavi tema)
- React Router v6
- Recharts (grafikler)
- Framer Motion (animasyonlar)
- Lucide React (ikonlar)
- Axios (HTTP)

**Backend:**
- Node.js v18+ (v24 test edildi)
- Express.js
- In-memory önbellekleme
- Dosya tabanlı JSON skor deposu

**Veri:**
- `lumosity-feedbacks.md` — ~10MB, 40.000+ Lumosity kullanıcı yorumu
- Format: `[N★] Ad - Tarih (sürüm, 👍N)` + yorum metni
- Sunucu başlangıcında parse edilir, RAM'e alınır

---

### 📊 BÜYÜK VERİ ENTEGRASYOnu

`lumosity-feedbacks.md` dosyası GitHub'dan indirilerek `backend/data/` dizinine kopyalanır. Backend bu dosyayı başlangıçta parse eder ve şu analizleri yapar:

* ⭐ Ortalama yıldız puanı ve 1★–5★ dağılımı
* 👍 En çok beğenilen yorumlar
* 📱 Versiyon bazlı analiz
* 📈 Kullanıcı skoru percentile karşılaştırması
* 💬 Pozitif / negatif sentiment oranı

---

### 📝 LİSANS
Bu proje MIT lisansı altındadır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.

---

*Bu proje eğitim amaçlı geliştirilmiştir.*
