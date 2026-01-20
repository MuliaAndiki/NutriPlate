import UiSplashV2 from "@/components/svg/ui2-splash";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

const StepTwo = ({ setStep }: any) => {
  return (
    <div className="w-full bg-primary overflow-hidden relative min-h-screen">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full min-h-screen flex flex-col justify-center items-center bg-primary text-background"
      >
        <div className="absolute z-0">
          <svg
            width="429"
            height="936"
            viewBox="0 0 429 936"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M339.5 -12C-682 271.5 736.5 477.5 365 352.5C122.271 270.828 816.5 1363.5 -14.5003 743.5"
              stroke="white"
              stroke-width="0.5"
            />
          </svg>
        </div>
        <div className="w-full max-w-xs" data-aos="fade-up">
          <h1 className="text-4xl font-extrabold text-background text-center">
            Pantau Asupan Makan Anak
          </h1>
          <p
            className="font-light text-center text-sm text-background mt-2"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Foto dan timbang makanan anak untuk mengetahui kalori dan nutrisi
            yang dikonsumsi setiap hari.
          </p>
        </div>
        <div
          className="w-full max-w-xl mx-auto z-1 relative"
          data-aos="zoom-in"
        >
          <UiSplashV2 />
          <div className="w-60 h-50  bg-background/20 translate-x-15 blur-sm rounded-full top-60 right-1/2 absolute z-[-1]" />
          <div className="w-60 h-50  bg-background/20  -translate-x-15 blur-sm rounded-full top-60 left-1/2 absolute z-[-1]" />
        </div>

        <ButtonWrapper
          onClick={() => setStep("sp3")}
          variant={"splash"}
          className="font-bold text-xl h-auto w-auto mt-6 z-1"
          rightIcon={
            <Icon icon="mingcute:arrow-right-fill" width="24" height="24" />
          }
        >
          Selanjutnya
        </ButtonWrapper>
      </motion.section>
    </div>
  );
};

export default StepTwo;
