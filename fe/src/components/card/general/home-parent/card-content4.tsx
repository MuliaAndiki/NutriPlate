import Image from "next/image";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
const CardKontenHomeParent4 = () => {
  return (
    <div className="w-full bg-linear-to-r from-primary to-primary/40 relative overflow-hidden p-4 rounded-lg flex justify-between items-center z-0">
      <div className="w-full flex flex-col items-start z-2 ">
        <h1 className="text-lg font-bold text-background">Program Gizi</h1>
        <p className="font-light text-background">
          Ikuti program gizi dari posyandu sesuai usia dan kebutuhan anak.
        </p>
        <ButtonWrapper variant={"splash"} className="text-primary font-light">
          Mulai Sekarang
        </ButtonWrapper>
      </div>
      <Image
        alt="baby4"
        src={"/images/baby4.png"}
        width={150}
        height={150}
        className="z-2"
      />
      <Image
        alt="phonendoscope"
        src={"/images/phonendoscope.png"}
        width={100}
        height={100}
        className="absolute top-0 right-0 -translate-y-5 translate-x-7 opacity-50"
      />
      <Image
        alt="thermometer"
        src={"/images/thermometer.png"}
        width={40}
        height={40}
        className="absolute left-0 bottom-0 -translate-y-5 -translate-x-3 opacity-50"
      />
      <Image
        alt="Periwinkle"
        src={"/images/periwinkle.png"}
        width={70}
        height={70}
        className="absolute right-50 top-0 -translate-y-8  "
      />
      <Image
        alt="stethoscope"
        src={"/images/stethoscope.png"}
        width={130}
        height={130}
        className="absolute right-25 bottom-0 translate-y-10 opacity-50  "
      />
    </div>
  );
};

export default CardKontenHomeParent4;
