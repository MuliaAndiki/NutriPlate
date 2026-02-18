import UiSplashV3 from "@/components/svg/ui3-splash";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

const StepThree = ({ setStep }: any) => {
  return (
    <div className="w-full bg-primary overflow-hidden relative min-h-screen">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full min-h-screen flex flex-col justify-center items-center  text-background"
      >
        <div className="absolute z-0">
          <svg
            width="416"
            height="891"
            viewBox="0 0 416 891"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M378.5 953.407C-550.5 701.407 666.5 637.871 366.5 720.907C138.5 784.014 790 -411.593 -12.5 151.407"
              stroke="white"
              stroke-width="0.5"
            />
          </svg>
        </div>
        <div className="w-full max-w-xs" data-aos="fade-up">
          <h1 className="text-4xl font-extrabold text-background text-center">
            Pantau Tumbuh Kembang Anak
          </h1>
          <p
            className="font-light text-center text-lg text-background mt-2"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Data penimbangan dari posyandu membantu memantau pertumbuhan anak
            secara berkala dan terarah.
          </p>
        </div>
        <div
          className="w-full max-w-xl mx-auto z-1 relative"
          data-aos="zoom-in"
        >
          <UiSplashV3 />
          <div className="w-60 h-60  bg-background/20 translate-x-15 blur-sm rounded-full top-35 right-1/2 absolute z-[-1]" />
          <div className="w-60 h-60  bg-background/20  -translate-x-15 blur-sm rounded-full top-35 left-1/2 absolute z-[-1]" />
        </div>

        <ButtonWrapper
          onClick={() => setStep("sp4")}
          className="mt-6 text-2xl font-extrabold z-1"
          variant={"splash"}
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

export default StepThree;
