import BabyMerge from "@/components/svg/baby.merge";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

const CardKontenHomeParent2 = () => {
  return (
    <div className="w-full bg-linear-to-r from-info to-info/40 relative overflow-hidden p-4 rounded-lg flex justify-between items-center z-0">
      <div className="w-full flex flex-col items-start max-w-sm justify-center z-2">
        <h1 className="text-lg font-bold text-background">
          Pemantauan Pertumbuhan
        </h1>
        <p className="font-light text-background">
          Pantau berat, tinggi, dan status pertumbuhan anak secara berkala.
        </p>
        <ButtonWrapper className="text-info font-light" variant={"splash"}>
          Mulai Sekarang
        </ButtonWrapper>
      </div>
      <BabyMerge />
      <Image
        alt="analysic"
        src={"/images/analysis.png"}
        width={100}
        height={100}
        className="absolute right-40 bottom-0 opacity-50"
      />
      <Image
        alt="hourglass"
        src={"/images/hourglass.png"}
        width={100}
        height={100}
        className="absolute top-0 left-0 -translate-x-4 -translate-y-4 opacity-50"
      />
      <Image
        alt="measuringtape"
        src={"/images/measuringtape.png"}
        width={100}
        height={100}
        className="absolute top-0 right-20 opacity-50 -translate-y-5"
      />
      <Icon
        icon="streamline-sharp:star-2-solid"
        width="34"
        height="34"
        className="text-warning absolute bottom-0 left-0 rotate-16 translate-y-2"
      />
      <Icon
        icon="streamline-sharp:star-2-solid"
        width="34"
        height="34"
        className="text-warning absolute top-0 left-25 -rotate-16 "
      />
    </div>
  );
};

export default CardKontenHomeParent2;
