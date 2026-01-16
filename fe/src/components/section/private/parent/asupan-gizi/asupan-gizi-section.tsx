import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import HistoryFood from "@/components/card/food/history-food";
import IotStatus from "@/components/card/iot/iot-status";
import { Button } from "@/components/ui/button";
import { HistoryFoodType } from "@/types/card";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";

interface AsupanGiziSectionProps {
  HistoryFoodData: HistoryFoodType[];
}
const AsupanGiziHeroSection: React.FC<AsupanGiziSectionProps> = ({
  HistoryFoodData,
}) => {
  return (
    <div className="w-full min-h-screen flex justify-start items-center p-2 flex-col space-y-4">
      <div className="w-full">
        <h1 className="text-2xl font-extrabold text-start">Asupan Gizi Anak</h1>
      </div>
      <div className="mt-2 w-full">
        <h1 className="text-lg font-semibold">
          Timbang dan foto makanan si kecil untuk mengetahui kandungan gizinya
        </h1>
      </div>
      <div className="w-full">
        <IotStatus />
      </div>
      <ButtonWrapper
        variant={"btn"}
        className="w-full h-auto text-lg p-4"
        startIcon={
          <Icon
            icon="tabler:line-scan"
            width="50"
            height="50"
            className="scale-150"
          />
        }
      >
        Scan Makanan
      </ButtonWrapper>
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex space-x-2 items-center">
          <Icon
            icon="ic:sharp-history"
            width="24"
            height="24"
            className="text-primary scale-110"
          />
          <h1 className="text-2xl font-bold">Riwayat Asupan Gizi</h1>
        </div>
        <Link href={"/parent/asupan-gizi/riwayat-asupan-gizi"}>
          <Button variant={"btn"} className="font-light">
            Lihat Semua
          </Button>
        </Link>
      </div>
      <div className="w-full space-y-3 ">
        {HistoryFoodData.map((items) => (
          <HistoryFood data={items} key={items.id} />
        ))}
      </div>
    </div>
  );
};

export default AsupanGiziHeroSection;
