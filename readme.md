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

- Dibangun menggunakan **ESP32** + load cell.
- Mengirimkan berat tubuh dan berat makanan ke server melalui Wi-Fi.
- Data ditampilkan real-time di aplikasi.

### 2. **Progressive Web App (PWA)**

- Registrasi profil anak (usia, berat, tinggi, riwayat kesehatan).
- Pemantauan gizi harian dan mingguan.
- Kamera ponsel untuk mendeteksi jenis makanan (image classification).
- Analisis gizi menggunakan **knowledge base (TKPI, WHO, USDA)**.
- Status gizi ditampilkan:
  - ✔ Seimbang
  - ⚠ Kurang Protein
  - ❌ Belum Mencukupi

### 3. **Machine Learning & Knowledge Base**

- Pengenalan makanan menggunakan model image classification.
- Matching makanan ↔ kebutuhan gizi anak menggunakan:
  - **Cosine Similarity** (analisis komposisi makanan)
  - **Z-Score WHO** (evaluasi pertumbuhan)
- Data nutrisi terintegrasi dengan local food knowledge base.

### 4. **Dashboard Posyandu**

- Kader dapat melihat rangkuman status gizi seluruh anak.
- Mengurangi ketergantungan pada pencatatan manual.
- Memudahkan intervensi dini berdasarkan data yang lengkap.

---

## 🛠️ Teknologi yang Digunakan

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

- Cloud Server

---
