# <p align="center">🧠 LUNOSITY 2.0</p>
## <p align="center">Brain Training & Game Platform</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-english"><b>🇬🇧 English</b></a> · <a href="#-türkçe"><b>🇹🇷 Türkçe</b></a>
</p>

<p align="center">
  <a href="https://youtu.be/GkTWH3RuD7Y" target="_blank">
    <img src="https://img.youtube.com/vi/GkTWH3RuD7Y/maxresdefault.jpg" alt="Lunosity 2.0 Promo Video" width="720" style="border-radius:12px;" />
  </a>
  <br/>
  <a href="https://youtu.be/GkTWH3RuD7Y">
    <img src="https://img.shields.io/badge/▶%20Watch%20on%20YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" />
  </a>
</p>

---

## 🇬🇧 English

### 📝 About the Project
**Lunosity 2.0** is a modern web platform inspired by Lumosity, featuring **30 different brain training games**. Built on a React + Node.js architecture, it helps users improve their cognitive skills across memory, speed, attention, problem solving, language and flexibility categories.

By analysing more than 40,000 real Lumosity user reviews, the platform offers community comparisons, sentiment analysis and personalised statistics.

### 🌟 Key Features
* 🎮 **30 Brain Games:** A variety of games in the Memory, Speed, Attention, Problem Solving, Language and Flexibility categories.
* 📊 **Live Dashboard:** Personal score history, per-category performance charts and a leaderboard.
* 🤖 **Big Data Analysis:** Sentiment analysis and community statistics from 40,000+ Lumosity reviews.
* 🏆 **Percentile Comparison:** See where you stand in the community after each game.
* 🎵 **Sound Effects:** Built-in sound system for in-game feedback.
* ⚡ **In-Memory Caching:** High-performance server-side data processing.

### 🎮 6 Game Categories

| Category | Games |
| :--- | :--- |
| 🟣 **Memory** | Letter Count, Color Match, Number Sequence, Card Flip, Word Memorisation, Visual Memory |
| 🟡 **Speed** | Reaction Test, Quick Math, Letter Hit, Color Name Test, Quick Sort, Speed Typing |
| 🔵 **Attention** | Focus Point, Spot the Difference, Stroop Test, Reading in Noise, Object Tracking, Dual Task |
| 🟢 **Problem Solving** | Logic Puzzle, Number Pyramid, Anagram, Pattern Completion, Find the Flow, Mini Sudoku |
| 🩷 **Language** | Word Chain, Word Generation, Idiom Completion |
| 🔴 **Flexibility** | Color Flexibility, Category Switch, Dual Rule |

### 📁 Project Structure

```
lunosity 2.0/
├── frontend/                  # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/        # GameWrapper, GameMenu, Dashboard, Navbar
│       ├── games/             # 30 game components (6 categories)
│       ├── hooks/             # useGameEngine
│       ├── pages/             # Home, GameMenuPage, GamePage, DashboardPage
│       ├── utils/             # sound.js
│       └── constants/         # games.js (metadata for 30 games)
│
└── backend/                   # Node.js + Express
    ├── src/
    │   ├── routes/            # /api/feedback, /api/scores, /api/games
    │   ├── services/          # feedbackParser, feedbackAnalyzer, scoreService
    │   └── middleware/        # cache
    ├── data/                  # lumosity-feedbacks.md (big data - downloaded separately)
    ├── db/                    # scores.json (score store)
    └── scripts/               # download-data.js
```

### 🚀 Installation and Usage

#### 1. Clone the Repo
```bash
git clone https://github.com/huseyinbaranisik/Lunosity.git
cd Lunosity
```

#### 2. Download the Big Data File
```bash
cd backend
node scripts/download-data.js
```
> This script automatically downloads the ~10 MB `lumosity-feedbacks.md` file.

#### 3. Start the Backend
```bash
cd backend
npm install
npm run dev
```
The backend runs at `http://localhost:5000`.

#### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend opens at `http://localhost:5173`.

### 🔌 API Endpoints

#### 📣 Feedback (Big Data)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/feedback/stats` | Overall community statistics |
| `GET` | `/api/feedback/compare?score=85&gameId=fast-math` | User comparison |
| `GET` | `/api/feedback/sentiment` | Sentiment analysis |
| `GET` | `/api/feedback/recent?limit=20` | Recent reviews |

#### 🏆 Scores
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/scores` | Save a score |
| `GET` | `/api/scores/user/:userId` | User history |
| `GET` | `/api/scores/leaderboard/:gameId` | Leaderboard |
| `GET` | `/api/scores/stats/:userId` | User statistics |

#### 🎮 Games
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/games` | All 30 games |
| `GET` | `/api/games/:id` | Single game info |

### 🧪 Tech Stack

**Frontend:** React 18 + Vite · Tailwind CSS (custom dark blue theme) · React Router v6 · Recharts (charts) · Framer Motion (animations) · Lucide React (icons) · Axios (HTTP)

**Backend:** Node.js v18+ (tested on v24) · Express.js · In-memory caching · File-based JSON score store

**Data:**
- `lumosity-feedbacks.md` — ~10 MB, 40,000+ Lumosity user reviews
- Format: `[N★] Name - Date (version, 👍N)` + review text
- Parsed at server start-up and loaded into RAM

