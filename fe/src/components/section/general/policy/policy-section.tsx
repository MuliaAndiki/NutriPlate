import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { policySection } from "@/configs/app.config";

interface PolicySectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}

const PolicySection: React.FC<PolicySectionProps> = ({ namespace }) => {
  const lastUpdated = "1 Maret 2026";
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
            {policySection.map((s) => (
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
          {policySection.map((section) => (
            <article key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.content.map((block: any, i: number) => (
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
