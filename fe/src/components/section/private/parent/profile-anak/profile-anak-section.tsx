import ChildFallback from "@/components/fallback/child.fallback";

const ProfileAnakHeroSection = () => {
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full">
        <h1 className="text-3xl font-extrabold">Profile Anak</h1>
      </div>
      <p className="font-extrabold text-lg">
        Pantau tumbuh kembang dan asupan gizi anak Anda
      </p>
      <div className="w-full">
        <ChildFallback />
      </div>
    </div>
  );
};

export default ProfileAnakHeroSection;
