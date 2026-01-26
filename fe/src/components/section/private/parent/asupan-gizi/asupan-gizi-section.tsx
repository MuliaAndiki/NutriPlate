import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import HistoryFood from "@/components/card/food/history-food";
import IotStatus from "@/components/card/iot/iot-status";
import { Button } from "@/components/ui/button";
import PopUp from "@/components/ui/pop-up";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import IotControllerCard from "@/components/card/iot/iot-controller";
import { FoodIntakeResponse } from "@/types/res";

interface AsupanGiziSectionProps {
  service: {
    query: {
      historyFood: FoodIntakeResponse[];
      isLoading: boolean;
    };
  };
  actions: {
    onOpenScanPopUp: () => void;
    handleSelectTaskScan: () => void;
    handleSelectManualScan: () => void;
  };
  state: {
    showFlowPopUp: boolean;
    setShowFlowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
const AsupanGiziHeroSection: React.FC<AsupanGiziSectionProps> = ({
  service,
  actions,
  state,
}) => {
  if (service.query.isLoading) {
    return <div>loading..</div>;
  }
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
      <div className="w-full flex items-center">
        <Icon
          icon="fluent:iot-16-regular"
          width="36"
          height="36"
          className="text-primary"
        />
        <h1 className="text-2xl font-bold">Kontrol Timbangan</h1>
      </div>
      <div className="w-full">
        <IotControllerCard />
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
        //disable iot conecction

        onClick={actions.onOpenScanPopUp}
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
        {service.query.historyFood.length > 5 && (
          <Link href={"/parent/asupan-gizi/riwayat-asupan-gizi"}>
            <Button variant={"btn"} className="font-light">
              Lihat Semua
            </Button>
          </Link>
        )}
      </div>

      <div className="w-full space-y-3 ">
        {service.query.historyFood.slice(0, 4).map((items) => (
          <HistoryFood res={items} key={items.id} />
        ))}
      </div>

      <PopUp
        isOpen={state.showFlowPopUp}
        onClose={() => state.setShowFlowPopUp(false)}
      >
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-bold text-center">Pilih Mode Scan</h2>
          <p className="text-center text-muted-foreground">
            Pilih cara Anda ingin scan makanan
          </p>

          <div className="w-full space-y-3 pt-4">
            <ButtonWrapper
              className="w-full h-auto p-4 flex flex-col items-center"
              onClick={actions.handleSelectManualScan}
            >
              <p className="font-semibold text-lg"> Scan Manual</p>
            </ButtonWrapper>

            <ButtonWrapper
              variant="outline"
              className="w-full h-auto p-4 flex flex-col items-center"
              onClick={actions.handleSelectTaskScan}
            >
              <p className="font-semibold text-lg"> Selesaikan Task</p>
            </ButtonWrapper>
          </div>

          <ButtonWrapper
            variant="outline"
            className="w-full"
            onClick={() => state.setShowFlowPopUp(false)}
          >
            Batal
          </ButtonWrapper>
        </div>
      </PopUp>
    </div>
  );
};

export default AsupanGiziHeroSection;
