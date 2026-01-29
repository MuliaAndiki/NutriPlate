import { KaderRegistrationDetailResponse } from "@/types/res";
import { Clock, MapPin } from "lucide-react";

interface KaderRegisterCardProps {
  res: KaderRegistrationDetailResponse;
  statusStyle: any;
  statusLabelMap: any;
}
const KaderRegisterCard: React.FC<KaderRegisterCardProps> = ({
  res,
  statusLabelMap,
  statusStyle,
}) => {
  return (
    <div key={res.id} className="w-full border rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold">{res.posyandu?.name ?? "-"}</h2>
          {res.posyandu && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1" />
              {res.posyandu.district}, {res.posyandu.village}
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
    </div>
  );
};
export default KaderRegisterCard;