### 📊 Big Data Integration

The `lumosity-feedbacks.md` file is downloaded from GitHub and copied into `backend/data/`. The backend parses it on start-up and computes:

* ⭐ Average star rating and the 1★–5★ distribution
* 👍 Most-liked reviews
* 📱 Per-version analysis
* 📈 Percentile comparison of user scores
* 💬 Positive / negative sentiment ratio

### 📝 License
This project is licensed under the MIT License. See the `LICENSE` file for details.

*This project was developed for educational purposes.*

---

## 🇹🇷 Türkçe

### 📝 Proje Hakkında
**Lunosity 2.0**, Lumosity'den ilham alınarak geliştirilmiş, **30 farklı beyin egzersizi oyunu** barındıran modern bir web platformudur. React + Node.js mimarisiyle inşa edilen bu platform; hafıza, hız, dikkat, problem çözme, dil ve esneklik kategorilerinde kullanıcıların bilişsel becerilerini geliştirmelerine yardımcı olur.

Platform, 40.000'den fazla gerçek Lumosity kullanıcı yorumunu analiz ederek kullanıcılara topluluk karşılaştırması, duygu analizi ve kişiselleştirilmiş istatistikler sunar.

### 🌟 Temel Özellikler
* 🎮 **30 Beyin Oyunu:** Hafıza, Hız, Dikkat, Problem Çözme, Dil ve Esneklik kategorilerinde çeşitli oyunlar.
* 📊 **Canlı Dashboard:** Kişisel skor geçmişi, kategori bazlı performans grafikleri ve liderlik tablosu.
* 🤖 **Büyük Veri Analizi:** 40.000+ Lumosity yorumu üzerinden duygu analizi ve topluluk istatistikleri.
* 🏆 **Yüzdelik Karşılaştırma:** Oyun sonrası topluluk içindeki yerini öğren.
* 🎵 **Ses Efektleri:** Oyun içi geri bildirimler için entegre ses sistemi.
* ⚡ **Bellek İçi Önbellekleme:** Sunucu taraflı yüksek performanslı veri işleme.

### 🎮 6 Oyun Kategorisi

| Kategori | Oyunlar |
| :--- | :--- |
| 🟣 **Hafıza** | Harf Sayısı, Renk Eşleştirme, Sayı Dizisi, Kart Çevirme, Kelime Ezber, Görüntü Hafıza |
| 🟡 **Hız** | Tepki Testi, Hızlı Matematik, Harf Vurma, Renk Adı Testi, Hızlı Sıralama, Hız Yazım |
| 🔵 **Dikkat** | Odak Noktası, Fark Bul, Stroop Testi, Gürültüde Okuma, Nesne Takibi, Çift Görev |
| 🟢 **Problem Çözme** | Mantık Bulmacası, Sayı Piramidi, Anagram, Örüntü Tamamla, Akış Bul, Sudoku Mini |
| 🩷 **Dil** | Kelime Zinciri, Kelime Üretme, Deyim Tamamla |
| 🔴 **Esneklik** | Renk Esnekliği, Kategori Geçiş, Çift Kural |

### 📁 Proje Yapısı

Klasör ağacı için yukarıdaki [Project Structure](#-project-structure) bölümüne bakın; `games/` 6 kategorideki 30 oyun bileşenini, `backend/data/` ayrıca indirilen büyük veri dosyasını, `backend/db/` ise skor deposunu içerir.

### 🚀 Kurulum ve Kullanım

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
> Bu script, ~10 MB boyutundaki `lumosity-feedbacks.md` dosyasını otomatik olarak indirir.

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

### 🔌 API Endpoint'leri

#### 📣 Geri Bildirim (Büyük Veri)
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

### 🧪 Teknoloji Yığını

**Frontend:** React 18 + Vite · Tailwind CSS (özel koyu mavi tema) · React Router v6 · Recharts (grafikler) · Framer Motion (animasyonlar) · Lucide React (ikonlar) · Axios (HTTP)

**Backend:** Node.js v18+ (v24 test edildi) · Express.js · Bellek içi önbellekleme · Dosya tabanlı JSON skor deposu

**Veri:**
- `lumosity-feedbacks.md` — ~10 MB, 40.000+ Lumosity kullanıcı yorumu
- Format: `[N★] Ad - Tarih (sürüm, 👍N)` + yorum metni
- Sunucu başlangıcında ayrıştırılır, RAM'e alınır

### 📊 Büyük Veri Entegrasyonu

`lumosity-feedbacks.md` dosyası GitHub'dan indirilerek `backend/data/` dizinine kopyalanır. Backend bu dosyayı başlangıçta ayrıştırır ve şu analizleri yapar:

* ⭐ Ortalama yıldız puanı ve 1★–5★ dağılımı
* 👍 En çok beğenilen yorumlar
* 📱 Sürüm bazlı analiz
* 📈 Kullanıcı skorunun yüzdelik karşılaştırması
* 💬 Pozitif / negatif duygu oranı

### 📝 Lisans
Bu proje MIT lisansı altındadır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.

*Bu proje eğitim amaçlı geliştirilmiştir.*
