import { Card } from "@/components/ui/card";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ChildRespone, GetWeightIorRespone } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IotControllerCardProps {
  onStartScale: () => void;
  onTareScale: () => void;
  isPending: boolean;
  weight: GetWeightIorRespone | null;
  holdingWeight: number;
  isActive: boolean;
  onCancelStart: () => void;
  onHoldWeight: () => void;
  onRejectWeight: () => void;
  onConfirmWeight: () => void;
  iotId: string | null;
  child: ChildRespone[];
  onConnectIot: () => void;
  setSelectChildId: React.Dispatch<React.SetStateAction<string>>;
  selectedChildId: string;
}

const IotControllerCard: React.FC<IotControllerCardProps> = ({
  onStartScale,
  onTareScale,
  isPending,
  weight,
  onCancelStart,
  isActive,
  holdingWeight,
  onHoldWeight,
  onRejectWeight,
  onConfirmWeight,
  iotId,
  onConnectIot,
  child,
  setSelectChildId,
  selectedChildId,
}) => {
  const displayWeight =
    weight?.weight && weight.weight > 0
      ? weight.weight
      : holdingWeight > 0
        ? holdingWeight
        : null;
  return (
    <Card className="w-full p-4">
      <div className="w-full flex items-center justify-center border-b p-4">
        <div className="w-full flex items-center justify-center  p-4">
          {displayWeight !== null ? (
            <h1 className="text-3xl font-bold">
              {displayWeight} <span className="text-base">gram</span>
            </h1>
          ) : (
            <h1 className="text-foreground/80">
              Hasil Timbangan Akan Muncul Disini
            </h1>
          )}
        </div>
      </div>
      <div className="w-full  flex items-center justify-between space-x-3 pb-4 border-b">
        {isActive === true && (
          <div className="w-full flex items-center gap-2">
            <div className="w-full">
              <ButtonWrapper
                variant={"destructive"}
                className="text-background w-full"
                onClick={() => onCancelStart()}
              >
                Hentikan
              </ButtonWrapper>
            </div>
            <div className="w-full">
              <ButtonWrapper
                className="w-full"
                variant={"default"}
                onClick={() => onHoldWeight()}
              >
                Gunakan Berat Ini
              </ButtonWrapper>
            </div>
          </div>
        )}

        {holdingWeight > 0 && (
          <div className="w-full flex items-center gap-2 ">
            <div className="w-full">
              <ButtonWrapper
                variant={"destructive"}
                className="text-background w-full"
                onClick={() => onRejectWeight()}
                disabled={isPending}
              >
                Tolak Berat Ini
              </ButtonWrapper>
            </div>

            <div className="w-full">
              <ButtonWrapper
                variant={"btn"}
                className="text-background w-full"
                disabled={isPending}
                onClick={() => onConfirmWeight()}
              >
                Scan Makanan
              </ButtonWrapper>
            </div>
          </div>
        )}
      </div>
      {iotId === null ? (
        <ButtonWrapper onClick={() => onConnectIot()} className="w-full">
          Connect Iot
        </ButtonWrapper>
      ) : (
        <div className="w-full space-y-2 pb-4 border-b">
          <div className="w-full space-y-2 pb-4 border-b">
            <label className="text-sm font-semibold">Pilih Anak</label>

            <Select
              value={selectedChildId}
              onValueChange={(value) => setSelectChildId(value)}
            >
              <SelectTrigger className="w-full h-auto min-h-[56px]">
                <SelectValue placeholder="Pilih Anak" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Anak</SelectLabel>
                  {child.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      className="w-full h-auto"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{item.fullName}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.gender} • {item.dateOfBirth}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ButtonWrapper
            className="w-full text-destructive  bg-destructive/30 border border-destructive"
            variant={"destructive"}
            disabled={isPending || !selectedChildId}
            onClick={() => onStartScale()}
            leftIcon={<Icon icon="picon:reload" width="16" height="16" />}
          >
            Start Timbangan
          </ButtonWrapper>
          <ButtonWrapper
            onClick={() => onTareScale()}
            disabled={isPending || !selectedChildId}
            leftIcon={
              <Icon
                icon="streamline:star-2-remix"
                width="14"
                height="14"
                className="text-info"
              />
            }
            className="w-full bg-info/30 border border-info text-info"
          >
            Ulangi Proses Timbangan
          </ButtonWrapper>
        </div>
      )}

      <div className="w-full pt-3">
        <label className="text-lg font-bold block mb-2">
          Panduan Penggunaan
        </label>

        <ol className="list-decimal pl-5 space-y-1 text-sm text-foreground/80">
          <li>Pastikan timbangan menyala dan terhubung</li>
          <li>Letakkan piring kosong di atas timbangan</li>
          <li>
            Tekan <b>Reset Timbangan</b>
            <ul className="list-disc pl-5 mt-1">
              <li>Angka akan kembali ke 0 gram</li>
            </ul>
          </li>
          <li>Letakkan makanan di atas piring</li>
          <li>Tunggu hingga angka tidak berubah</li>
          <li>
            Pilih:
            <ul className="list-disc pl-5 mt-1">
              <li>
                <b>Gunakan Berat Ini</b> → lanjut scan makanan
              </li>
              <li>
                <b>Batalkan</b> → timbang ulang
              </li>
            </ul>
          </li>
          <li>
            Jika timbangan bermasalah atau angka tidak normal:
            <ul className="list-disc pl-5 mt-1">
              <li>
                Tekan <b>Ulangi Proses Timbangan</b>
              </li>
              <li>Timbangan siap digunakan kembali</li>
            </ul>
          </li>
        </ol>
      </div>
    </Card>
  );
};

export default IotControllerCard;
