import ChildProgramCard from "@/components/card/child/child-program-card";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ChildRespone } from "@/types/res/child.respone";

interface RegisterProgramProps {
  children: ChildRespone[];
  pathname: string;
  setIdChild: React.Dispatch<React.SetStateAction<string | null>>;
  idChild: string | null;
}

const RegisterProgram: React.FC<RegisterProgramProps> = ({
  children,
  pathname,
  idChild,
  setIdChild,
}) => {
  return (
    <section className="w-full h-full flex items-center justify-center flex-col space-y-3">
      <h1 className="text-lg font-bold">Pilih anak yang akan ikut program</h1>
      <div className="w-full">
        {children.map((items) => (
          <ChildProgramCard
            idChild={idChild}
            setIdChild={setIdChild}
            childType={items}
            key={items.id}
            pathname={pathname}
          />
        ))}
      </div>
      <ButtonWrapper className="w-full h-auto">Pilih</ButtonWrapper>
    </section>
  );
};

export default RegisterProgram;
