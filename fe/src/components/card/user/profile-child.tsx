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
  if (value === null || value === undefined) return null;

  return (
    <div className={`w-full border rounded-lg ${border}`}>
      <div
        className={`w-full flex justify-start items-center rounded-t-lg ${header} p-2 `}
      >
        {/* blum fix warna */}
        <Icon icon={icon} width={28} height={28} className={`${text}`} />
      </div>

      <div className={`flex flex-col p-2 ${color}`}>
        <h1 className="text-sm font-semibold">{label}</h1>
        <p className="text-lg font-extrabold ">
          {value} <span className="font-light">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default ProfileChildCard;
