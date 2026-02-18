import { IUserSession } from "@/types/schema/userSession.schema";
import { formatDateTime } from "@/utils/time.format";
interface SessionCardProps {
  res: IUserSession;

  agent: string;
}
const SessionCard: React.FC<SessionCardProps> = ({ res, agent }) => {
  return (
    <div className="w-full flex items-center justify-between border rounded-lg gap-2 p-3">
      <div className="w-full flex items-start justify-center flex-col">
        <h1 className="font-light text-sm">{agent}</h1>
        <p className="text-sm font-light">
          {formatDateTime(res.createdAt, {
            style: "day-date-slash",
          })}
        </p>
      </div>
    </div>
  );
};

export default SessionCard;
