import Image from "next/image";
import Link from "next/link";

interface ListPosyanduProps {
  length: number;
}

const PosyanduList: React.FC<ListPosyanduProps> = ({ length }) => {
  return (
    <Link
      href={"/kader/daftar-posyandu"}
      className="w-full p-2 rounded-lg border border-info bg-info/40 flex items-center space-x-1"
    >
      <Image
        alt="baby"
        src={"/images/posyandu.png"}
        width={80}
        height={80}
        className=""
      />
      <div className="w-full flex items-start flex-col">
        <h1 className="text-lg font-bold">Tersedia</h1>
        <p className="text-xl font-bold">
          {length}
          <span className="font-light text-sm">Posyandu</span>
        </p>
      </div>
    </Link>
  );
};

export default PosyanduList;
