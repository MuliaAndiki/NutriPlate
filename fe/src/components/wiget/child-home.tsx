import Image from "next/image";
import ChildrenPattrent from "../svg/children-pattrent";
import { ChildRespone } from "@/types/res";

interface ChildrenWigetProps {
  res: ChildRespone;
  index: number;
}

const ChildrenWiget: React.FC<ChildrenWigetProps> = ({ res, index }) => {
  return (
    <section className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-0">
          <ChildrenPattrent />
        </div>

        <div className="absolute top-2 left-4 z-10 border rounded-lg px-3 py-1 bg-background">
          <h1 className="text-primary font-semibold">Anak {index + 1}</h1>
        </div>

        <Image
          alt="child"
          src={res.avaChild ? res.avaChild : "/avatars/1.png"}
          width={100}
          height={100}
          className="absolute left-6 top-12 z-10 
             w-[100px] h-[100px] 
             rounded-lg 
             object-cover"
        />

        <div className="absolute top-12 right-6 z-10 flex flex-col text-background">
          <h1 className="text-2xl font-bold leading-tight">{res.fullName}</h1>

          <p className="text-lg">
            Gizi hari ini: <span className="font-bold">Cukup</span>
          </p>

          <p className="text-lg">
            Perkembangan:{" "}
            <span className="font-bold">
              {res.measurement?.nutritionStatus ?? "belum "}
            </span>
          </p>
        </div>

        <div className="pt-40" />
      </div>
    </section>
  );
};

export default ChildrenWiget;
