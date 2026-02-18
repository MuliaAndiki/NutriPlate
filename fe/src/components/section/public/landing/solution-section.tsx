import Image from "next/image";
const SolutionSection = () => {
      const SolutionContent = [
        {
          image: "/images/family.png",
          title: "Pemantauan Pertumbuhan Balita",
          decs: "Lacak berat, tinggi, dan indikator penting lainnya secara berkala dengan grafik yang mudah dipahami.",
          subtitle: "Pencatatan Asupan Gizi Harian",
          subdesc:
            "Catat menu makan harian untuk mengetahui kebutuhan gizi anak dan memastikan pola makan lebih seimbang.",
        },
        {
          image: "/images/family2.png",
          title: "Program Gizi & Intervensi Posyandu",
          decs: "Rencana intervensi gizi dibuat lebih terarah dan terpantau bersama kader serta tenaga kesehatan.",
          subtitle: "Notifikasi & Pengingat Kesehatan",
          subdesc:
            "Pengingat otomatis untuk jadwal posyandu, imunisasi, dan evaluasi pertumbuhan anak.",
        },
      ];
  return (
    <section className="w-full min-h-screen flex items-center flex-col justify-center relative px-6 py-16 md:px-10 md:py-20 lg:p-20">
      <div className="absolute w-80 h-80 rounded-full bg-primary blur-3xl left-0 top-0 -translate-x-60" />
      <div className="absolute w-80 h-80 rounded-full bg-primary blur-3xl right-0 bottom-0 translate-x-60" />
      <div className="w-full flex justify-center max-w-4xl" data-aos="fade-up">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">
          Solusi Digital Terpadu untuk Gizi dan Tumbuh Kembang Balita
        </h1>
      </div>
      <div className="w-full grid grid-cols-1 gap-10 mt-6">
        {SolutionContent.slice(0, 1).map((item, key) => (
          <div
            key={key}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
            data-aos="fade-up"
          >
            <div className="w-full flex justify-center">
              <Image
                alt="family"
                src={item.image}
                width={550}
                height={550}
                className="object-cover w-full max-w-[420px] md:max-w-[520px]"
                data-aos="fade-right"
              />
            </div>
            <div
              className="w-full flex flex-col items-start justify-center gap-4"
              data-aos="fade-left"
            >
              <div className="w-full flex items-start justify-center flex-col gap-1">
                <h1 className="text-lg md:text-2xl font-bold">{item.title}</h1>
                <p className="text-sm md:text-base">{item.decs}</p>
              </div>
              <div className="w-full flex items-start justify-center flex-col gap-1">
                <h1 className="text-lg md:text-2xl font-bold">
                  {item.subtitle}
                </h1>
                <p className="text-sm md:text-base">{item.subdesc}</p>
              </div>
            </div>
          </div>
        ))}

        {SolutionContent.slice(1, 2).map((item, key) => (
          <div
            key={key}
            className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8"
            data-aos="fade-up"
          >
            <div
              className="w-full flex flex-col items-start justify-center gap-4"
              data-aos="fade-right"
            >
              <div className="w-full flex items-start justify-center flex-col">
                <h1 className="text-lg md:text-2xl font-bold">{item.title}</h1>
                <p className="text-sm md:text-base">{item.decs}</p>
              </div>
              <div className="w-full flex items-start justify-center flex-col">
                <h1 className="text-lg md:text-2xl font-bold">
                  {item.subtitle}
                </h1>
                <p className="text-sm md:text-base">{item.subdesc}</p>
              </div>
            </div>
            <div className="w-full flex justify-center" data-aos="fade-left">
              <Image
                alt="family"
                src={item.image}
                width={500}
                height={500}
                className="object-cover w-full max-w-[400px] md:max-w-[480px]"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SolutionSection;
