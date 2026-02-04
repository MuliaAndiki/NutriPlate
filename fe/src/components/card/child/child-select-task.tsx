import { ChildRespone } from "@/types/res";
import { calculateAge } from "@/utils/age";
import Image from "next/image";

interface ChildSelectTaskProps {
  res: ChildRespone;
  onClick?: () => void;
}
const ChildSelectTask: React.FC<ChildSelectTaskProps> = ({ res, onClick }) => {
  return (
    <div className="w-full  rounded-lg border" onClick={() => onClick!()}>
      <div className="w-full p-4 bg-primary/60 rounded-t-lg">
        <h1 className="text-lg font-bold">Balita Terdaftar</h1>
      </div>
      <div className="w-full flex items-center justify-start p-2 border rounded-lg space-x-2">
        <Image
          alt="avatar"
          src={res.avaChild ? res.avaChild : "/avatars/1.png"}
          width={50}
          height={50}
          className="object-cover aspect-square rounded-full"
        />
        <div className="w-full flex justify-center items-start flex-col">
          <h1 className="text-lg font-bold">{res.fullName}</h1>
          <p className="text-sm">{calculateAge(res.dateOfBirth)}</p>
        </div>
      </div>
    </div>
  );
};

export default ChildSelectTask;
