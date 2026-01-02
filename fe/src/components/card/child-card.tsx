import Image from "next/image";
import { Card } from "../ui/card";
import { ChildCardProps } from "@/types/props.type";
import Link from "next/link";
import { GenderFormat } from "@/utils/string.format";

const ChildCard: React.FC<ChildCardProps> = ({ data }) => {
  return (
    <Card className="w-full p-2 ">
      <Link href={`/parent/profile-anak/detail/${data.id}`}>
        <div className="w-full flex space-x-2 justify-start items-center h-full  ">
          <Image
            alt="child"
            src={data.avaChild ? data.avaChild : "/images/childDummy.png"}
            width={100}
            height={100}
            className="aspect-square rounded-lg object-cover"
          />
          <div className="w-full">
            <h1 className="text-2xl font-extrabold">{data.fullName}</h1>
            <div className="w-full flex justify-start flex-col ">
              <h1>Usia : {data.dateOfBirth}</h1>
              <h1>Jenis Kelamin : {GenderFormat(data.gender)}</h1>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ChildCard;
