import Image from "next/image";

interface ChildrenListProps {
  lengthChild: number;
}
const ChildrenList: React.FC<ChildrenListProps> = ({ lengthChild }) => {
  return (
    <div className="w-full p-2 rounded-lg border border-primary bg-primary/40 flex items-center">
      <Image
        alt="baby"
        src={"/images/baby4.png"}
        width={130}
        height={130}
        className=""
      />
      <div className="w-full flex items-start flex-col">
        <h1 className="text-lg font-bold">Total Balita</h1>
        <p className="text-xl font-bold">
          {lengthChild}
          <span className="font-light text-sm">balita</span>
        </p>
      </div>
    </div>
  );
};

export default ChildrenList;
