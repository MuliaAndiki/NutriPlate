import { UserResponse } from "@/types/res";
import { formatDateTime } from "@/utils/time.format";
import Image from "next/image";

interface ParentCardProps {
  res: UserResponse;
}
const ParentCard: React.FC<ParentCardProps> = ({ res }) => {
  return (
    <div className="w-full border p-4 rounded-lg flex items-center justify-start space-x-2">
      <Image
        alt="avatar"
        src={res.avaUrl ? res.avaUrl : "/avatars/1.png"}
        width={100}
        height={100}
        className="aspect-square object-cover rounded-full"
      />
      <div className="w-full flex flex-col items-start ">
        <h1 className="text-2xl font-bold">{res.fullName}</h1>
        <p className="text-lg ">Kontak : {res.phone ?? res.email}</p>
        <span className="text-sm ">
          DiPerbaharui: {""}
          {formatDateTime(res.updatedAt, {
            style: "day-date-slash",
          })}
        </span>
      </div>
    </div>
  );
};

export default ParentCard;
