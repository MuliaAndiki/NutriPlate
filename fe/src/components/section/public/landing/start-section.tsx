"use client";

const steps = [
  {
    number: "1",
    title: "Daftarkan Akun",
    description:
      "Buat akun orang tua atau kader untuk mulai mengelola data balita.",
  },
  {
    number: "2",
    title: "Daftarkan Data Anak",
    description:
      "Lengkapi profil anak, data pertumbuhan, dan riwayat kesehatan awal.",
  },
  {
    number: "3",
    title: "Mulai Pantau Perkembangan",
    description:
      "Catat asupan, cek grafik pertumbuhan, dan ikuti program gizi terstruktur.",
  },
];

const StartSection = () => {
  return (
    <section className="w-full bg-background py-16 ">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div
          className="flex flex-col items-center gap-4 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Mulai Menggunakan NutriPlate
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Mulai gunakan NutriPlate dengan langkah sederhana. Dari pendaftaran
            akun hingga pemantauan gizi harian, semua proses dibuat cepat dan
            mudah.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center"
              data-aos="fade-up"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 bg-secondary text-primary text-lg font-semibold">
                {step.number}
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StartSection;
