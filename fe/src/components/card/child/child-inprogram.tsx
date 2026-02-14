import { ChildRespone } from "@/types/res";
import { calculateAge } from "@/utils/age";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

interface ChildInProgramProps {
  res: ChildRespone;
  onClick?: () => void;
}
const ChildInProgram: React.FC<ChildInProgramProps> = ({ res, onClick }) => {
  return (
    <div className="w-full flex items-center justify-between p-2 border rounded-lg space-x-2">
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
      <div className=" border rounded-full bg-primary p-2">
        <Icon
          icon="tabler:arrow-right"
          width="24"
          height="24"
          className="text-background"
          onClick={() => onClick!()}
        />
      </div>
    </div>
  );
};

export default ChildInProgram;
