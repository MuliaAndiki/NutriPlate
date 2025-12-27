import Image from "next/image";
import { Card } from "../ui/card";

const ChildCard = () => {
  return (
    <Card className="w-full p-2 ">
      <div className="w-full flex space-x-2 justify-start items-center ">
        <Image
          alt="child"
          src={"/images/childDummy.png"}
          width={150}
          height={150}
          className="aspect-square rounded-lg"
        />
        <div className="w-full">
          <h1 className="text-2xl font-extrabold">Nama Anak</h1>
          <div className="w-full flex justify-start flex-col ">
            <h1>Usia :</h1>
            <h1>Jenis Kelamin :</h1>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChildCard;
