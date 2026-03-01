import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const lastUpdated = "1 Maret 2026";

const sections = [
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
interface PolicySectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}

const TermsSection: React.FC<PolicySectionProps> = ({ namespace }) => {
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
            Ketentuan Layanan
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Ketentuan ini mengatur penggunaan Anda terhadap platform NutriPlate.
            Harap baca dengan seksama sebelum menggunakan layanan kami.
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
                {section.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {p}
                  </p>
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

        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/policy"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm hover-lift transition-all"
          >
            Kebijakan Privasi
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-enhanced hover-lift transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TermsSection;
