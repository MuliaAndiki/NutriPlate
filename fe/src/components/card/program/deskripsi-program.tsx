import { IProgram } from "@/types/schema/program.schema";

interface DeskripsiPropgramProps {
  res: IProgram;
}
const DeskripsiPropgramCard: React.FC<DeskripsiPropgramProps> = ({ res }) => {
  return (
    <div className="w-full  rounded-lg border">
      <div className="w-full p-4 bg-primary/60 rounded-t-lg">
        <h1 className="text-lg font-bold">Deskripsi Program</h1>
      </div>
      <div className="w-full p-4">
        <p>{res.description}</p>
      </div>
    </div>
  );
};

export default DeskripsiPropgramCard;
