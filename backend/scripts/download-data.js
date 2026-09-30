/**
 * Lumosity feedback data indirme scripti.
 * Çalıştırma: node scripts/download-data.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_URL = 'https://raw.githubusercontent.com/seyyah/challenge1/main/lumosity-feedbacks.md';
const OUTPUT_PATH = path.join(__dirname, '../data/lumosity-feedbacks.md');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // Veri dizinini oluştur
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Dosya zaten varsa atla
    if (fs.existsSync(dest)) {
      const stats = fs.statSync(dest);
      const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`✅ Dosya zaten mevcut: ${dest}`);
      console.log(`   Boyut: ${fileSizeMB} MB`);
      console.log(`   Yeniden indirmek için dosyayı silin.`);
      return resolve();
    }

    console.log(`📥 İndiriliyor: ${url}`);
    console.log(`📁 Hedef: ${dest}`);
    console.log('⏳ Lütfen bekleyin (~10MB)...\n');

    const file = fs.createWriteStream(dest);
    let downloaded = 0;
    let lastPrint = 0;

    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Redirect
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }

      const totalSize = parseInt(response.headers['content-length'], 10);

      response.on('data', (chunk) => {
        downloaded += chunk.length;
        const now = Date.now();
        if (now - lastPrint > 500) {
          const percent = totalSize ? ((downloaded / totalSize) * 100).toFixed(1) : '?';
          const mb = (downloaded / 1024 / 1024).toFixed(2);
          process.stdout.write(`\r   ${mb} MB (${percent}%)`);
          lastPrint = now;
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`\n\n✅ İndirme tamamlandı!`);
        console.log(`   Boyut: ${fileSizeMB} MB`);
        console.log(`   Konum: ${dest}`);
        resolve();
      });
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });

    file.on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  console.log('');
  console.log('🧠 Lunosity 2.0 — Veri İndirme Aracı');
  console.log('══════════════════════════════════════');
  console.log('');

  try {
    await downloadFile(DATA_URL, OUTPUT_PATH);
    console.log('\n🎉 Veri başarıyla hazır! Backend\'i başlatabilirsiniz:');
    console.log('   npm run dev');
  } catch (err) {
    console.error('\n❌ İndirme hatası:', err.message);
    console.error('\nManuel indirme:');
    console.error(`   1. ${DATA_URL}`);
    console.error(`   2. Dosyayı şuraya kaydedin: ${OUTPUT_PATH}`);
    process.exit(1);
  }
}

main();
