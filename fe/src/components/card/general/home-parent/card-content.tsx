import VectorHome1 from "@/components/svg/vector-home";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

const CardKontenHomeParent = () => {
  return (
    <div className="w-full bg-linear-to-r from-primary to-primary/40 p-4 rounded-lg flex items-center justify-between space-x-4 overflow-hidden relative z-0">
      <div className="flex w-full max-w-sm flex-col items-center justify-center z-2">
        <h1 className="font-bold text-background text-lg ">
          Lengkapi data anak untuk memulai pemantauan
        </h1>
        <ButtonWrapper
          className="w-full"
          variant={"splash"}
          startIcon={
            <Icon
              icon="lucide:baby"
              width="24"
              height="24"
              className="text-primary"
            />
          }
        >
          Tambah Data Anak
        </ButtonWrapper>
      </div>
      <Image
        alt="baby"
        src={"/images/baby1.png"}
        className="z-1"
        width={170}
        height={170}
      />
      <div className="absolute w-30 h-30 right-0 z-0 ">
        <VectorHome1 />
      </div>
      <Image
        alt="tedybear"
        src={"/images/bear.png"}
        width={95}
        height={95}
        className="absolute left-0  top-0 -translate-x-4"
      />
      <Image
        alt="bottle"
        src={"/images/bottle.png"}
        width={87}
        height={87}
        className="absolute left-40  bottom-0 translate-y-13 -translate-x-4"
      />
    </div>
  );
};

export default CardKontenHomeParent;
