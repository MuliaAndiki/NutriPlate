import { Card } from "../ui/card";
import Image from "next/image";

const ChildFallback = () => {
  return (
    <Card className="w-full  p-2">
      <div className="w-full flex justify-center items-center flex-col">
        <Image
          alt="child"
          src={"/fallback/child.svg"}
          width={130}
          height={130}
          className="aspect-square rounded-lg"
        />
        <h1 className="text-bold font-bold text-foreground/60">
          Belum Ada Data Anak
        </h1>
      </div>
    </Card>
  );
};

export default ChildFallback;
