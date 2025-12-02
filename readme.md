# 🥗 NutriPlate

**Sistem Integratif Berbasis IoT & PWA untuk Pemantauan Gizi Anak di Dusun Lambateung**

NutriPlate adalah platform pemantauan gizi anak berbasis **IoT Smart Scale** dan **Progressive Web App (PWA)** yang dikembangkan untuk mendukung pencegahan stunting di **Dusun Lambateung, Desa Kajhu**.  
Proyek ini menggabungkan teknologi IoT, machine learning, dan knowledge base gizi lokal untuk memberikan rekomendasi gizi yang lebih cepat, akurat, dan mudah digunakan oleh orang tua dan kader Posyandu.

---

## 🚀 Tujuan Proyek

- Membantu orang tua memahami kecukupan gizi harian anak.
- Menyediakan alat bantu digital untuk kader Posyandu yang selama ini kekurangan perangkat pencatatan.
- Mempercepat proses pemantauan tumbuh kembang anak melalui IoT Smart Scale dan kamera makanan.
- Menjadi model awal _Smart Health Village_ di tingkat dusun lambateung .

---

## 🌱 Fitur Utama

### 1. **IoT Smart Scale (Timbangan Pintar)**

- Arduino UNO R4 WiFi
- Load Cell 10kg + HX711.
- Pengiriman data via Wi-Fi (HTTP / MQTT).
- Kalibrasi otomatis
- Update realtime ke server

### 2. **Progressive Web App (PWA)**

- Registrasi profil anak
- Dashboard konsumsi harian/mingguan/bulanan.
- Kamera ponsel untuk deteksi makanan
- Analisis status gizi
- Tampilan responsif

### 3. **Machine Learning & Knowledge Base**

- Image classification untuk identifikasi makanan.
- Analisis nutrisi menggunakan:
  - **Cosine Similarity**
  - **Z-Score WHO**
- Data nutrisi terintegrasi dengan local food knowledge base.
- Rekomendasi gizi terpersonalisasi

### 4. **Dashboard Posyandu**

- Rekap status gizi semua anak.
- Grafik perkembangan.
- Data terpusat.
- Pengurangan pencatatan manual

---

## 🛠️ Teknologi yang Digunakan

              ┌──────────────────┐
              │   IoT SmartScale │
              │ (Arduino UNO R4) │
              └─────────┬────────┘
                        │ Wi-Fi (HTTP/MQTT)
                        ▼
          ┌──────────────────────────────────┐
          │        Backend API (Bun/Elysia)  │
          │   Auth • REST API • Data Bridge  │
          └─────────┬────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────┐
        │        ML Service (Python Flask)   │
        │  Image Recognition • Nutrition ML  │
        └─────────┬──────────────────────────┘
                  │
                  ▼
        ┌────────────────────────────────────┐
        │          PostgreSQL Database       │
        │ Child Profile • Food Logs • ML Data│
        └─────────┬──────────────────────────┘
                  │
                  ▼
       ┌─────────────────────────────────────┐
       │        PWA Frontend (Next.js)       │
       │ Dashboard • Camera                  │
       └─────────────────────────────────────┘

### **Backend**

- Bun.js / Elysia
- Python Flask (ML Service)
- PostgreSQL
- JWT Auth
- REST API

### **DevOps**

- Docker
- Github

### **Frontend (PWA)**

- Next.js
- Tailwind CSS
- Camera API
- Service Worker

### **IoT**

- Arduino r4
- HX711 Load Cell Amplifier
- Load cell 10kg
- Wi-Fi MQTT/HTTP

### **Machine Learning**

- TensorFlow / PyTorch
- Image Classification (food recognition)
- Cosine Similarity
- Preprocessing pipeline (scraping + labeling)

### **Devploy**

- Docker
- GitHub
- Cloud Deployment

---

# 🗂️ Roadmap Pengembangan

### **Q1 — Baseline**

- Observasi dan koordinasi dusun
- Perancangan konsep sistem
- Penyusunan Knowledge Base

### **Q2 — Pengembangan Sistem**

- Prototipe IoT Smart Scale
- Desain UI/UX PWA
- Integrasi backend + ML

### **Q3 — Pengujian**

- Uji lapangan bersama keluarga
- Kalibrasi & validasi nutrisi

### **Q4 — Implementasi**

- Pelatihan kader
- Sosialisasi Posyandu
- NutriPlate v1.0 Release

### **👥 Kontribusi**

- Kontribusi sangat terbuka.
- Silakan buat issue, pull request, atau diskusi.

### **📄 Lisensi**

- Lisensi: MIT License

### **📞 Kontak Pengembang**

- Email: muliaandiki@gmail.com
