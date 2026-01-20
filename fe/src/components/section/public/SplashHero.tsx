import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import VectorSplash from "@/components/svg/vector-splash";
import UiSplashV1 from "@/components/svg/ui-splash";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { Icon } from "@iconify/react";

interface SplashProps {
  showSplash: boolean;
  setStep: React.Dispatch<React.SetStateAction<any>>;
  step: any;
}

const SplashHeroSection: React.FC<SplashProps> = ({
  showSplash,
  setStep,
  step,
}) => {
  return (
    <div className="w-full bg-primary overflow-hidden relative min-h-screen">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-screen flex justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-72 h-72 bg-background rounded-full"
            />

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute"
            >
              <Image
                alt="icon"
                src="/images/icons.svg"
                width={255}
                height={255}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full min-h-screen flex flex-col justify-center items-center relative"
          >
            <div className="absolute z-0">
              <VectorSplash />
            </div>

            <div className="w-full max-w-xs z-1" data-aos="fade-up">
              <h1 className="text-4xl font-extrabold text-background text-center">
                Selamat Datang di NutriPlate
              </h1>
              <p
                className="font-light text-center text-lg text-background mt-2"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                Pantau asupan gizi dan pertumbuhan anak dengan lebih mudah,
                langsung dari rumah hingga posyandu.
              </p>
            </div>

            <div
              className="w-full max-w-xl mx-auto z-1 mt-6"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <UiSplashV1 />
            </div>

            <div
              className="w-full flex justify-center mt-6 z-1"
              data-aos="fade-up"
              data-aos-delay="450"
            >
              <ButtonWrapper
                variant="splash"
                rightIcon={
                  <Icon icon="formkit:arrowright" width="36" height="36" />
                }
                onClick={() => setStep("sp2")}
                className="font-bold text-xl h-auto w-auto"
              >
                Mulai Sekarang
              </ButtonWrapper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashHeroSection;
