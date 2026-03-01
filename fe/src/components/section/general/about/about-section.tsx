import Link from "next/link";
import {
  Heart,
  BarChart3,
  Cpu,
  Users,
  ShieldCheck,
  Target,
  Eye,
  Utensils,
  Activity,
  Wifi,
  ArrowLeft,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const featureList = [
  {
    icon: <Utensils className="h-6 w-6" />,
    title: "Analisis Gizi dengan AI",
    description:
      "Foto makanan anak, dan sistem YOLO (You Only Look Once) kami akan secara otomatis mendeteksi jenis makanan serta menghitung kandungan kalori, protein, lemak, karbohidrat, serat, kalsium, zat besi, vitamin A, dan vitamin C.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Grafik Pertumbuhan WHO",
    description:
      "Berat badan dan tinggi badan anak dihitung menggunakan standar pertumbuhan WHO untuk menghasilkan z-score. Hasilnya dikelompokkan menjadi status normal, stunted, atau severely stunted dengan rekomendasi tindakan.",
  },
  {
    icon: <Wifi className="h-6 w-6" />,
    title: "Integrasi Perangkat IoT",
    description:
      "Timbangan digital dan alat ukur IoT terhubung langsung ke NutriPlate melalui jaringan lokal. Berat makanan dikirim secara real-time sehingga perhitungan nutrisi menjadi lebih presisi tanpa input manual.",
  },
  {
    icon: <Activity className="h-6 w-6" />,
    title: "Pemantauan Harian",
    description:
      "Catatan asupan gizi harian anak dilacak lengkap dengan target harian. Ringkasan nutrisi dan grafik tren tersedia untuk membantu orang tua memastikan pola makan anak seimbang setiap hari.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Program Intervensi Gizi",
    description:
      "Kader dan posyandu dapat membuat program gizi terstruktur dengan timeline, subtask, dan target spesifik untuk setiap anak. Progres dipantau secara real-time dengan notifikasi otomatis.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Notifikasi & Pengingat",
    description:
      "Sistem mengirimkan pengingat otomatis untuk jadwal posyandu, evaluasi pertumbuhan, dan catatan asupan gizi yang terlewat. Notifikasi disesuaikan berdasarkan peran pengguna.",
  },
];

const roles = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Orang Tua",
    description:
      "Pantau asupan gizi harian, lacak pertumbuhan anak melalui grafik WHO, dan terima rekomendasi nutrisi yang dipersonalisasi. Foto makanan anak dan biarkan AI menghitung kandungan gizinya secara otomatis.",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Kader Posyandu",
    description:
      "Kelola data balita di wilayah kerja, buat laporan pertumbuhan, dan jalankan program intervensi gizi secara terstruktur. Akses data yang akurat untuk pengambilan keputusan di lapangan.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Tenaga Kesehatan & Posyandu",
    description:
      "Supervisi data pertumbuhan anak secara menyeluruh, kelola kader, verifikasi pengukuran, dan pantau efektivitas program gizi. Dashboard analytics untuk insight kesehatan populasi.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
];

const techStack = [
  {
    icon: <Cpu className="h-6 w-6" />,
    label: "Computer Vision (YOLO)",
    desc: "Model deteksi objek YOLOv8 terlatih mengenali jenis makanan Indonesia untuk analisis nutrisi otomatis dari foto.",
  },
  {
    icon: <Wifi className="h-6 w-6" />,
    label: "IoT Integration",
    desc: "Timbangan digital terhubung via jaringan lokal untuk mengirim berat makanan secara real-time ke aplikasi.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    label: "WHO Growth Standards",
    desc: "Perhitungan z-score berbasis standar WHO 2006 untuk klasifikasi pertumbuhan dan deteksi stunting.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    label: "Keamanan Data",
    desc: "Enkripsi password dengan bcrypt, autentikasi JWT, sanitasi data sensitif, dan security headers pada setiap response.",
  },
];

