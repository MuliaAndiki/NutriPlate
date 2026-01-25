import { Card } from "@/components/ui/card";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { Icon } from "@iconify/react/dist/iconify.js";

const IotControllerCard = () => {
  return (
    <Card className="w-full p-4">
      <div className="w-full flex items-center justify-center border-b p-4">
        <h1 className="text-foreground/80 ">
          Hasil Timbangan Akan Muncul Disini
        </h1>
      </div>
      <div className="w-full  flex items-center justify-between space-x-3 pb-4 border-b">
        <div className="w-full">
          <ButtonWrapper
            variant={"destructive"}
            className="text-background w-full"
          >
            Batalkan
          </ButtonWrapper>
        </div>
        <div className="w-full">
          <ButtonWrapper className="w-full" variant={"default"}>
            Gunakan Berat Ini
          </ButtonWrapper>
        </div>
      </div>
      <div className="w-full space-y-2 pb-4 border-b">
        <ButtonWrapper
          className="w-full text-destructive  bg-destructive/30 border border-destructive"
          variant={"destructive"}
          leftIcon={<Icon icon="picon:reload" width="16" height="16" />}
        >
          Reset Timbangan
        </ButtonWrapper>
        <ButtonWrapper
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
