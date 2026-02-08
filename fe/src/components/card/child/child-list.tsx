import { ChildRespone } from "@/types/res";
import { calculateAge } from "@/utils/age";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

interface ChildListProps {
  res: ChildRespone;
  onClick?: () => void;
}
const ChildList: React.FC<ChildListProps> = ({ res, onClick }) => {
  return (
    <div className="w-full border flex items-center  p-2 rounded-lg justify-between ">
      <div className="w-full flex items-center space-x-1">
        <Image
          alt={`${res.fullName}`}
          src={res.avaChild ? res.avaChild : "/avatars/1.png"}
          width={50}
          height={50}
          className="aspect-square object-cover rounded-full"
        />
        <div className="w-full ">
          <h1 className="text-lg font-bold">{res.fullName}</h1>
          <p>{calculateAge(res.dateOfBirth)}</p>
        </div>
      </div>
      <div className="w-auto h-auto bg-primary rounded-full p-2">
        <Icon
          icon="mingcute:arrow-right-fill"
          width="24"
          height="24"
          className="text-background"
          onClick={() => onClick!()}
        />
      </div>
    </div>
  );
};
export default ChildList;
