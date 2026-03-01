import React from "react";
import { RoutingProfileType, SidebarContentType } from "@/types/partial";
import { termsSectionType } from "@/types/static";

interface AppConfig {
  name: string;
  description: string;
  logo: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    image: string;
  };
  social_media: {
    twitter: {
      url: string;
      icon: string;
    };
    instagram: {
      url: string;
      icon: string;
    };
    linkedin: {
      url: string;
      icon: string;
    };
    youtube: {
      url: string;
      icon: string;
    };
    tiktok: {
      url: string;
      icon: string;
    };
    github: {
      url: string;
      icon: string;
    };
  };
}

export const appConfig: AppConfig = {
  name: "NutriPlate",
  description:
    "Platform pemantauan gizi dan tumbuh kembang balita berbasis AI dan IoT",
  logo: "/images/logo.svg",
  metadata: {
    title: "NutriPlate — Pemantauan Gizi & Tumbuh Kembang Anak",
    description:
      "Pantau asupan gizi harian, lacak pertumbuhan anak dengan standar WHO, dan gunakan perangkat IoT untuk pengukuran presisi dalam satu aplikasi terpadu.",
    keywords: [
      "NutriPlate",
      "pemantauan gizi",
      "tumbuh kembang anak",
      "stunting",
      "posyandu",
      "IoT",
      "nutrisi",
    ],
    author: "NutriPlate",
    image: "/images/logo.svg",
  },
  social_media: {
    twitter: {
      url: "https://twitter.com/app",
      icon: "hugeicons:new-twitter-rectangle",
    },
    instagram: {
      url: "https://instagram.com/app",
      icon: "basil:instagram-outline",
    },
    linkedin: {
      url: "https://linkedin.com/app",
      icon: "tabler:brand-linkedin",
    },
    youtube: {
      url: "https://youtube.com/app",
      icon: "mingcute:youtube-line",
    },
    tiktok: {
      url: "https://tiktok.com/app",
      icon: "hugeicons:tiktok",
    },
    github: {
      icon: "mdi:github",
      url: "https://github.com/MuliaAndiki/NutriPlate.git",
    },
  },
};

interface NavigationMenuConfig {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
    description?: string;
    children?: NavigationMenuConfig["items"];
  }[];
}

export const navigationMenuConfig: NavigationMenuConfig = {
  items: [
    {
      title: "Home",
      href: "/",
      description: "Home",
    },

    {
      title: "About",
      href: "/about",
      description: "Tentang NutriPlate",
    },
    {
      title: "Kebijakan Privasi",
      href: "/policy",
      description: "Kebijakan privasi pengguna",
    },
    {
      title: "Ketentuan Layanan",
      href: "/terms",
      description: "Syarat dan ketentuan penggunaan",
    },
  ],
};

export const SidebarDefaultData: SidebarContentType[] = [
  {
    title: "Home",
    url: "/",
    icon: "Home",
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: "Inbox",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: "Calendar",
  },
  {
    title: "Search",
    url: "/search",
    icon: "Search",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: "Settings",
  },
];

export type UserRole = "PARENT" | "KADER" | "POSYANDU" | "ADMIN";

export const RoutingProfile: RoutingProfileType[] = [
  {
    title: "Edit Profile",
    icon: "akar-icons:edit",
    icon2: "mingcute:arrow-right-fill",
    href: (role) => `/${role}/profile/edit-profile`,
  },
  {
    title: "Ubah Kata Sandi",
    icon: "material-symbols:lock-outline",
    icon2: "mingcute:arrow-right-fill",
    href: () => `/ubah-password`,
  },
  {
    title: "Personalisasi & Bahasa",
    icon: "uil:setting",
    icon2: "mingcute:arrow-right-fill",
    href: () => "/setting",
  },
  {
    title: "Kebijakan Privasi",
    icon: "ic:outline-policy",
    icon2: "mingcute:arrow-right-fill",
    href: () => "/policy",
  },
  {
    title: "Ketentuan Layanan",
    icon: "mdi:file-document-outline",
    icon2: "mingcute:arrow-right-fill",
    href: () => "/terms",
  },
  {
    title: "Tentang Aplikasi",
    icon: "mdi:about-circle-outline",
    icon2: "mingcute:arrow-right-fill",
    href: () => "/about",
  },
  {
    title: "Riwayat Login",
    icon: "fluent:chat-history-24-filled",
    icon2: "mingcute:arrow-right-fill",
    href: () => "/history-login",
  },
];