const headerContent = [
  {
    title: "Misi Kami",
    icon: <Target className="h-6 w-6" />,
    desc: "Menyediakan alat digital yang akurat, mudah digunakan, dan dapat diakses oleh seluruh lapisan masyarakat untuk memantau asupan gizi dan pertumbuhan anak sejak dini. Kami berkomitmen membantu menurunkan angka stunting melalui deteksi dini, edukasi gizi, dan kolaborasi antara orang tua dengan tenaga kesehatan di posyandu.",
    shadow: "bg-primary",
    text: "text-primary",
  },
  {
    title: "Visi Kami",
    icon: <Eye className="h-6 w-6" />,
    desc: "Menjadi platform pemantauan gizi anak terdepan di Indonesia yang memanfaatkan kecerdasan buatan dan Internet of Things (IoT) untuk menciptakan generasi yang sehat, tumbuh optimal, dan bebas dari malnutrisi. Kami membayangkan ekosistem kesehatan anak yang terkoneksi, transparan, dan berbasis data.",
    shadow: "bg-info",
    text: "text-info",
  },
];

interface AboutSoftwareSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const AboutSoftwareSection: React.FC<AboutSoftwareSectionProps> = ({
  namespace,
}) => {
  return (
    <section className="w-full min-h-screen">
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--primary)_0%,#6366f1_100%)] text-primary-foreground">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 md:py-28 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground/70">
            Tentang NutriPlate
          </p>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Teknologi untuk Masa Depan
            <br className="hidden sm:block" /> Gizi Anak Indonesia
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            NutriPlate adalah platform pemantauan gizi dan tumbuh kembang balita
            yang menghubungkan orang tua, kader posyandu, dan tenaga kesehatan
            dalam satu ekosistem digital terintegrasi.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="w-full my-2 gap-2 flex items-center">
          <ArrowLeft
            onClick={() => namespace.router.back()}
            className="cursor-pointer h-5 w-5"
          />
          <h1 className="text-lg font-semibold">Kembali</h1>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {headerContent.map((items) => (
            <>
              <div className="rounded-2xl border border-border bg-card p-8 shadow-enhanced">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${items.shadow}/10  ${items.text}`}
                >
                  {items.icon}
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {items.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {items.desc}
                </p>
              </div>
            </>
          ))}
        </div>
      </div>

      <div className="bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Apa yang NutriPlate Lakukan?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Platform all-in-one untuk pemantauan gizi dan pertumbuhan balita,
              dari pencatatan harian hingga analisis berbasis AI.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureList.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-enhanced"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Siapa yang Terbantu?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            NutriPlate dirancang untuk semua pihak yang peduli dengan kesehatan
            dan pertumbuhan anak.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.title}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition hover:shadow-enhanced"
            >
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${role.bg} ${role.color}`}
              >
                {role.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {role.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Teknologi di Balik NutriPlate
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Dibangun dengan stack modern untuk keandalan, kecepatan, dan
              skalabilitas.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech) => (
              <div
                key={tech.label}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {tech.icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {tech.label}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-3/10 text-chart-3">
          <Heart className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-foreground md:text-3xl">
          Komitmen Kami
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          NutriPlate hadir sebagai bentuk kepedulian terhadap kesehatan anak
          Indonesia. Kami percaya bahwa setiap anak berhak mendapatkan
          pemantauan gizi yang akurat dan intervensi yang tepat waktu. Melalui
          teknologi, kami berupaya menjembatani orang tua dengan tenaga
          kesehatan untuk memastikan tumbuh kembang anak berjalan optimal.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Platform ini dikembangkan secara terbuka dengan semangat kolaborasi.
          Kami terus meningkatkan akurasi model AI, memperluas dukungan
          perangkat IoT, dan menyempurnakan pengalaman pengguna berdasarkan
          masukan dari lapangan.
        </p>
      </div>
    </section>
  );
};

export default AboutSoftwareSection;
