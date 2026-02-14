import Image from "next/image";

interface BalitaWarningProps {
  lengthChild: number;
}
const BalitaWarningList: React.FC<BalitaWarningProps> = ({ lengthChild }) => {
  return (
    <div className="w-full p-2 rounded-lg border border-destructive bg-destructive/40 flex items-center space-x-1">
      <Image
        alt="baby"
        src={"/images/error.png"}
        width={100}
        height={100}
        className=""
      />
      <div className="w-full flex items-start flex-col">
        <h1 className="text-lg font-bold">Balita Kurang Gizi</h1>
        <p className="text-xl font-bold">
          {lengthChild}
          <span className="font-light text-sm">balita</span>
        </p>
      </div>
    </div>
  );
};

export default BalitaWarningList;