export const termsSection: termsSectionType[] = [
  {
    id: "acceptance",
    title: "1. Penerimaan Ketentuan",
    paragraphs: [
      "Dengan mengakses atau menggunakan NutriPlate, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui Ketentuan Layanan ini. Jika Anda tidak menyetujui ketentuan ini, Anda tidak diperkenankan menggunakan layanan kami.",
      "NutriPlate ditujukan untuk orang tua, wali, kader posyandu, dan tenaga kesehatan yang bertugas dalam pemantauan gizi dan tumbuh kembang balita. Pengguna harus berusia minimal 17 tahun atau memiliki persetujuan dari wali yang sah.",
    ],
  },
  {
    id: "acceptable-use",
    title: "2. Penggunaan yang Diperbolehkan",
    paragraphs: [
      "NutriPlate menyediakan platform untuk mencatat asupan gizi, memantau pertumbuhan anak, menghubungkan perangkat IoT untuk pengukuran, dan menjalankan program intervensi gizi. Anda setuju untuk menggunakan layanan ini hanya untuk tujuan yang sah dan sesuai dengan fungsinya.",
    ],
    list: [
      "Menggunakan fitur analisis gizi untuk keperluan pemantauan kesehatan anak yang berada dalam tanggung jawab Anda",
      "Memasukkan data pengukuran yang akurat dan jujur",
      "Menghubungkan perangkat IoT milik Anda sendiri atau yang Anda kelola secara sah",
      "Mengakses data sesuai peran yang diberikan (orang tua, kader, atau admin posyandu)",
    ],
    footer:
      "Anda dilarang menggunakan NutriPlate untuk menyebarkan informasi palsu, mengakses data pengguna lain tanpa otorisasi, atau melakukan aktivitas yang melanggar hukum.",
  },
  {
    id: "user-responsibilities",
    title: "3. Tanggung Jawab Pengguna",
    paragraphs: ["Sebagai pengguna NutriPlate, Anda bertanggung jawab untuk:"],
    list: [
      "Menjaga kerahasiaan kredensial akun Anda (email, kata sandi, dan token sesi). Segera ubah kata sandi jika Anda mencurigai akses tidak sah ke akun Anda",
      "Memastikan data anak yang dimasukkan (nama, tanggal lahir, pengukuran) akurat dan terkini. Data yang tidak akurat dapat menghasilkan perhitungan z-score dan rekomendasi gizi yang tidak tepat",
      "Menggunakan perangkat IoT sesuai petunjuk dan memastikan perangkat dalam kondisi terkalibrasi untuk hasil pengukuran yang akurat",
      "Melaporkan masalah keamanan, bug, atau penyalahgunaan yang Anda temui kepada tim NutriPlate",
    ],
  },
  {
    id: "data-accuracy",
    title: "4. Akurasi Data & Tanggung Jawab Input",
    paragraphs: [
      "NutriPlate menggunakan model kecerdasan buatan (YOLO/Computer Vision) untuk mendeteksi jenis makanan dari foto dan menghitung estimasi kandungan nutrisi. Meskipun kami terus meningkatkan akurasi model, perlu dipahami bahwa:",
    ],
    list: [
      "Hasil deteksi makanan oleh AI bersifat estimasi dan mungkin tidak selalu 100% akurat, terutama untuk makanan yang bentuknya mirip atau tertutup sebagian",
      "Perhitungan nutrisi didasarkan pada data gizi rata-rata per 100 gram dari database makanan Indonesia. Kandungan aktual dapat bervariasi berdasarkan cara memasak, sumber bahan, dan porsi sebenarnya",
      "Berat makanan yang dimasukkan secara manual sepenuhnya menjadi tanggung jawab pengguna. Gunakan perangkat IoT untuk pengukuran yang lebih presisi",
      "Pengguna bertanggung jawab atas kebenaran data yang diinput. NutriPlate tidak bertanggung jawab atas keputusan yang diambil berdasarkan data yang tidak akurat",
    ],
  },
  {
    id: "health-disclaimer",
    title: "5. Batasan Tanggung Jawab Kesehatan",
    paragraphs: [
      "NutriPlate adalah alat bantu pemantauan gizi, bukan pengganti konsultasi medis profesional. Harap diperhatikan:",
    ],
    list: [
      "Perhitungan z-score, status pertumbuhan (normal, stunted, severely stunted), dan rekomendasi nutrisi yang dihasilkan oleh NutriPlate bersifat informatif dan tidak dimaksudkan sebagai diagnosis medis",
      "Rekomendasi program intervensi gizi yang dibuat oleh kader atau posyandu melalui platform kami tidak menggantikan saran dari dokter anak, ahli gizi, atau tenaga medis profesional",
      "Jika anak menunjukkan tanda-tanda malnutrisi, pertumbuhan yang tidak normal, atau masalah kesehatan lainnya, segera konsultasikan dengan tenaga kesehatan profesional",
      "NutriPlate tidak bertanggung jawab atas kerugian, cedera, atau dampak kesehatan yang timbul dari tindakan yang diambil semata-mata berdasarkan informasi dari platform ini tanpa konsultasi medis",
    ],
  },
  {
    id: "iot-disclaimer",
    title: "6. Perangkat IoT & Ketersediaan",
    paragraphs: [
      "Fitur integrasi IoT memungkinkan perangkat timbangan digital mengirimkan data berat secara real-time ke NutriPlate. Terkait penggunaan perangkat IoT:",
    ],
    list: [
      "Ketersediaan dan keakuratan data dari perangkat IoT bergantung pada kondisi jaringan lokal, kalibrasi perangkat, dan kompatibilitas hardware",
      "NutriPlate tidak bertanggung jawab atas kerusakan, malfungsi, atau ketidakakuratan perangkat IoT pihak ketiga yang dihubungkan ke platform",
      "Perangkat yang tidak mengirimkan data selama periode tertentu secara otomatis ditandai offline. Status perangkat diperbarui secara berkala oleh sistem",
      "Kami tidak menjamin ketersediaan fitur IoT secara terus-menerus (24/7) dan dapat melakukan pemeliharaan yang mempengaruhi konektivitas perangkat",
    ],
  },
  {
    id: "service-availability",
    title: "7. Ketersediaan Layanan",
    paragraphs: [
      "Kami berupaya menjaga ketersediaan NutriPlate sebaik mungkin, namun tidak menjamin layanan akan tersedia secara terus-menerus tanpa gangguan. Layanan dapat terganggu karena:",
    ],
    list: [
      "Pemeliharaan sistem terjadwal atau darurat",
      "Masalah infrastruktur pihak ketiga (hosting, database, CDN)",
      "Kondisi force majeure di luar kendali kami",
    ],
    footer:
      "Kami akan berupaya memberikan pemberitahuan sebelum pemeliharaan terjadwal melalui notifikasi dalam aplikasi. NutriPlate tidak bertanggung jawab atas kerugian yang disebabkan oleh ketidaktersediaan sementara layanan.",
  },
  {
    id: "intellectual-property",
    title: "8. Hak Kekayaan Intelektual",
    paragraphs: [
      "Seluruh konten, desain, kode sumber, model AI, dan merek dagang yang terkait dengan NutriPlate merupakan kekayaan intelektual pengembang. Anda tidak diperkenankan menyalin, mendistribusikan, memodifikasi, atau menggunakan materi apa pun dari platform ini untuk keperluan komersial tanpa izin tertulis.",
      "Data yang Anda masukkan ke NutriPlate (data anak, catatan gizi, foto makanan) tetap menjadi milik Anda. Kami menggunakan data tersebut hanya untuk menyediakan layanan sesuai yang dijelaskan dalam Kebijakan Privasi.",
    ],
  },
  {
    id: "termination",
    title: "9. Penghentian Akun",
    paragraphs: [
      "Anda dapat menghapus akun NutriPlate kapan saja melalui pengaturan akun. Penghapusan akun akan menghapus seluruh data pribadi dan data anak secara permanen.",
      "Kami berhak menangguhkan atau menghentikan akses akun Anda jika ditemukan pelanggaran terhadap Ketentuan Layanan ini, aktivitas penipuan, atau penggunaan yang membahayakan pengguna lain.",
    ],
  },
  {
    id: "changes",
    title: "10. Perubahan Ketentuan",
    paragraphs: [
      "NutriPlate dapat memperbarui Ketentuan Layanan ini dari waktu ke waktu. Perubahan material akan diinformasikan melalui notifikasi dalam aplikasi. Dengan terus menggunakan layanan setelah perubahan berlaku, Anda dianggap menyetujui ketentuan yang diperbarui.",
    ],
  },
];

