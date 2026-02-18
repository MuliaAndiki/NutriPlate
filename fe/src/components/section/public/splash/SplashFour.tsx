import UiSplashV4 from "@/components/svg/ui4-splash";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const StepFour = ({ setStep }: any) => {
  return (
    <div className="w-full bg-primary overflow-hidden relative min-h-screen">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full min-h-screen flex flex-col justify-center items-center text-background"
      >
        <div className="absolute z-0">
          <svg
            width="440"
            height="888"
            viewBox="0 0 440 888"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-16 882C1073 949 -173 268 74 747C243 1073 -275 -540 471 194"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <div className="w-full max-w-xs z-10 text-center">
          <h1 className="text-4xl font-extrabold">
            Pantau Tumbuh Kembang Anak
          </h1>
          <p className="font-light text-lg mt-2">
            Ikuti program nutrisi dan terima pengingat untuk mendukung tumbuh
            kembang anak setiap hari.
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto z-10 relative mt-10 scale-110">
          <UiSplashV4 />

          <div className="absolute -z-10 top-1/3 right-1/2 w-60 h-60 bg-background/20 rounded-full blur-sm translate-x-12" />
          <div className="absolute -z-10 top-1/3 left-1/2 w-60 h-60 bg-background/20 rounded-full blur-sm -translate-x-12" />
        </div>

        <button
          onClick={() => setStep("final")}
          className="relative mt-16 flex justify-center items-center"
          aria-label="Lanjut ke tahap akhir"
        >
          <div className="absolute w-36 h-36 rounded-full bg-background/40 animate-ping" />
          <div className="absolute w-28 h-28 rounded-full bg-background/60 animate-pulse" />

          <div className="relative z-10 p-4 bg-background rounded-full flex items-center justify-center shadow-lg">
            <Icon
              icon="mingcute:arrow-right-fill"
              width="36"
              height="36"
              className="text-primary"
            />
          </div>
        </button>
      </motion.section>
    </div>
  );
};

export default StepFour;
