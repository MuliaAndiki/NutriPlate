import Image from "next/image";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";

const CardKontenHomeParent3 = () => {
  return (
    <div className="w-full bg-linear-to-r from-primary/40 space-x-4 p-4 relative overflow-hidden z-0 to-primary rounded-lg flex items-center  justify-between">
      <Image
        alt="baby3"
        src={"/images/baby3.png"}
        width={200}
        height={200}
        className="z-2"
      />
      <div className="w-full flex  flex-col">
        <h1 className="text-lg font-bold text-end text-background">
          Status Asupan Gizi
        </h1>
        <p className="font-light text-end text-background">
          Lihat ringkasan asupan harian dan kebutuhan gizi anak.
        </p>
        <div className="flex justify-end">
          <ButtonWrapper className="text-primary font-light" variant={"splash"}>
            Mulai Sekarang
          </ButtonWrapper>
        </div>
      </div>
      <Image
        className="absolute left-0 top-0 -translate-x-5 -translate-y-2 opacity-50"
        alt="broccoli"
        src={"/images/broccoli.png"}
        width={90}
        height={90}
      />
      <Image
        className="absolute left-0 bottom-0 -translate-x-5 translate-y-4 opacity-50"
        alt="zigzag"
        src={"/images/zigzag.png"}
        width={90}
        height={90}
      />
      <Image
        className="absolute right-35 bottom-0 translate-x-5 translate-y-15 opacity-50"
        alt="food"
        src={"/images/food.png"}
        width={180}
        height={180}
      />
    </div>
  );
};

export default CardKontenHomeParent3;