export const policySection: termsSectionType[] = [
  {
    id: "data-collected",
    title: "1. Data yang Dikumpulkan",
    content: [
      {
        subtitle: "Data Akun",
        text: "Saat mendaftar, kami mengumpulkan nama lengkap, alamat email atau nomor telepon, kata sandi (disimpan dalam bentuk terenkripsi), serta foto profil jika diunggah. Untuk pengguna yang mendaftar melalui Google OAuth, kami menerima nama dan email dari akun Google Anda.",
      },
      {
        subtitle: "Data Anak",
        text: "Untuk keperluan pemantauan pertumbuhan, kami mengumpulkan nama anak, tanggal lahir, jenis kelamin, tempat lahir, dan data pengukuran berkala meliputi berat badan, tinggi badan, serta lingkar kepala.",
      },
      {
        subtitle: "Data Gizi & Makanan",
        text: "Catatan asupan gizi harian termasuk jenis makanan yang terdeteksi oleh AI melalui foto, berat makanan (dari input manual atau perangkat IoT), serta hasil kalkulasi nutrisi: energi (kkal), protein, lemak, karbohidrat, serat, kalsium, zat besi, vitamin A, dan vitamin C.",
      },
      {
        subtitle: "Data Perangkat IoT",
        text: "Jika Anda menghubungkan perangkat IoT (seperti timbangan digital), kami mengumpulkan data berat yang dikirimkan perangkat, identifikasi perangkat (device ID), status koneksi, dan timestamp pengukuran.",
      },
    ],
  },
  {
    id: "data-usage",
    title: "2. Cara Data Digunakan",
    content: [
      {
        subtitle: null,
        text: "Data Anda digunakan secara eksklusif untuk keperluan berikut:",
      },
    ],
    list: [
      "Menghitung dan menampilkan z-score pertumbuhan anak berdasarkan standar WHO 2006",
      "Menganalisis kandungan gizi makanan melalui model Computer Vision (YOLO)",
      "Menyediakan rekomendasi nutrisi dan mendeteksi risiko stunting",
      "Menjalankan program intervensi gizi yang dibuat oleh kader atau posyandu",
      "Mengirimkan notifikasi terkait jadwal posyandu, pengingat catatan gizi, dan pembaruan program",
      "Menghasilkan laporan pertumbuhan anak untuk kader dan tenaga kesehatan",
      "Kami tidak menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan komersial",
    ],
  },
  {
    id: "health-data",
    title: "3. Perlindungan Data Kesehatan",
    content: [
      {
        subtitle: null,
        text: "Kami memahami bahwa data pertumbuhan dan gizi anak adalah informasi sensitif. Untuk melindungi data kesehatan Anda:",
      },
    ],
    list: [
      "Kata sandi dienkripsi menggunakan bcrypt dan tidak pernah disimpan dalam bentuk teks biasa",
      "Sesi pengguna dikelola melalui token JWT (JSON Web Token) yang memiliki masa berlaku terbatas",
      "Data sensitif (password, OTP, token aktivasi) disanitasi dari setiap respons API sebelum dikirimkan ke klien",
      "Komunikasi antara aplikasi dan server dilindungi menggunakan HTTPS",
      "Akses data anak hanya tersedia bagi orang tua yang terkait, kader yang ditugaskan, dan admin posyandu yang berwenang berdasarkan peran (role-based access control)",
    ],
  },
  {
    id: "iot-data",
    title: "4. Penanganan Data IoT",
    content: [
      {
        subtitle: null,
        text: "Perangkat IoT yang terhubung ke NutriPlate beroperasi dalam jaringan lokal Anda. Data yang dikirimkan perangkat meliputi:",
      },
    ],
    list: [
      "Berat makanan yang terukur secara real-time",
      "Status perangkat (online, offline, sleep)",
      "Perintah kalibrasi dan pengaturan perangkat",
    ],
    footer:
      "Perangkat yang tidak mengirimkan data selama jangka waktu tertentu secara otomatis ditandai offline oleh sistem. Kami tidak mengumpulkan data lokasi dari perangkat IoT Anda.",
  },
  {
    id: "cookies",
    title: "5. Cookie & Sesi",
    content: [
      {
        subtitle: null,
        text: "NutriPlate menggunakan mekanisme cookie dan penyimpanan lokal untuk:",
      },
    ],
    list: [
      "Menyimpan token autentikasi (JWT) agar Anda tetap login selama sesi aktif",
      "Menyimpan preferensi bahasa dan tema tampilan yang Anda pilih",
      "Mengelola state aplikasi melalui redux-persist di localStorage",
    ],
    footer:
      "Kami tidak menggunakan cookie pelacakan pihak ketiga untuk iklan atau analitik perilaku.",
  },
  {
    id: "user-rights",
    title: "6. Hak Pengguna",
    content: [
      {
        subtitle: null,
        text: "Sebagai pengguna NutriPlate, Anda memiliki hak untuk:",
      },
    ],
    list: [
      "Mengakses dan melihat seluruh data pribadi dan data anak yang tersimpan di akun Anda",
      "Mengubah informasi profil, data anak, dan preferensi akun kapan saja",
      "Menghapus akun Anda secara permanen, yang akan menghapus seluruh data terkait dari sistem kami",
      "Meminta klarifikasi mengenai cara data Anda diproses dengan menghubungi tim kami",
      "Mencabut akses perangkat IoT dari akun Anda kapan saja",
    ],
  },
  {
    id: "data-retention",
    title: "7. Retensi Data",
    content: [
      {
        subtitle: null,
        text: "Data OTP yang telah kedaluwarsa secara otomatis dibersihkan oleh sistem melalui cron job berkala tanpa menghapus akun pengguna. Data sesi (session) yang sudah kedaluwarsa juga dibersihkan secara otomatis. Jika Anda menghapus akun, seluruh data pribadi, data anak, dan riwayat nutrisi akan dihapus secara permanen dari database kami.",
      },
    ],
  },
  {
    id: "changes",
    title: "8. Perubahan Kebijakan",
    content: [
      {
        subtitle: null,
        text: "Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu untuk menyesuaikan dengan perubahan fitur atau regulasi. Perubahan material akan diinformasikan melalui notifikasi dalam aplikasi. Versi terbaru selalu tersedia di halaman ini.",
      },
    ],
  },
];
