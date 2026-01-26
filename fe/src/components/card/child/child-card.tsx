import Image from "next/image";
import Link from "next/link";

import { GenderFormat } from "@/utils/string.format";
import { Card } from "../../ui/card";
import { ChildRespone } from "@/types/res/child.respone";
import { formatDateTime } from "@/utils/time.format";

interface ChildCardProps {
  res: ChildRespone;
}

const ChildCard: React.FC<ChildCardProps> = ({ res }) => {
  return (
    <Card className="w-full p-2 ">
      <Link href={`/parent/profile-anak/detail/${res.id}`}>
        <div className="w-full flex space-x-2 justify-start items-center h-full  ">
          <Image
            alt="child"
            src={res.avaChild ? res.avaChild : "/images/childDummy.png"}
            width={90}
            height={90}
            className="aspect-square rounded-lg object-cover"
          />
          <div className="w-full">
            <h1 className="text-2xl font-extrabold">{res.fullName}</h1>
            <div className="w-full flex justify-start flex-col ">
              <h1>
                Tanggal Lahir :{" "}
                {formatDateTime(res.dateOfBirth, { style: "date" })}
              </h1>
              <h1>Jenis Kelamin : {GenderFormat(res.gender)}</h1>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ChildCard;
