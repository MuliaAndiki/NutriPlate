import { ProfileChildProps } from "@/types/props.type";
import { Icon } from "@iconify/react/dist/iconify.js";

const ProfileChildCard: React.FC<ProfileChildProps> = ({ data }) => {
  return (
    <div className="w-full border  rounded-lg border-blue-400">
      <div className="w-full flex flex-col justify-start items-start rounded-t-lg bg-blue-400/50 p-2 ">
        <Icon icon="ion:scale-outline" width="24" height="24" />
      </div>
      <div className="flex justify-center items-start flex-col p-2 bg-blue-400/20">
        <h1 className="text-lg ">{data.title}</h1>
        <p className="font-extralight">
          <span className="font-extrabold">{data.desc}</span> kg
        </p>
      </div>
    </div>
  );
};

export default ProfileChildCard;
