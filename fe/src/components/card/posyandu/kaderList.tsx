import Image from "next/image";
import Link from "next/link";

interface ListKaderProps {
  length: number;
}

const KaderList: React.FC<ListKaderProps> = ({ length }) => {
  return (
    <Link
      href={"/posyandu/daftar-kader"}
      className="w-full p-2 rounded-lg border border-info bg-info/40 flex items-center space-x-1"
    >
      <Image
        alt="baby"
        src={"/images/error.png"}
        width={100}
        height={100}
        className="object-cover"
      />
      <div className="w-full flex items-start flex-col">
        <h1 className="text-sm font-bold">Tersedia</h1>
        <p className="text-xl font-bold">
          {length}
          <span className="font-light text-sm">Kader</span>
        </p>
      </div>
    </Link>
  );
};

export default KaderList;
