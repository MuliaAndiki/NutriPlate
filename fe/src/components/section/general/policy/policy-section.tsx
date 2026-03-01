import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const lastUpdated = "1 Maret 2026";

const sections = [
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
interface PolicySectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}

const PolicySection: React.FC<PolicySectionProps> = ({ namespace }) => {
  return (
    <section className="w-full min-h-screen">
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--primary)_0%,#6366f1_100%)] text-primary-foreground">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 md:py-28 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground/70">
            Legal
          </p>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Kebijakan Privasi
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Kami menghargai privasi Anda. Kebijakan ini menjelaskan data apa
            yang kami kumpulkan, bagaimana kami menggunakannya, dan bagaimana
            kami melindungi informasi kesehatan anak Anda.
          </p>
          <p className="mt-4 text-sm text-primary-foreground/60">
            Terakhir diperbarui: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="w-full my-2 gap-2 flex items-center">
          <ArrowLeft
            onClick={() => namespace.router.back()}
            className="cursor-pointer h-5 w-5"
          />
          <h1 className="text-lg font-semibold">Kembali</h1>
        </div>
        <nav className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Daftar Isi
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-16">
        <div className="space-y-12">
          {sections.map((section) => (
            <article key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.content.map((block, i) => (
                  <div key={i}>
                    {block.subtitle && (
                      <h3 className="text-base font-semibold text-foreground">
                        {block.subtitle}
                      </h3>
                    )}
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {block.text}
                    </p>
                  </div>
                ))}
                {section.list && (
                  <ul className="ml-5 list-disc space-y-2">
                    {section.list.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.footer && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {section.footer}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PolicySection;
