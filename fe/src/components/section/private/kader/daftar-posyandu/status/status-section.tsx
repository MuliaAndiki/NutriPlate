import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { StatusRegisterionsKader } from "@/types/partial";
import { KaderRegistrationDetailResponse } from "@/types/res";
import { ChevronLeft, MapPin, Clock } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface StatusKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      myRegister: KaderRegistrationDetailResponse[];
      isLoading: boolean;
    };
  };
  state: {
    value: StatusRegisterionsKader;
    onChange: (value: StatusRegisterionsKader) => void;
  };
}

const statusLabelMap: Record<StatusRegisterionsKader, string> = {
  all: "Semua",
  pending: "Menunggu",
  accepted: "Diterima",
  rejected: "Ditolak",
};

const statusStyle = (status: KaderRegistrationDetailResponse["status"]) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const StatusKaderSection: React.FC<StatusKaderSectionProps> = ({
  namespace,
  service,
  state,
}) => {
  if (service.query.isLoading) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Memuat status...</p>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen flex flex-col p-3 space-y-3">
      <div className="flex items-center space-x-2">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-xl font-bold">Status Pendaftaran Kader</h1>
      </div>

      <div className="flex space-x-2 w-full justify-center pb-1">
        {(Object.keys(statusLabelMap) as StatusRegisterionsKader[]).map(
          (key) => (
            <ButtonWrapper
              key={key}
              onClick={() => state.onChange(key)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border transition
              ${
                state.value === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground"
              }`}
            >
              {statusLabelMap[key]}
            </ButtonWrapper>
          ),
        )}
      </div>

      {service.query.myRegister.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          Data tidak ditemukan
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          {service.query.myRegister.map((item) => (
            <div
              key={item.id}
              className="w-full border rounded-xl p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold">{item.posyandu?.name ?? "-"}</h2>
                  {item.posyandu && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.posyandu.district}, {item.posyandu.village}
                    </div>
                  )}
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle(
                    item.status,
                  )}`}
                >
                  {statusLabelMap[item.status]}
                </span>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                Daftar pada{" "}
                {new Date(item.createdAt).toLocaleDateString("id-ID")}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default StatusKaderSection;
