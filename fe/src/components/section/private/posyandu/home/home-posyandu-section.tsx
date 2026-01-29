import ChildrenList from "@/components/card/child/children-list";
import HeaderHomeCard from "@/components/card/general/header/home";
import BalitaRiskList from "@/components/card/kader/balita-risk";
import BalitaWarningList from "@/components/card/kader/balita-warning";
import KaderList from "@/components/card/posyandu/kaderList";
import {
  ChildListByPosyanduData,
  KaderDetailResponse,
  MeasurementRespone,
  UserResponse,
} from "@/types/res";

interface HomePosyanduHeroSectionProps {
  service: {
    query: {
      profile: UserResponse;
      isLoading: boolean;
      childInPosyandu: ChildListByPosyanduData[];
      kader: KaderDetailResponse[];
      measurement: MeasurementRespone[];
    };
  };
}
const HomePosyanduHeroSection: React.FC<HomePosyanduHeroSectionProps> = ({
  service,
}) => {
  if (service.query.isLoading) {
    return <div>loading..</div>;
  }
  const lengthChild = service.query.childInPosyandu.length;
  const nutritionStatusLenghtWarning = service.query.measurement.filter(
    (item) => item.nutritionStatus === "severely_underweight",
  ).length;
  const nutritionStatusLenghtError = service.query.measurement.filter(
    (item) => item.nutritionStatus === "underweight",
  ).length;
  const KaderLenght = service.query.kader.length;
  return (
    <section className="w-full overflow-hidden">
      <HeaderHomeCard
        res={service.query.profile ?? null}
        role={service.query.profile.role}
      />

      <section className="relative z-10 bg-background px-4  rounded-t-3xl  space-y-1">
        <div className="w-full p-2 grid grid-cols-2 grid-rows-2 gap-2">
          <ChildrenList lengthChild={lengthChild} />
          <BalitaRiskList lengthChild={nutritionStatusLenghtWarning} />
          <BalitaWarningList lengthChild={nutritionStatusLenghtError} />
          <KaderList length={KaderLenght} />
        </div>
      </section>
    </section>
  );
};

export default HomePosyanduHeroSection;
