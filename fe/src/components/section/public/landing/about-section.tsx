import PhoneMockup2 from "@/components/svg/phone-mockup2";
import { Icon } from "@iconify/react/dist/iconify.js";

const AboutSection = () => {
  const featureItems = [
    {
      title: "Pantau Pertumbuhan",
      description:
        "Pantau perkembangan anak secara real-time dengan grafik yang mudah dipahami.",
      icon: "mdi:chart-line",
    },
    {
      title: "Catat Asupan Gizi",
      description:
        "Input harian makanan anak untuk analisis gizi yang lebih akurat.",
      icon: "mdi:food-apple-outline",
    },
    {
      title: "Program Gizi Terstruktur",
      description:
        "Rencana gizi yang terarah agar orang tua lebih teratur dalam pemantauan.",
      icon: "mdi:clipboard-text-outline",
    },
    {
      title: "Notifikasi & Pengingat",
      description:
        "Pengingat jadwal posyandu dan asupan harian agar tidak terlewat.",
      icon: "mdi:bell-outline",
    },
    {
      title: "Data Posyandu Terintegrasi",
      description:
        "Semua data anak tersimpan rapi dan mudah diakses oleh tenaga kesehatan.",
      icon: "mdi:database-outline",
    },
    {
      title: "Integrasi Teknologi IoT",
      description:
        "Koneksi ke perangkat pintar untuk pengukuran yang lebih cepat dan presisi.",
      icon: "mdi:cpu-64-bit",
    },
  ];
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center space-y-4 relative px-6 py-16 md:px-10 md:py-20 lg:p-20">
      <div className="absolute bg-primary/70 w-50 h-50 rounded-full z-1 blur-2xl right-0 bottom-50" />
      <div
        className="w-full flex flex-col items-center justify-center  space-y-4"
        data-aos="fade-up"
      >
        <h1 className="text-3xl md:text-4xl font-bold">Apa itu Nutriplate</h1>
        <p className="text-center text-base md:text-lg lg:text-2xl font-light max-w-4xl">
          NutriPlate membantu orang tua, kader, dan tenaga kesehatan memantau
          gizi balita melalui data pertumbuhan, catatan asupan, program gizi,
          hingga pengingat otomatis dalam satu aplikasi terpadu.
        </p>
      </div>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 items-center mt-4">
        <div className="flex flex-col gap-8 items-center lg:items-end">
          {featureItems.slice(0, 3).map((item, idx) => {
            const offsetClass = [
              "lg:translate-y-0",
              "lg:translate-y-4",
              "lg:translate-y-12",
            ][idx];
            return (
              <div
                key={item.title}
                className={`w-full max-w-sm flex items-start gap-4 text-left lg:text-right ${offsetClass}`}
                data-aos="fade-right"
              >
                <div className="flex p-2 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Icon icon={item.icon} className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-start  gap-1">
                  <h3 className="text-base md:text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-start">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="relative flex items-center justify-center"
          data-aos="zoom-in"
        >
          <PhoneMockup2 />
          <div className="absolute w-80 h-80 top-25 left-0 -translate-x-8 rounded-full border-8 border-primary/70 animate-heartbeat z-[-1]" />
          <div className="absolute w-100 h-100 top-15 left-0 -translate-x-18 rounded-full border-3 border-primary/50 animate-heartbeat-slow z-[-1]" />
        </div>

        <div className="flex flex-col gap-8 items-center lg:items-start">
          {featureItems.slice(3, 6).map((item, idx) => {
            const offsetClass = [
              "lg:translate-y-0",
              "lg:translate-y-4",
              "lg:translate-y-12",
            ][idx];
            return (
              <div
                key={item.title}
                className={`w-full max-w-sm flex items-start gap-4 text-left  lg:text-right ${offsetClass}`}
                data-aos="fade-left"
              >
                <div className="flex flex-col items-start lg:items-end gap-1">
                  <h3 className="text-base md:text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex p-2 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Icon icon={item.icon} className="w-7 h-7" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
