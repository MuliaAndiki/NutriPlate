import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { KaderRegistrationDetailResponse } from "@/types/res";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
interface KaderRegisterCardPendingProps {
  res: KaderRegistrationDetailResponse;
  statusStyle: any;
  statusLabelMap: any;
  idRegister: string;
  isPending: boolean;
  setIdRegister: React.Dispatch<React.SetStateAction<string>>;
  onReject: () => void;
  onAccecp: () => void;
}
const KaderRegisterPendingCard: React.FC<KaderRegisterCardPendingProps> = ({
  res,
  statusLabelMap,
  statusStyle,
  idRegister,
  onAccecp,
  onReject,
  setIdRegister,
  isPending,
}) => {
  return (
    <div
      key={res.id}
      onClick={() => {
        if (res.status !== "pending") return;
        setIdRegister(res.id);
      }}
      className={`w-full border rounded-xl p-4 space-y-2 transition
    ${
      res.status === "pending" && idRegister === res.id
        ? "border-primary"
        : "border"
    }
  `}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Image
            alt="avatar"
            src={res.kader?.avaUrl ? res.kader.avaUrl : "/avatars/1.png"}
            width={55}
            height={55}
            className="aspect-square rounded-full object-cover"
          />
          <h2 className="font-bold">{res.kader?.fullName ?? "-"}</h2>
          {res.kader && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1" />
              {res.kader.email}
            </div>
          )}
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle(
            res.status,
          )}`}
        >
          {statusLabelMap[res.status]}
        </span>
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="w-4 h-4 mr-2" />
        Daftar pada {new Date(res.createdAt).toLocaleDateString("id-ID")}
      </div>
      {res.status === "pending" && idRegister === res.id && (
        <div className="w-full flex items-center flex-c justify-between gap-2">
          <div className="w-full">
            <ButtonWrapper
              variant="destructive"
              className="w-full text-background"
              disabled={isPending}
              onClick={onReject}
            >
              Tolak
            </ButtonWrapper>
          </div>

          <div className="w-full">
            <ButtonWrapper
              variant="btn"
              className="w-full"
              disabled={isPending}
              onClick={onAccecp}
            >
              Terima
            </ButtonWrapper>
          </div>
        </div>
      )}
    </div>
  );
};
export default KaderRegisterPendingCard;
