import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ArrowLeft } from "lucide-react";

interface ComingSoonProps {
  router: AppRouterInstance;
}

export default function ComingSoon({ router }: ComingSoonProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute -bottom-32 -right-32 h-[450px] w-[450px] rounded-full bg-chart-2/20 blur-3xl animate-float-slow animate-float-delay-2" />
      <div className="absolute top-1/3 left-1/4 h-52 w-52 rounded-full bg-chart-3/20 blur-2xl animate-float-fast animate-float-delay-1" />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-card/80 p-12 text-center shadow-enhanced backdrop-blur-enhanced animate-enter">
        <div className="mb-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          <span className="text-gradient-primary text-base font-bold">
            Nutriplate
          </span>
        </div>

        <div className="mb-6 inline-flex items-center rounded-full bg-secondary px-5 py-1.5 text-xs font-semibold tracking-wider text-secondary-foreground border border-border uppercase">
          Fitur Baru
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-primary leading-tight">
          Segera Hadir
        </h1>

        <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
          Tim <span className="font-semibold text-foreground">Nutriplate</span>{" "}
          sedang menyiapkan fitur terbaru untuk membantu Anda memantau dan
          mengelola kebutuhan nutrisi dengan lebih akurat dan efisien. Nantikan
          pembaruan selanjutnya!
        </p>

        <div className="my-8 h-px w-24 mx-auto bg-border" />

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-enhanced hover-lift transition-all"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nutriplate. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </section>
  );
}
