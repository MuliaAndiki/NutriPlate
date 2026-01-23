import ChildProgramCard from "@/components/card/child/child-program-card";
import { Spinner } from "@/components/ui/spinner";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ChildRespone } from "@/types/res/child.respone";

interface RegisterProgramProps {
  children: ChildRespone[];
  pathname: string;
  setIdChild: React.Dispatch<React.SetStateAction<string | null>>;
  idChild: string | null;
  isPending: boolean;
  onRegisterChild: () => void;
}

const RegisterProgram: React.FC<RegisterProgramProps> = ({
  children,
  pathname,
  idChild,
  setIdChild,
  isPending,
  onRegisterChild,
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
      <ButtonWrapper
        className="w-full h-auto"
        disabled={isPending || !idChild}
        onClick={() => onRegisterChild()}
      >
        {isPending ? <Spinner /> : "Pilih"}
      </ButtonWrapper>
    </section>
  );
};

export default RegisterProgram;
