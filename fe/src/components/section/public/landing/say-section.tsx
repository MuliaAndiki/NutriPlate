"use client";

import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";

import TestimonialCard from "@/components/card/testimonial-card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const SaySection = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);

  const testimonials = useMemo(
    () => [
      {
        quote:
          "Pemantauan pertumbuhan anak jadi lebih rapi dan jelas. Grafiknya mudah dipahami.",
        name: "Budi Pekerti",
        role: "Orang Tua",
        avatar: "/avatars/1.png",
      },
      {
        quote:
          "Notifikasi jadwal posyandu membantu saya mengingatkan orang tua tepat waktu.",
        name: "Siti Nurbaya",
        role: "Kader Posyandu",
        avatar: "/avatars/2.png",
      },
      {
        quote:
          "Pencatatan asupan gizi harian sangat membantu untuk evaluasi nutrisi anak.",
        name: "Andi Nugraha",
        role: "Tenaga Kesehatan",
        avatar: "/avatars/3.png",
      },
      {
        quote:
          "Data anak mudah diakses dan aman, jadi lebih cepat saat konsultasi.",
        name: "Rani Pratama",
        role: "Orang Tua",
        avatar: "/avatars/4.png",
      },
      {
        quote:
          "Aplikasinya ringan dan sederhana, cocok untuk pendampingan di lapangan.",
        name: "Dewi Lestari",
        role: "Bidan",
        avatar: "/avatars/5.png",
      },
    ],
    [],
  );

  return (
    <section className="w-full bg-secondary/60 py-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4" data-aos="fade-right">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">
                Kata Mereka Tentang Aplikasi Kami
              </h2>
              <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                at iaculis velit, sed facilisis diam.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-border bg-background text-primary hover:bg-primary/10"
                onClick={() => api?.scrollPrev()}
              >
                <Icon icon="mdi:chevron-left" className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                size="icon"
                className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => api?.scrollNext()}
              >
                <Icon icon="mdi:chevron-right" className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
            data-aos="fade-left"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((item) => (
                <CarouselItem
                  key={item.name}
                  className="basis-[85%] pl-4 sm:basis-[55%] lg:basis-[45%]"
                >
                  <TestimonialCard {...item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default SaySection;
