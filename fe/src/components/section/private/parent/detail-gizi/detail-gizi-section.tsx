import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DetailGiziHeroProps {
  router: AppRouterInstance;
}
const DetailGiziHeroSection: React.FC<DetailGiziHeroProps> = ({ router }) => {
  return (
    <div className="w-full flex min-h-screen flex-col justify-start items-center ">
      <div className="w-full flex items-center justify-start">
        <ChevronLeft size={35} onClick={() => router.back()} />
        <h1 className="text-2xl font-extrabold">Detail Gizi</h1>
      </div>
    </div>
  );
};

export default DetailGiziHeroSection;
