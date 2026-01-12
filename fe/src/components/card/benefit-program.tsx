import { IProgramNutriPlate } from "@/types/schema/program.schema";

interface BenefitPropgramProps {
  res: IProgramNutriPlate;
}
const BenefitPropgramCard: React.FC<BenefitPropgramProps> = ({ res }) => {
  return (
    <div className="w-full  rounded-lg border">
      <div className="w-full p-4 bg-primary/60 rounded-t-lg">
        <h1 className="text-lg font-bold">Manfaat Mengikuti Program</h1>
      </div>
      <div className="w-full p-4">
        <ul className="list-disc pl-5 ">
          {res.benefit.map((items, key) => (
            <li key={key} className="text-lg font-light">
              {items}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BenefitPropgramCard;
