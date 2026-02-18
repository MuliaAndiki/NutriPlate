const WhySection = () => {
  const WhyContent = [
    {
      title: "Data Terpadu",
      desc: "Semua data pertumbuhan, asupan, dan riwayat kesehatan tersimpan rapi dalam satu tempat.",
    },
    {
      title: "Mudah Dipantau",
      desc: "Grafik dan ringkasan membantu orang tua memahami kondisi gizi balita dengan cepat.",
    },
    {
      title: "Notifikasi Tepat Waktu",
      desc: "Pengingat otomatis untuk jadwal posyandu, imunisasi, dan catatan gizi harian.",
    },
    {
      title: "Terhubung Posyandu",
      desc: "Kolaborasi lebih mudah antara orang tua, kader, dan tenaga kesehatan.",
    },
  ];
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center space-y-6 px-6 py-16 md:px-10 md:py-20 lg:p-20">
      <div className="w-full flex " data-aos="fade-up">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Kenapa Harus NutriPlate?
        </h1>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {WhyContent.map((items, key) => (
          <div
            key={key}
            className="border border-primary bg-linear-to-r from-primary/20 to-primary/80 p-6 md:p-10 lg:p-14 rounded-lg"
            data-aos="fade-up"
          >
            <h1 className="text-lg md:text-xl font-bold">{items.title}</h1>
            <p className="text-sm md:text-base">{items.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhySection;
