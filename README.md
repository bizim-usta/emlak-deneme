# Numan Emlak - Modern Gayrimenkul Çözümleri

Bu proje, Numan Emlak için geliştirilmiş, modern, mobil uyumlu ve SEO dostu bir web sitesidir.

## Özellikler

- **Modern Tasarım:** Tailwind CSS ve Motion ile akıcı kullanıcı deneyimi.
- **İlan Yönetimi:** Admin paneli üzerinden ilan ekleme, düzenleme ve silme.
- **Detaylı Filtreleme:** Fiyat, oda sayısı ve ilan tipine göre arama.
- **Mobil Uyumlu:** Tüm cihazlarda kusursuz görünüm.
- **SEO Dostu:** Dinamik meta etiketleri ve temiz URL yapısı.
- **WhatsApp Entegrasyonu:** İlan detaylarından doğrudan iletişim.

## Teknik Stack

- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express
- **Veritabanı:** SQLite (better-sqlite3)
- **Auth:** JWT + bcryptjs

## Kurulum

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. `.env` dosyasını oluşturun (örnek `.env.example` dosyasını kullanabilirsiniz):
   ```bash
   cp .env.example .env
   ```

3. Uygulamayı geliştirme modunda çalıştırın:
   ```bash
   npm run dev
   ```

4. Admin paneline giriş yapın:
   - **URL:** `/admin/login`
   - **E-posta:** `admin@emlakofisi.com`
   - **Şifre:** `admin_password_123`

## Docker ile Çalıştırma

```bash
docker-compose up --build
```

## Production Build

```bash
npm run build
npm start
```
