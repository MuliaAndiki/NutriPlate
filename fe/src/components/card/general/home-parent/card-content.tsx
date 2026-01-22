import VectorHome1 from "@/components/svg/vector-home";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

const CardKontenHomeParent = () => {
  return (
    <div className="w-full bg-linear-to-r from-primary to-primary/40 p-4 rounded-lg flex items-center justify-between space-x-4 relative z-0">
      <div className="flex w-full max-w-sm flex-col items-center justify-center">
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
      <Image alt="baby" src={"/images/baby1.png"} width={170} height={170} />
      <div className="absolute w-30 h-30 right-0 ">
        <VectorHome1 />
      </div>
      {/* <Image
            alt="tedybear"
            src={"/images/teddybear.png"}
            width={100}
            height={100}
            className="absolute"
          /> */}
    </div>
  );
};

export default CardKontenHomeParent;
