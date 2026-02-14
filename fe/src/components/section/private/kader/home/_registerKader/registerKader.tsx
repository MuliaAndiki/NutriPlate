import { PosyanduRespone } from "@/types/res";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PosyanduSelectionCard from "@/components/card/posyandu/posyanduSelectionCard";
import { Spinner } from "@/components/ui/spinner";
import EmptyCard from "@/components/fallback/empty-card";

interface RegisterKaderFormProps {
  onRegisterKader: () => void;
  posyandu: PosyanduRespone[];
  posyanduId: string;
  setPosyanduId: React.Dispatch<React.SetStateAction<string>>;
  isPending: boolean;
}

const RegisterKaderForm: React.FC<RegisterKaderFormProps> = ({
  onRegisterKader,
  posyandu,
  posyanduId,
  setPosyanduId,
  isPending,
}) => {
  return (
    <div className="w-full flex justify-center flex-col items-center space-y-4">
      <h1 className="text-lg font-semibold">Daftar Posyandu</h1>

      <div className="w-full">
        {posyandu.length === 0 ? (
          <EmptyCard message="Belum ada posyandu tersedia" />
        ) : (
          <Select
            value={posyanduId}
            onValueChange={(value) => setPosyanduId(value)}
          >
            <SelectTrigger className="w-full h-auto min-h-[64px]">
              <SelectValue placeholder="Pilih Posyandu" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Posyandu</SelectLabel>

                {posyandu.map((items) => (
                  <SelectItem
                    key={items.id}
                    value={String(items.id)}
                    className="w-full h-auto"
                  >
                    <PosyanduSelectionCard res={items} />
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      <button
        disabled={!posyanduId || isPending || posyandu.length === 0}
        onClick={onRegisterKader}
        className="w-full py-2 rounded-lg bg-primary text-background text-sm font-medium disabled:opacity-50"
      >
        {isPending ? <Spinner /> : " Daftar"}
      </button>
    </div>
  );
};

export default RegisterKaderForm;
