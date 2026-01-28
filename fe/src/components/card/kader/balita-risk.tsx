import Image from "next/image";

interface BalitaRiskProps {
  lengthChild: number;
}
const BalitaRiskList: React.FC<BalitaRiskProps> = ({ lengthChild }) => {
  return (
    <div className="w-full p-2 rounded-lg border border-warning bg-warning/40 flex items-center space-x-1">
      <Image
        alt="baby"
        src={"/images/warning.png"}
        width={100}
        height={100}
        className=""
      />
      <div className="w-full flex items-start flex-col">
        <h1 className="text-lg font-bold">Balita Berisiko</h1>
        <p className="text-xl font-bold">
          {lengthChild}
          <span className="font-light text-sm">balita</span>
        </p>
      </div>
    </div>
  );
};

export default BalitaRiskList;
