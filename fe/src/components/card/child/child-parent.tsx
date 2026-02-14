import { ChildPartial } from "@/types/res";
import { calculateAge } from "@/utils/age";
import { formatDateTime } from "@/utils/time.format";
import Image from "next/image";
import React from "react";

interface ChildParentProps {
  res: ChildPartial;
}
const ChildParent: React.FC<ChildParentProps> = ({ res }) => {
  const statusGizi = res.measurements?.[0]?.nutritionStatus;

  const mappingContent = [
    {
      title: "Usia",
      res: calculateAge(res.dateOfBirth),
    },
    {
      title: "Jenis Kelamin",
      res: res.gender,
    },
    {
      title: "Status Gizi",
      res: statusGizi ?? "belum di ukur",
    },
  ];

  return (
    <div className="w-full flex items-center p-3 rounded-lg justify-start  border space-x-2">
      <Image
        alt="ava"
        src={res.avaChild ? res.avaChild : "/avatars/1.png"}
        width={100}
        height={100}
        className="aspect-square rounded-full object-cover"
      />
      <div className="w-full flex flex-col justify-center items-starts">
        <h1 className="text-xl font-bold">{res.fullName}</h1>
        <p className="text-sm">
          {formatDateTime(res.dateOfBirth, { style: "date" })}
        </p>

        <div className="w-full grid grid-cols-2 grid-rows-1">
          {mappingContent.map((items) => (
            <React.Fragment>
              <div>{items.title}</div>
              <h1>{items.res}</h1>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildParent;
