import { Icon } from "@iconify/react";

interface ProfileChildCardProps {
  label: string;
  value: number | string | null;
  unit?: string;
  icon: string;
  color: string;
  border: string;
  header: string;
  text: string;
}

const ProfileChildCard: React.FC<ProfileChildCardProps> = ({
  label,
  value,
  unit,
  icon,
  color,
  header,
  border,
  text,
}) => {
  const isEmpty = value === null || value === undefined || value === "";

  return (
    <div
      className={`w-full border rounded-lg ${border} ${
        isEmpty ? "opacity-60" : ""
      }`}
    >
      <div
        className={`w-full flex justify-start items-center rounded-t-lg ${header} p-2`}
      >
        <Icon icon={icon} width={28} height={28} className={text} />
      </div>

      <div className={`flex flex-col p-2 ${color}`}>
        <h1 className="text-sm font-semibold">{label}</h1>

        {isEmpty ? (
          <p className="text-sm italic text-muted-foreground">Belum ada data</p>
        ) : (
          <p className="text-lg font-extrabold">
            {value}
            {unit && <span className="font-light ml-1">{unit}</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileChildCard;
