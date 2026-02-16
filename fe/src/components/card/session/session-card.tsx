import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { IUserSession } from "@/types/schema/userSession.schema";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SessionCardProps {
  res: IUserSession;
  onDetail?: () => void;
  agent: string;
}
const SessionCard: React.FC<SessionCardProps> = ({ res, onDetail, agent }) => {
  return (
    <div className="w-full flex items-center justify-between border rounded-lg p-3">
      <div className="w-full flex items-start justify-center flex-col">
        <h1 className="font-light">{agent}</h1>
        <p className="text-sm font-light">
          {formatDateTime(res.createdAt, {
            style: "day-date-slash",
          })}
        </p>
      </div>
      <ButtonWrapper
        variant={"destructive"}
        className="text-background"
        onClick={() => onDetail!()}
        rightIcon={
          <Icon icon="material-symbols:logout" width="24" height="24" />
        }
      >
        Detail
      </ButtonWrapper>
    </div>
  );
};

export default SessionCard;
